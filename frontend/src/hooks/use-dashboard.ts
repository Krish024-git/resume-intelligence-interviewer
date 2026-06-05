"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { DashboardKPIs } from "@/types";

export function useDashboard() {
  const [data, setData] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const result = await api.getDashboard();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return { data, loading, error };
}
