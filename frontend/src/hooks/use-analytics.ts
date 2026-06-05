"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { AnalyticsData } from "@/types";

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const result = await api.getAnalytics();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return { data, loading, error };
}
