"use client";

import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/lib/utils";

interface ScoreMeterProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function ScoreMeter({
  score,
  maxScore = 10,
  size = 160,
  strokeWidth = 10,
  showLabel = true,
}: ScoreMeterProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold"
          style={{ color }}
        >
          {score.toFixed(1)}
        </motion.span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">{getScoreLabel(score)}</span>
        )}
      </div>
    </div>
  );
}
