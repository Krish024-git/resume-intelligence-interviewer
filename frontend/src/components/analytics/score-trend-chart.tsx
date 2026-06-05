"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreTrendChartProps {
  data: { date: string; score: number }[];
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatted}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="label"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 10]}
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141B2D",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#E8ECF4",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#4F8CFF"
                strokeWidth={2}
                fill="url(#scoreGradient)"
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4F8CFF"
                strokeWidth={2}
                dot={{ fill: "#4F8CFF", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#7C4DFF" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
