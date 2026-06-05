"use client";

import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreMeter } from "@/components/shared/score-meter";
import type { Evaluation } from "@/types";

interface FeedbackPanelProps {
  evaluation: Evaluation;
  questionText?: string;
}

export function FeedbackPanel({ evaluation, questionText }: FeedbackPanelProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center py-6"
      >
        <ScoreMeter score={evaluation.score} />
      </motion.div>

      {questionText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{questionText}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detailed Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-foreground">{evaluation.feedback}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-success">
              <ThumbsUp className="h-4 w-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.strengths.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <ThumbsDown className="h-4 w-4" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.weaknesses.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.recommendations.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
