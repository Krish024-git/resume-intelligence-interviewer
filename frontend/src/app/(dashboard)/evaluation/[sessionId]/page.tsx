"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Download, Briefcase, RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/header";
import { ScoreMeter } from "@/components/shared/score-meter";
import { FeedbackPanel } from "@/components/evaluation/feedback-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInterviewStore } from "@/stores/interview-store";
import { api } from "@/services/api";
import { getScoreColor } from "@/lib/utils";

export default function EvaluationPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { session, reset, setSession } = useInterviewStore();
  const [savedSession, setSavedSession] = useState(false);

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

  useEffect(() => {
    if (!session || savedSession) {
      return;
    }

    const averageScore =
      session.evaluations.length > 0
        ? session.evaluations.reduce((sum, e) => sum + e.score, 0) /
          session.evaluations.length
        : 0;

    const completedSession = {
      ...session,
      status: "completed" as const,
      averageScore,
      completedAt: new Date().toISOString(),
    };

    setSession(completedSession);
    api.saveSession(completedSession).catch(() => {
      // Ignore storage errors for now
    });
    setSavedSession(true);
  }, [session, savedSession, setSession]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No evaluation data available.</p>
      </div>
    );
  }

  const avgScore =
    session.evaluations.length > 0
      ? session.evaluations.reduce((sum, e) => sum + e.score, 0) /
        session.evaluations.length
      : 0;

  return (
    <>
      <Header title="Evaluation Results" description="Your interview performance summary" />
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Trophy className="h-4 w-4" />
            Interview Complete
          </div>
          <h2 className="text-3xl font-bold">{session.role}</h2>
          <p className="mt-2 text-muted-foreground">
            {session.type} interview · {session.difficulty} · {session.evaluations.length} questions evaluated
          </p>
        </motion.div>

        <div className="flex justify-center py-4">
          <ScoreMeter score={avgScore} size={200} strokeWidth={12} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {session.evaluations.map((evaluation, i) => {
            const question = session.questions.find(
              (q) => q.id === evaluation.questionId
            );
            return (
              <Card key={evaluation.id} className="glass-hover">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Q{i + 1}</span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: getScoreColor(evaluation.score) }}
                    >
                      {evaluation.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {question?.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {session.evaluations.length > 0 && (
          <FeedbackPanel evaluation={session.evaluations[session.evaluations.length - 1]} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Evaluations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.evaluations.map((evaluation, i) => {
              const question = session.questions.find(
                (q) => q.id === evaluation.questionId
              );
              return (
                <div
                  key={evaluation.id}
                  className="rounded-xl border border-border/20 bg-card/10 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline">Q{i + 1}</Badge>
                    <span
                      className="font-bold"
                      style={{ color: getScoreColor(evaluation.score) }}
                    >
                      {evaluation.score.toFixed(1)}/10
                    </span>
                  </div>
                  <p className="mb-2 text-sm font-medium">{question?.text}</p>
                  <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/career">
            <Button variant="gradient" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Career Insights
            </Button>
          </Link>
          <Link href="/reports">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              reset();
              window.location.href = "/interview/configure";
            }}
          >
            <RotateCcw className="h-4 w-4" />
            New Interview
          </Button>
        </div>
      </div>
    </>
  );
}
