"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, getScoreColor } from "@/lib/utils";
import type { HistoryItem } from "@/types";

interface RecentActivityProps {
  activities: HistoryItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No interviews yet. Start your first one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Link
          href="/analytics"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 rounded-xl border border-border/20 bg-card/10 p-4 transition-colors hover:bg-card/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{item.role}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs capitalize">
                  {item.type}
                </Badge>
                <span>{item.questionCount} questions</span>
                <span>·</span>
                <span>{formatRelativeTime(item.completedAt)}</span>
              </div>
            </div>
            <div className="text-right">
              <p
                className="text-lg font-bold"
                style={{ color: getScoreColor(item.averageScore) }}
              >
                {item.averageScore.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">avg score</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
