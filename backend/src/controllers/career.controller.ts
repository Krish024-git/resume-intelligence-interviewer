import { Response } from "express";
import { prisma } from "../lib/prisma";
import { pythonAI } from "../services/python-ai.service";
import { AuthRequest } from "../types";

export async function getCareerSuggestions(req: AuthRequest, res: Response) {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

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

  const reportText = JSON.stringify({
    role: session.role,
    experience: session.experience,
    type: session.type,
    averageScore: session.averageScore,
    evaluations: session.evaluations.map((e) => ({
      score: e.score,
      feedback: e.feedback,
      strengths: e.strengths,
      weaknesses: e.weaknesses,
    })),
  });

  try {
    const insights = await pythonAI.generateCareerSuggestions(reportText);
    res.json({ insights });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Career suggestions failed",
    });
  }
}
