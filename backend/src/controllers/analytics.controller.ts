import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../types";
import { SessionStatus } from "@prisma/client";

export async function getHistory(req: AuthRequest, res: Response) {
  const sessions = await prisma.interviewSession.findMany({
    where: {
      userId: req.userId,
      status: SessionStatus.COMPLETED,
    },
    orderBy: { completedAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  const history = sessions.map((s) => ({
    id: s.id,
    role: s.role,
    experience: s.experience,
    type: s.type,
    averageScore: s.averageScore || 0,
    questionCount: s._count.questions,
    completedAt: (s.completedAt || s.createdAt).toISOString(),
  }));

  res.json(history);
}

export async function getAnalytics(req: AuthRequest, res: Response) {
  const sessions = await prisma.interviewSession.findMany({
    where: {
      userId: req.userId,
      averageScore: { not: null },
    },
    orderBy: { createdAt: "asc" },
    include: { evaluations: true },
  });

  if (sessions.length === 0) {
    return res.json({
      totalInterviews: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      improvementTrend: 0,
      scores: [],
      performanceByType: [],
      heatmap: [],
    });
  }

  const scores = sessions.map((s) => s.averageScore!);
  const firstScore = scores[0];
  const latestScore = scores[scores.length - 1];

  const typeMap = new Map<string, number[]>();
  for (const s of sessions) {
    const existing = typeMap.get(s.type) || [];
    existing.push(s.averageScore!);
    typeMap.set(s.type, existing);
  }

  const performanceByType = Array.from(typeMap.entries()).map(([type, typeScores]) => ({
    type,
    score: typeScores.reduce((a, b) => a + b, 0) / typeScores.length,
  }));

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const heatmap: { day: string; hour: number; count: number }[] = [];

  for (const day of days) {
    for (const hour of hours) {
      heatmap.push({ day, hour, count: 0 });
    }
  }

  for (const s of sessions) {
    const date = s.completedAt || s.createdAt;
    const dayIndex = date.getDay();
    const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1];
    const hour = date.getHours();
    const entry = heatmap.find((h) => h.day === dayName && h.hour === hour);
    if (entry) entry.count++;
  }

  res.json({
    totalInterviews: sessions.length,
    averageScore: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    improvementTrend: Math.round((latestScore - firstScore) * 10) / 10,
    scores: sessions.map((s) => ({
      date: (s.completedAt || s.createdAt).toISOString().split("T")[0],
      score: s.averageScore!,
    })),
    performanceByType,
    heatmap,
  });
}

export async function getDashboard(req: AuthRequest, res: Response) {
  const sessions = await prisma.interviewSession.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  const completed = sessions.filter((s) => s.averageScore !== null);
  const scores = completed.map((s) => s.averageScore!);

  const recentActivity = sessions.slice(0, 5).map((s) => ({
    id: s.id,
    role: s.role,
    experience: s.experience,
    type: s.type,
    averageScore: s.averageScore || 0,
    questionCount: s._count.questions,
    completedAt: (s.completedAt || s.createdAt).toISOString(),
  }));

  res.json({
    totalInterviews: sessions.length,
    averageScore: scores.length
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0,
    bestScore: scores.length ? Math.max(...scores) : 0,
    improvementTrend:
      scores.length >= 2
        ? Math.round((scores[0] - scores[scores.length - 1]) * 10) / 10
        : 0,
    recentActivity,
  });
}
