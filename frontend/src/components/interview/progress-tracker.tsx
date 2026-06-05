"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  current: number;
  total: number;
  completedSteps?: number[];
}

export function ProgressTracker({
  current,
  total,
  completedSteps = [],
}: ProgressTrackerProps) {
  const percentage = ((current) / total) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium text-foreground">
          {current} / {total} questions
        </span>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = completedSteps.includes(stepNum) || stepNum < current;
          const isCurrent = stepNum === current;

          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all",
                isCompleted && "bg-primary text-white",
                isCurrent && !isCompleted && "bg-primary/20 text-primary ring-2 ring-primary",
                !isCompleted && !isCurrent && "bg-card/10 text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
