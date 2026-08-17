"use client";

import { useEffect, useState } from "react";
import { getWikiClasses, type ClassConfigResponse } from "@/lib/api/wiki";

// Custom React hook providing use class configs state and utility functions.
// Encapsulates internal state management and lifecycle subscriptions.
// Returns state values and operational callbacks to consuming components.
export function useClassConfigs() {
  const [configs, setConfigs] = useState<ClassConfigResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load wiki classes when the dependencies change, update configs and error, and ignore stale callbacks after unmount.
  useEffect(() => {
    let mounted = true;
    getWikiClasses()
      .then((res) => { if (mounted) { setConfigs(res); setError(null); } })
      .catch((e) => {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load class stats.");
      });
    return () => { mounted = false; };
  }, []);

  return { configs, error, loading: !configs && !error };
}

// Helper function executing stat ceilings.
// Processes input parameters and returns the calculated result.
export function statCeilings(configs: ClassConfigResponse[]) {
  return {
    hp: Math.max(1, ...configs.map((c) => c.maxHp)),
    atk: Math.max(1, ...configs.map((c) => c.atk)),
    def: Math.max(1, ...configs.map((c) => c.def)),
  };
}

// Helper function executing find config.
// Processes input parameters and returns the calculated result.
export function findConfig(configs: ClassConfigResponse[] | null, className: string) {
  return configs?.find((c) => c.className === className) ?? null;
}
