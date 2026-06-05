"use client";

import { motion } from "framer-motion";
import { Map, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LearningRoadmapProps {
  phases: { phase: string; skills: string[]; duration: string }[];
}

export function LearningRoadmap({ phases }: LearningRoadmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Learning Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {index < phases.length - 1 && (
                <div className="absolute left-[15px] top-8 h-full w-px bg-gradient-to-b from-primary/50 to-transparent" />
              )}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <div className="flex-1 rounded-xl border border-border/20 bg-card/10 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{phase.phase}</h4>
                  <Badge variant="outline">{phase.duration}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {phase.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
