import { create } from "zustand";
import type { Resume } from "@/types";

interface ResumeState {
  resume: Resume | null;
  skills: string[];
  isUploading: boolean;
  setResume: (resume: Resume, skills: string[]) => void;
  setUploading: (uploading: boolean) => void;
  clear: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resume: null,
  skills: [],
  isUploading: false,
  setResume: (resume, skills) => set({ resume, skills }),
  setUploading: (isUploading) => set({ isUploading }),
  clear: () => set({ resume: null, skills: [] }),
}));
