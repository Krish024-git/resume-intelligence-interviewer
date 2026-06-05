"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/shared/page-header";
import { ConfigForm } from "@/components/interview/config-form";
import { useInterviewStore } from "@/stores/interview-store";
import { useResumeStore } from "@/stores/resume-store";
import { api } from "@/services/api";
import type { Difficulty, InterviewType } from "@/types";

export default function ConfigurePage() {
  const router = useRouter();
  const { setSession, setConfig, setLoading, isLoading } = useInterviewStore();
  const { resume, skills } = useResumeStore();

  const handleSubmit = async (config: {
    role: string;
    experience: string;
    type: InterviewType;
    difficulty: Difficulty;
    questionCount: number;
  }) => {
    setLoading(true);
    setConfig({ ...config, resumeId: resume?.id, skills });

    try {
      const result = await api.generateQuestions({
        ...config,
        resumeId: resume?.id,
        skills,
      });

      setSession({
        id: result.sessionId,
        userId: resume?.userId || "",
        resumeId: resume?.id,
        role: config.role,
        experience: config.experience,
        type: config.type,
        difficulty: config.difficulty,
        questionCount: config.questionCount,
        status: "in_progress",
        questions: result.questions,
        answers: [],
        evaluations: [],
        createdAt: new Date().toISOString(),
      });

      router.push(`/interview/${result.sessionId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Question generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Interview" description="Configure your practice session" />
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <PageHeader
          title="Configure Interview"
          description="Customize your AI interview experience"
        />
        <ConfigForm onSubmit={handleSubmit} loading={isLoading} />
      </div>
    </>
  );
}
