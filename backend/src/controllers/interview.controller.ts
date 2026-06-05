import { Response } from "express";
import { prisma } from "../lib/prisma";
import { pythonAI } from "../services/python-ai.service";
import { AuthRequest } from "../types";
import { InterviewType, Difficulty, SessionStatus } from "@prisma/client";

export async function generateQuestions(req: AuthRequest, res: Response) {
  const {
    role,
    experience,
    type,
    difficulty,
    questionCount,
    resumeId,
    skills,
  } = req.body;

  if (!role || !experience || !type || !difficulty || !questionCount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const userId = req.userId!;
  let resumeText: string | undefined;

  if (resumeId) {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });
    if (resume) {
      resumeText = resume.extractedText;
    }
  }

  try {
    const aiQuestions = await pythonAI.generateQuestions({
      role,
      experience,
      numQuestions: questionCount,
      mode: type,
      skills,
      resumeText,
      difficulty,
    });

    const session = await prisma.interviewSession.create({
      data: {
        userId,
        resumeId: resumeId || null,
        role,
        experience,
        type: type as InterviewType,
        difficulty: difficulty as Difficulty,
        questionCount,
        status: SessionStatus.IN_PROGRESS,
        questions: {
          create: aiQuestions.map((q, i) => ({
            text: q.text,
            type: type as InterviewType,
            difficulty: difficulty as Difficulty,
            order: i + 1,
          })),
        },
      },
      include: { questions: true },
    });

    res.status(201).json({
      sessionId: session.id,
      questions: session.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        difficulty: q.difficulty,
        order: q.order,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Question generation failed",
    });
  }
}

export async function evaluateAnswer(req: AuthRequest, res: Response) {
  const { sessionId, questionId, answer } = req.body;

  if (!sessionId || !questionId || !answer) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId: req.userId },
    include: { questions: true, evaluations: true },
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const question = session.questions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  try {
    const aiEval = await pythonAI.evaluateAnswer(question.text, answer);

    await prisma.answer.create({
      data: {
        sessionId,
        questionId,
        text: answer,
        characterCount: answer.length,
      },
    });

    const evaluation = await prisma.evaluation.create({
      data: {
        sessionId,
        questionId,
        score: aiEval.score,
        feedback: aiEval.feedback,
        strengths: aiEval.strengths || [],
        weaknesses: aiEval.weaknesses || [],
        recommendations: aiEval.recommendations || [],
      },
    });

    const allEvals = await prisma.evaluation.findMany({
      where: { sessionId },
    });
    const averageScore =
      allEvals.reduce((sum, e) => sum + e.score, 0) / allEvals.length;

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { averageScore },
    });

    res.json({
      evaluation: {
        id: evaluation.id,
        questionId: evaluation.questionId,
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        recommendations: evaluation.recommendations,
      },
      averageScore,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Evaluation failed",
    });
  }
}

export async function followup(req: AuthRequest, res: Response) {
  const { sessionId, questionId, answer } = req.body;

  if (!sessionId || !questionId || !answer) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId: req.userId },
    include: { questions: true },
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const question = session.questions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  try {
    const followupQ = await pythonAI.generateFollowup(question.text, answer);

    const newQuestion = await prisma.question.create({
      data: {
        sessionId,
        text: followupQ.text,
        type: question.type,
        difficulty: question.difficulty,
        order: question.order + 1,
        isFollowup: true,
      },
    });

    res.json({
      followupQuestion: {
        id: newQuestion.id,
        text: newQuestion.text,
        type: newQuestion.type,
        difficulty: newQuestion.difficulty,
        order: newQuestion.order,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Follow-up generation failed",
    });
  }
}
