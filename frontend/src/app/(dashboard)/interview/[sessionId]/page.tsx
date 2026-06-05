"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { ProgressTracker } from "@/components/interview/progress-tracker";
import { QuestionCard } from "@/components/interview/question-card";
import { AnswerEditor } from "@/components/interview/answer-editor";
import { FeedbackPanel } from "@/components/evaluation/feedback-panel";
import { Button } from "@/components/ui/button";
import { useInterviewStore } from "@/stores/interview-store";
import { api } from "@/services/api";
import type { Evaluation } from "@/types";

export default function InterviewSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const {
    session,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    addAnswer,
    addEvaluation,
    isEvaluating,
    isFollowupLoading,
    setEvaluating,
    setFollowupLoading,
    setSession,
  } = useInterviewStore();

  const [showFeedback, setShowFeedback] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null);
  const [followupSuggestion, setFollowupSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (session || !sessionId) {
      return;
    }

    api.getSession(sessionId).then((saved) => {
      if (saved) {
        setSession(saved);
      }
    });
  }, [session, sessionId, setSession]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No active session. Please configure an interview first.</p>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const totalQuestions = session.questions.length;
  const completedSteps = session.evaluations.map((_, i) => i + 1);
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  const handleSubmitAnswer = async (answerText: string) => {
    setEvaluating(true);
    try {
      const result = await api.evaluateAnswer({
        sessionId,
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        answer: answerText,
      });
      addAnswer({
        id: `a-${Date.now()}`,
        questionId: currentQuestion.id,
        text: answerText,
        characterCount: answerText.length,
        submittedAt: new Date().toISOString(),
      });
      addEvaluation(result.evaluation);
      setCurrentEvaluation(result.evaluation);
      setShowFeedback(true);
      setFollowupSuggestion(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Answer evaluation failed");
    } finally {
      setEvaluating(false);
    }
  };

  const handleFollowup = async (answerText: string) => {
    setFollowupLoading(true);
    try {
      const result = await api.getFollowup({
        sessionId,
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        answer: answerText,
      });
      setFollowupSuggestion(result.followupQuestion.text);
      toast.success("AI suggestion generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Follow-up generation failed");
    } finally {
      setFollowupLoading(false);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setCurrentEvaluation(null);
    setFollowupSuggestion(null);
    if (isLastQuestion) {
      router.push(`/evaluation/${sessionId}`);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <>
      <Header
        title={`Interview: ${session.role}`}
        description={`${session.type} · ${session.difficulty} · ${session.experience}`}
      />
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <ProgressTracker
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          completedSteps={completedSteps}
        />

        {!showFeedback ? (
          <>
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />
            <AnswerEditor
              onSubmit={handleSubmitAnswer}
              onFollowup={handleFollowup}
              loading={isEvaluating}
              followupLoading={isFollowupLoading}
              followupSuggestion={followupSuggestion}
            />
          </>
        ) : (
          currentEvaluation && (
            <div className="space-y-6">
              <FeedbackPanel
                evaluation={currentEvaluation}
                questionText={currentQuestion.text}
              />
              <div className="flex justify-end">
                <Button variant="gradient" size="lg" onClick={handleNext}>
                  {isLastQuestion ? "View Final Results" : "Next Question"}
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
