export type InterviewType = "technical" | "hr" | "resume" | "mixed";
export type Difficulty = "easy" | "medium" | "hard";
export type InterviewStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  extractedText: string;
  skills: string[];
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: InterviewType;
  difficulty: Difficulty;
  order: number;
}

export interface Answer {
  id: string;
  questionId: string;
  text: string;
  characterCount: number;
  submittedAt: string;
}

export interface Evaluation {
  id: string;
  questionId: string;
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  resumeId?: string;
  role: string;
  experience: string;
  type: InterviewType;
  difficulty: Difficulty;
  questionCount: number;
  status: InterviewStatus;
  questions: Question[];
  answers: Answer[];
  evaluations: Evaluation[];
  averageScore?: number;
  createdAt: string;
  completedAt?: string;
}

export interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  improvementTrend: number;
  scores: { date: string; score: number }[];
  performanceByType: { type: string; score: number }[];
  heatmap: { day: string; hour: number; count: number }[];
}

export interface CareerInsights {
  skillGaps: { skill: string; current: number; required: number }[];
  learningRoadmap: { phase: string; skills: string[]; duration: string }[];
  recommendedTechnologies: string[];
  careerSuggestions: string;
}

export interface HistoryItem {
  id: string;
  role: string;
  experience: string;
  type: InterviewType;
  averageScore: number;
  questionCount: number;
  completedAt: string;
}

export interface DashboardKPIs {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  improvementTrend: number;
  recentActivity: HistoryItem[];
}

// API Request/Response types
export interface UploadResumeRequest {
  file: File;
}

export interface UploadResumeResponse {
  resume: Resume;
  skills: string[];
}

export interface GenerateQuestionsRequest {
  role: string;
  experience: string;
  type: InterviewType;
  difficulty: Difficulty;
  questionCount: number;
  resumeId?: string;
  skills?: string[];
}

export interface GenerateQuestionsResponse {
  sessionId: string;
  questions: Question[];
}

export interface EvaluateAnswerRequest {
  sessionId: string;
  questionId: string;
  questionText?: string;
  answer: string;
}

export interface EvaluateAnswerResponse {
  evaluation: Evaluation;
  averageScore: number;
}

export interface FollowupRequest {
  sessionId: string;
  questionId: string;
  questionText?: string;
  answer: string;
}

export interface FollowupResponse {
  followupQuestion: Question;
}

export interface CareerSuggestionsRequest {
  sessionId: string;
}

export interface CareerSuggestionsResponse {
  insights: CareerInsights;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
}
