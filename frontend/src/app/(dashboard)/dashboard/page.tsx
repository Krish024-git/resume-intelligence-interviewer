"use client";

import { MessageSquare, Target, Trophy, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { useDashboard } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  return (
    <>
      <Header title="Dashboard" description="Your interview preparation overview" />
      <div className="space-y-8 p-6">
        <PageHeader
          title="Welcome back"
          description="Track your progress and ace your next interview"
          action={
            <Link href="/interview/configure">
              <Button variant="gradient">Start Interview</Button>
            </Link>
          }
        />

        {error ? (
          <EmptyState
            icon={MessageSquare}
            title="Dashboard unavailable"
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
            <KPICard
              title="Total Interviews"
              value={data?.totalInterviews ?? 0}
              icon={MessageSquare}
              index={0}
            />
            <KPICard
              title="Average Score"
              value={data?.averageScore?.toFixed(1) ?? "0.0"}
              subtitle="out of 10"
              icon={Target}
              index={1}
            />
            <KPICard
              title="Best Score"
              value={data?.bestScore?.toFixed(1) ?? "0.0"}
              icon={Trophy}
              index={2}
            />
            <KPICard
              title="Improvement"
              value={`+${data?.improvementTrend?.toFixed(1) ?? "0.0"}`}
              trend={data?.improvementTrend}
              icon={TrendingUp}
              index={3}
            />
          </div>
        )}

        <QuickActions />

        {!loading && data && (
          <RecentActivity activities={data.recentActivity} />
        )}
      </div>
    </>
  );
}
