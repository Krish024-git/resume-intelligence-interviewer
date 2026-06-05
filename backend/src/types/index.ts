import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface PythonQuestion {
  id?: string;
  text: string;
  type?: string;
  difficulty?: string;
}

export interface PythonEvaluation {
  score: number;
  feedback: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

export interface PythonCareerInsights {
  skillGaps: { skill: string; current: number; required: number }[];
  learningRoadmap: { phase: string; skills: string[]; duration: string }[];
  recommendedTechnologies: string[];
  careerSuggestions: string;
}
