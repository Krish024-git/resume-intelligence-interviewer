"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PerformanceHeatmapProps {
  data: { day: string; hour: number; count: number }[];
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export function PerformanceHeatmap({ data }: PerformanceHeatmapProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getCount = (day: string, hour: number) => {
    const item = data.find((d) => d.day === day && d.hour === hour);
    return item?.count || 0;
  };

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-card/10";
    const ratio = count / maxCount;
    if (ratio > 0.75) return "bg-primary/60";
    if (ratio > 0.5) return "bg-primary/40";
    if (ratio > 0.25) return "bg-primary/20";
    return "bg-primary/10";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="mb-2 flex gap-1 pl-12">
              {hours.map((h) => (
                <div key={h} className="flex-1 text-center text-xs text-muted-foreground">
                  {h}:00
                </div>
              ))}
            </div>
            {days.map((day) => (
              <div key={day} className="mb-1 flex items-center gap-1">
                <span className="w-10 text-xs text-muted-foreground">{day}</span>
                {hours.map((hour) => {
                  const count = getCount(day, hour);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={cn(
                        "h-6 flex-1 rounded-sm transition-colors",
                        getIntensity(count)
                      )}
                      title={`${day} ${hour}:00 - ${count} interviews`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
