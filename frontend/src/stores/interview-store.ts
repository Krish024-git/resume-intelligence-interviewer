import { create } from "zustand";
import type {
  InterviewSession,
  Question,
  Answer,
  Evaluation,
  InterviewType,
  Difficulty,
} from "@/types";

interface InterviewState {
  session: InterviewSession | null;
  currentQuestionIndex: number;
  isLoading: boolean;
  isEvaluating: boolean;
  isFollowupLoading: boolean;

  setSession: (session: InterviewSession) => void;
  setCurrentQuestionIndex: (index: number) => void;
  addAnswer: (answer: Answer) => void;
  addEvaluation: (evaluation: Evaluation) => void;
  addFollowupQuestion: (question: Question) => void;
  setLoading: (loading: boolean) => void;
  setEvaluating: (evaluating: boolean) => void;
  setFollowupLoading: (loading: boolean) => void;
  reset: () => void;

  config: {
    role: string;
    experience: string;
    type: InterviewType;
    difficulty: Difficulty;
    questionCount: number;
    resumeId?: string;
    skills?: string[];
  } | null;
  setConfig: (config: InterviewState["config"]) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  session: null,
  currentQuestionIndex: 0,
  isLoading: false,
  isEvaluating: false,
  isFollowupLoading: false,
  config: null,

  setSession: (session) => set({ session, currentQuestionIndex: 0 }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  addAnswer: (answer) =>
    set((state) => ({
      session: state.session
        ? { ...state.session, answers: [...state.session.answers, answer] }
        : null,
    })),
  addEvaluation: (evaluation) =>
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            evaluations: [...state.session.evaluations, evaluation],
          }
        : null,
    })),
  addFollowupQuestion: (question) =>
    set((state) => {
      if (!state.session) return state;
      const questions = [...state.session.questions];
      questions.splice(state.currentQuestionIndex + 1, 0, question);
      return {
        session: {
          ...state.session,
          questions,
          questionCount: questions.length,
        },
      };
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setEvaluating: (isEvaluating) => set({ isEvaluating }),
  setFollowupLoading: (isFollowupLoading) => set({ isFollowupLoading }),
  reset: () =>
    set({
      session: null,
      currentQuestionIndex: 0,
      isLoading: false,
      isEvaluating: false,
      isFollowupLoading: false,
      config: null,
    }),
  setConfig: (config) => set({ config }),
}));
