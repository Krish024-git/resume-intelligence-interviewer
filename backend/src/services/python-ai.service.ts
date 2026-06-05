import { config } from "../config";
import type {
  PythonQuestion,
  PythonEvaluation,
  PythonCareerInsights,
} from "../types";

class PythonAIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.pythonAiUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Python AI service error: ${error}`);
    }

    return response.json() as Promise<T>;
  }

  async extractSkills(resumeText: string): Promise<string[]> {
    const result = await this.request<{ skills: string[] }>(
      "/api/extract-skills",
      {
        method: "POST",
        body: JSON.stringify({ resume_text: resumeText }),
      }
    );
    return result.skills;
  }

  async extractTextFromPdf(filePath: string): Promise<string> {
    const result = await this.request<{ text: string }>(
      "/api/extract-pdf-text",
      {
        method: "POST",
        body: JSON.stringify({ file_path: filePath }),
      }
    );
    return result.text;
  }

  async generateQuestions(params: {
    role: string;
    experience: string;
    numQuestions: number;
    mode: string;
    skills?: string[];
    resumeText?: string;
    difficulty?: string;
  }): Promise<PythonQuestion[]> {
    const result = await this.request<{ questions: PythonQuestion[] }>(
      "/api/generate-questions",
      {
        method: "POST",
        body: JSON.stringify({
          role: params.role,
          experience: params.experience,
          num_questions: params.numQuestions,
          mode: params.mode,
          skills: params.skills,
          resume_text: params.resumeText,
          difficulty: params.difficulty,
        }),
      }
    );
    return result.questions;
  }

  async evaluateAnswer(
    question: string,
    answer: string
  ): Promise<PythonEvaluation> {
    const result = await this.request<PythonEvaluation>(
      "/api/evaluate-answer",
      {
        method: "POST",
        body: JSON.stringify({ question, answer }),
      }
    );
    return result;
  }

  async generateFollowup(
    question: string,
    answer: string
  ): Promise<PythonQuestion> {
    const result = await this.request<{ followup: PythonQuestion }>(
      "/api/followup",
      {
        method: "POST",
        body: JSON.stringify({ question, answer }),
      }
    );
    return result.followup;
  }

  async generateCareerSuggestions(
    report: string
  ): Promise<PythonCareerInsights> {
    const result = await this.request<PythonCareerInsights>(
      "/api/career-suggestions",
      {
        method: "POST",
        body: JSON.stringify({ report }),
      }
    );
    return result;
  }

  async generatePdfReport(sessionData: Record<string, unknown>): Promise<Buffer> {
    const response = await fetch(`${this.baseUrl}/api/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF report");
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}

export const pythonAI = new PythonAIService();
