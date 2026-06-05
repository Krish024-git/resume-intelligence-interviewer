"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/shared/page-header";
import { SkillGapChart } from "@/components/career/skill-gap-chart";
import { LearningRoadmap } from "@/components/career/learning-roadmap";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { useInterviewStore } from "@/stores/interview-store";
import type { CareerInsights } from "@/types";

export default function CareerPage() {
  const { session } = useInterviewStore();
  const [insights, setInsights] = useState<CareerInsights | null>(null);
  const [loading, setLoading] = useState(Boolean(session?.id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.id) {
      setLoading(false);
      return;
    }

    async function fetchInsights() {
      try {
        const result = await api.getCareerSuggestions({ sessionId: session!.id });
        setInsights(result.insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load career insights");
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [session]);

  return (
    <>
      <Header title="Career Insights" description="AI-powered career guidance" />
      <div className="space-y-8 p-6">
        <PageHeader
          title="Career Insights"
          description="Personalized skill gap analysis and learning recommendations"
        />

        {!session?.id ? (
          <EmptyState
            icon={Briefcase}
            title="No interview selected"
            description="Complete an interview before requesting career insights."
          />
        ) : error ? (
          <EmptyState
            icon={Briefcase}
            title="Career insights unavailable"
            description={error}
          />
        ) : loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        ) : insights ? (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <SkillGapChart data={insights.skillGaps} />
              <LearningRoadmap phases={insights.learningRoadmap} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insights.recommendedTechnologies.map((tech, i) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Career Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground">
                  {insights.careerSuggestions}
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </>
  );
}
