"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, MessageSquare, BarChart3, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    href: "/resume",
    icon: FileText,
    title: "Upload Resume",
    description: "Extract skills from your resume",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    href: "/interview/configure",
    icon: MessageSquare,
    title: "Start Interview",
    description: "Practice with AI questions",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    title: "View Analytics",
    description: "Track your progress",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    href: "/career",
    icon: Briefcase,
    title: "Career Insights",
    description: "Get AI recommendations",
    gradient: "from-orange-500/20 to-yellow-500/20",
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <Card className="glass-hover group cursor-pointer overflow-hidden">
                <CardContent className="p-5">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient}`}
                  >
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
