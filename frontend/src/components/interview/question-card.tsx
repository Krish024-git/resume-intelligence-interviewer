"use client";

import { motion } from "framer-motion";
import { Bot, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TypingEffect } from "@/components/shared/typing-effect";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  animate?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  animate = true,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-primary" />
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">AI Interviewer</p>
                <p className="text-xs text-muted-foreground">
                  Question {questionNumber} of {totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {question.type}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {question.difficulty}
              </Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="text-lg leading-relaxed text-foreground">
              {animate ? (
                <TypingEffect text={question.text} speed={20} />
              ) : (
                question.text
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
