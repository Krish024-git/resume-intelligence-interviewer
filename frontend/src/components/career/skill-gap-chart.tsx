"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillGapChartProps {
  data: { skill: string; current: number; required: number }[];
}

export function SkillGapChart({ data }: SkillGapChartProps) {
  const chartData = data.map((d) => ({
    skill: d.skill,
    Current: d.current,
    Required: d.required,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
              />
              <Radar
                name="Current"
                dataKey="Current"
                stroke="#4F8CFF"
                fill="#4F8CFF"
                fillOpacity={0.3}
              />
              <Radar
                name="Required"
                dataKey="Required"
                stroke="#7C4DFF"
                fill="#7C4DFF"
                fillOpacity={0.2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
