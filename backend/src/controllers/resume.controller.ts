import { Response } from "express";
import { prisma } from "../lib/prisma";
import { pythonAI } from "../services/python-ai.service";
import { AuthRequest } from "../types";

export async function uploadResume(req: AuthRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const userId = req.userId!;

  try {
    const extractedText = await pythonAI.extractTextFromPdf(req.file.path);
    const skills = await pythonAI.extractSkills(extractedText);

    const resume = await prisma.resume.create({
      data: {
        userId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileUrl: `/uploads/${req.file.filename}`,
        extractedText,
        skills,
      },
    });

    res.status(201).json({
      resume: {
        id: resume.id,
        userId: resume.userId,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        extractedText: resume.extractedText,
        skills: resume.skills,
        createdAt: resume.createdAt.toISOString(),
      },
      skills,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Resume processing failed",
    });
  }
}
