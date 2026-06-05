"use client";

import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreTrendChart } from "@/components/analytics/score-trend-chart";
import { PerformanceHeatmap } from "@/components/analytics/performance-heatmap";
import { PerformanceByType } from "@/components/analytics/performance-by-type";
import { useAnalytics } from "@/hooks/use-analytics";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare, Target, Trophy, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const { data, loading, error } = useAnalytics();

  return (
    <>
      <Header title="Analytics" description="Track your interview performance" />
      <div className="space-y-8 p-6">
        <PageHeader
          title="Performance Analytics"
          description="Detailed insights into your interview preparation journey"
        />

        {error ? (
          <EmptyState
            icon={TrendingUp}
            title="Analytics unavailable"
            description={error}
          />
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard title="Total Interviews" value={data?.totalInterviews ?? 0} icon={MessageSquare} index={0} />
            <KPICard title="Average Score" value={data?.averageScore?.toFixed(1) ?? "0"} icon={Target} index={1} />
            <KPICard title="Best Score" value={data?.bestScore?.toFixed(1) ?? "0"} icon={Trophy} index={2} />
            <KPICard title="Trend" value={`+${data?.improvementTrend?.toFixed(1) ?? "0"}`} trend={data?.improvementTrend} icon={TrendingUp} index={3} />
          </div>
        )}

        {!loading && data && (
          <>
            <ScoreTrendChart data={data.scores} />
            <div className="grid gap-6 lg:grid-cols-2">
              <PerformanceByType data={data.performanceByType} />
              <PerformanceHeatmap data={data.heatmap} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
