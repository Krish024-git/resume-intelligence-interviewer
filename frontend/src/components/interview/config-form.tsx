"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Users, FileText, Layers, Zap, Target, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InterviewType, Difficulty } from "@/types";

interface ConfigFormProps {
  onSubmit: (config: {
    role: string;
    experience: string;
    type: InterviewType;
    difficulty: Difficulty;
    questionCount: number;
  }) => void;
  loading?: boolean;
}

const interviewTypes: { value: InterviewType; label: string; icon: typeof Code; description: string }[] = [
  { value: "technical", label: "Technical", icon: Code, description: "Coding & system design" },
  { value: "hr", label: "HR", icon: Users, description: "Behavioral & culture fit" },
  { value: "resume", label: "Resume Based", icon: FileText, description: "Questions from your resume" },
  { value: "mixed", label: "Mixed", icon: Layers, description: "Combined interview types" },
];

const difficulties: { value: Difficulty; label: string; icon: typeof Zap; color: string }[] = [
  { value: "easy", label: "Easy", icon: Zap, color: "text-success" },
  { value: "medium", label: "Medium", icon: Target, color: "text-warning" },
  { value: "hard", label: "Hard", icon: Flame, color: "text-destructive" },
];

const questionCounts = [3, 5, 7, 10];

export function ConfigForm({ onSubmit, loading }: ConfigFormProps) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [type, setType] = useState<InterviewType>("technical");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionCount, setQuestionCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ role, experience, type, difficulty, questionCount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role">Field / Role</Label>
          <Input
            id="role"
            placeholder="e.g. Data Science, Frontend, Product Manager"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Input
            id="experience"
            placeholder="e.g. 3-5 years"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Interview Type</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {interviewTypes.map((item) => {
            const Icon = item.icon;
            const selected = type === item.value;
            return (
              <motion.button
                key={item.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setType(item.value)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                  selected
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border/40 bg-card/10 hover:border-border/60"
                )}
              >
                <Icon className={cn("h-5 w-5", selected ? "text-primary" : "text-muted-foreground")} />
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Difficulty</Label>
        <div className="flex gap-3">
          {difficulties.map((item) => {
            const Icon = item.icon;
            const selected = difficulty === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setDifficulty(item.value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 transition-all",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border/40 hover:border-border/60"
                )}
              >
                <Icon className={cn("h-4 w-4", selected ? "text-primary" : item.color)} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Number of Questions</Label>
        <div className="flex gap-3">
          {questionCounts.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setQuestionCount(count)}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl border font-semibold transition-all",
                questionCount === count
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/40 hover:border-border/60"
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Ready to start?</p>
            <p className="text-sm text-muted-foreground">
              {questionCount} {type} questions · {difficulty} difficulty
            </p>
          </div>
          <Button type="submit" variant="gradient" size="lg" disabled={loading}>
            {loading ? "Generating..." : "Start Interview"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
