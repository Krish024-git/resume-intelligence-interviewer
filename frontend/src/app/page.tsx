"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Resume Intelligence",
    description: "AI extracts skills and generates personalized questions from your resume.",
  },
  {
    icon: Zap,
    title: "Real-time Evaluation",
    description: "Get instant feedback with scores, strengths, and improvement tips.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress with detailed charts and performance insights.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">InterviewAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="gradient">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/10 px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Powered by Advanced AI
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
            Master Your Next
            <br />
            <span className="gradient-text">Interview</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Practice with AI-generated questions, get real-time feedback, and track
            your improvement. The interview preparation platform built for serious candidates.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button variant="gradient" size="lg" className="gap-2">
                Start Practicing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/resume">
              <Button variant="outline" size="lg">
                Upload Resume
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid gap-6 md:grid-cols-3"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-hover rounded-2xl p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
