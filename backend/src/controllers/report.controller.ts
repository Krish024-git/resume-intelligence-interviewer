import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";
import { pythonAI } from "../services/python-ai.service";
import { config } from "../config";
import { AuthRequest } from "../types";

export async function downloadReport(req: AuthRequest, res: Response) {
  const sessionId = String(req.params.sessionId);

  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId: req.userId },
    include: {
      questions: true,
      answers: true,
      evaluations: true,
    },
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  try {
    const pdfBuffer = await pythonAI.generatePdfReport({
      session_id: session.id,
      role: session.role,
      experience: session.experience,
      type: session.type,
      average_score: session.averageScore,
      questions: session.questions,
      answers: session.answers,
      evaluations: session.evaluations,
    });

    const reportsDir = config.reportsDir;
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filePath = path.join(reportsDir, `${sessionId}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);

    const existing = await prisma.report.findFirst({
      where: { sessionId },
    });

    if (existing) {
      await prisma.report.update({
        where: { id: existing.id },
        data: { filePath },
      });
    } else {
      await prisma.report.create({
        data: {
          sessionId,
          userId: req.userId!,
          filePath,
        },
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="interview-report-${sessionId}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Report generation failed",
    });
  }
}

export async function shareReport(req: AuthRequest, res: Response) {
  const sessionId = String(req.params.sessionId);
  const shareToken = uuidv4();

  const report = await prisma.report.findFirst({
    where: { sessionId, userId: req.userId },
  });

  if (!report) {
    return res.status(404).json({ message: "Report not found. Generate it first." });
  }

  await prisma.report.update({
    where: { id: report.id },
    data: { shareToken },
  });

  res.json({
    shareUrl: `${config.corsOrigin}/shared/${shareToken}`,
  });
}
