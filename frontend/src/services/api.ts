import type {
  UploadResumeResponse,
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
  EvaluateAnswerRequest,
  EvaluateAnswerResponse,
  FollowupRequest,
  FollowupResponse,
  CareerSuggestionsRequest,
  CareerSuggestionsResponse,
  AnalyticsData,
  HistoryItem,
  DashboardKPIs,
  AuthResponse,
  InterviewSession,
  Question,
  Evaluation,
} from "@/types";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const commonSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Python",
  "Flask",
  "Django",
  "Java",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "REST",
  "GraphQL",
  "Machine Learning",
  "Data Structures",
  "System Design",
];

class ApiClient {
  setToken(_token: string | null) {}

  private async aiRequest<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {
      throw new Error("Start the Python AI service on http://localhost:5000.");
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "AI service request failed",
      }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async aiFileRequest<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      method: "POST",
      body: formData,
    }).catch(() => {
      throw new Error("Start the Python AI service on http://localhost:5000.");
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "AI service request failed",
      }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async login(email: string, _password: string): Promise<AuthResponse> {
    const name = email.split("@")[0] || "Guest";
    return {
      token: "local-session",
      user: {
        id: "local-user",
        email,
        name,
        createdAt: new Date().toISOString(),
      },
    };
  }

  async register(
    name: string,
    email: string,
    _password: string
  ): Promise<AuthResponse> {
    return {
      token: "local-session",
      user: {
        id: "local-user",
        email,
        name,
        createdAt: new Date().toISOString(),
      },
    };
  }

  async uploadResume(file: File): Promise<UploadResumeResponse> {
    const formData = new FormData();
    formData.append("resume", file);

    const analysis = await this.aiFileRequest<{
      text?: string;
      skills?: string[];
    }>("/analyze-resume", formData);

    const extractedText = analysis.text || file.name.replace(/[-_]/g, " ");
    const skills = analysis.skills?.length
      ? analysis.skills
      : await this.extractSkills(extractedText);

    const resume = {
      id: `resume-${Date.now()}`,
      userId: "local-user",
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      extractedText,
      skills,
      createdAt: new Date().toISOString(),
    };

    return { resume, skills };
  }

  async generateQuestions(
    data: GenerateQuestionsRequest
  ): Promise<GenerateQuestionsResponse> {
    const result = await this.aiRequest<{
      questions: Array<string | { text?: string; question?: string; type?: string; difficulty?: string }>;
    }>("/generate-questions", {
      role: data.role,
      experience: data.experience,
      num_questions: data.questionCount,
      mode: data.type,
      skills: data.skills || [],
      difficulty: data.difficulty,
    });

    return {
      sessionId: `session-${Date.now()}`,
      questions: result.questions.map((question, index) => ({
        id: `q-${Date.now()}-${index + 1}`,
        text: cleanQuestionText(
          typeof question === "string"
            ? question
            : question.text || question.question || String(question)
        ),
        type: data.type,
        difficulty: data.difficulty,
        order: index + 1,
      })),
    };
  }

  async evaluateAnswer(
    data: EvaluateAnswerRequest
  ): Promise<EvaluateAnswerResponse> {
    const result = await this.aiRequest<{
      score?: number;
      feedback?: string;
      strengths?: string[];
      weaknesses?: string[];
      recommendations?: string[];
    }>("/evaluate-answer", {
      question: data.questionText || data.questionId,
      answer: data.answer,
    });

    const evaluation: Evaluation = {
      id: `eval-${Date.now()}`,
      questionId: data.questionId,
      score: Number(result.score ?? 0),
      feedback: result.feedback || "No feedback returned.",
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      recommendations: result.recommendations || [],
    };

    return { evaluation, averageScore: evaluation.score };
  }

  async getFollowup(data: FollowupRequest): Promise<FollowupResponse> {
    const result = await this.aiRequest<{ followup?: { text?: string } }>("/followup", {
      question: data.questionText || data.questionId,
      answer: data.answer,
    });

    const followupQuestion: Question = {
      id: `fq-${Date.now()}`,
      text: result.followup?.text || "Can you explain that in more detail?",
      type: "mixed",
      difficulty: "medium",
      order: Date.now(),
    };

    return { followupQuestion };
  }

  async getCareerSuggestions(
    _data: CareerSuggestionsRequest
  ): Promise<CareerSuggestionsResponse> {
    const result = await this.aiRequest<{
      skillGaps?: CareerSuggestionsResponse["insights"]["skillGaps"];
      learningRoadmap?: CareerSuggestionsResponse["insights"]["learningRoadmap"];
      recommendedTechnologies?: string[];
      careerSuggestions?: string;
    }>("/career-suggestions", {
      report: "Generate concise career suggestions from the current interview practice session.",
    });

    return {
      insights: {
        skillGaps: result.skillGaps || [],
        learningRoadmap: result.learningRoadmap || [],
        recommendedTechnologies: result.recommendedTechnologies || [],
        careerSuggestions: result.careerSuggestions || "",
      },
    };
  }

  private storageKey = "ai-interview-sessions";

  private loadStoredSessions(): InterviewSession[] {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const sessions = JSON.parse(raw) as InterviewSession[];
      return Array.isArray(sessions) ? sessions : [];
    } catch {
      return [];
    }
  }

  private persistStoredSessions(sessions: InterviewSession[]) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(sessions));
  }

  private sessionToHistoryItem(session: InterviewSession): HistoryItem {
    return {
      id: session.id,
      role: session.role,
      experience: session.experience,
      type: session.type,
      averageScore: session.averageScore ?? 0,
      questionCount: session.questionCount,
      completedAt: session.completedAt || session.createdAt,
    };
  }

  async saveSession(session: InterviewSession): Promise<void> {
    const sessions = this.loadStoredSessions();
    const index = sessions.findIndex((item) => item.id === session.id);

    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }

    this.persistStoredSessions(sessions);
  }

  async getSession(sessionId: string): Promise<InterviewSession | null> {
    const sessions = this.loadStoredSessions();
    return sessions.find((session) => session.id === sessionId) ?? null;
  }

  async getHistory(): Promise<HistoryItem[]> {
    const sessions = this.loadStoredSessions().filter((session) => session.status === "completed");

    return sessions
      .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())
      .map((session) => this.sessionToHistoryItem(session));
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const sessions = this.loadStoredSessions().filter((session) => session.status === "completed");
    const scores = sessions.map((session) => session.averageScore ?? 0);
    const typeMap = new Map<string, number[]>();

    sessions.forEach((session) => {
      const scoresForType = typeMap.get(session.type) || [];
      if (session.averageScore !== undefined) {
        scoresForType.push(session.averageScore);
      }
      typeMap.set(session.type, scoresForType);
    });

    const performanceByType = Array.from(typeMap.entries()).map(([type, typeScores]) => ({
      type,
      score: typeScores.length ? typeScores.reduce((a, b) => a + b, 0) / typeScores.length : 0,
    }));

    const sortedSessions = sessions.slice().sort(
      (a, b) => new Date(a.completedAt || a.createdAt).getTime() - new Date(b.completedAt || b.createdAt).getTime()
    );

    return {
      totalInterviews: sessions.length,
      averageScore: scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0,
      bestScore: scores.length ? Math.max(...scores) : 0,
      worstScore: scores.length ? Math.min(...scores) : 0,
      improvementTrend:
        sortedSessions.length >= 2
          ? Math.round(
              ((sortedSessions[sortedSessions.length - 1].averageScore ?? 0) -
                (sortedSessions[0].averageScore ?? 0)) *
                10
            ) / 10
          : 0,
      scores: sortedSessions.map((session) => ({
        date: (session.completedAt || session.createdAt).split("T")[0],
        score: session.averageScore ?? 0,
      })),
      performanceByType,
      heatmap: [],
    };
  }

  async getDashboard(): Promise<DashboardKPIs> {
    const sessions = this.loadStoredSessions().filter((session) => session.status === "completed");
    const scores = sessions.map((session) => session.averageScore ?? 0);

    const sortedSessions = sessions.slice().sort(
      (a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime()
    );

    const recentActivity = sortedSessions.slice(0, 5).map((session) => this.sessionToHistoryItem(session));
    const orderedSessions = sessions.slice().sort(
      (a, b) => new Date(a.completedAt || a.createdAt).getTime() - new Date(b.completedAt || b.createdAt).getTime()
    );

    return {
      totalInterviews: sessions.length,
      averageScore: scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0,
      bestScore: scores.length ? Math.max(...scores) : 0,
      improvementTrend:
        orderedSessions.length >= 2
          ? Math.round(
              ((orderedSessions[orderedSessions.length - 1].averageScore ?? 0) -
                (orderedSessions[0].averageScore ?? 0)) *
                10
            ) / 10
          : 0,
      recentActivity,
    };
  }

  async downloadReport(sessionId: string): Promise<Blob> {
    const session = await this.getSession(sessionId);

    if (!session) {
      throw new Error("Session not found.");
    }

    const response = await fetch(`${API_BASE}/api/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    }).catch(() => {
      throw new Error("Start the Python AI service on http://localhost:5000.");
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "PDF report request failed",
      }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return await response.blob();
  }

  async shareReport(_sessionId: string): Promise<{ shareUrl: string }> {
    throw new Error("Sharing needs the backend server.");
  }

  private async extractSkills(text: string): Promise<string[]> {
    if (text.trim()) {
      try {
        const result = await this.aiRequest<{ skills?: string[] }>("/extract-skills", {
          resume_text: text,
        });
        if (result.skills?.length) return result.skills;
      } catch {
        // Fall back to fast local keyword extraction.
      }
    }

    const lower = text.toLowerCase();
    const matched = commonSkills.filter((skill) =>
      lower.includes(skill.toLowerCase())
    );

    return matched.length ? matched : ["Communication", "Problem Solving", "Teamwork"];
  }
}

function cleanQuestionText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/^(?:question\s*)?\d+\s*[\).:-]\s*/i, "")
    .trim();
}

export const api = new ApiClient();
