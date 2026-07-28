"use client";

import { useEffect, useState } from "react";
import { getClassConfigs, type ClassConfigResponse } from "@/lib/api/characters";

/**
 * The class stat lines, live from `GET /api/characters/class-configs`.
 *
 * Both wiki class pages read the same table, so the fetch lives here rather than
 * twice — and `loading` is derived, not a third state, so nothing has to be
 * switched off synchronously inside the effect.
 */
export function useClassConfigs() {
  const [configs, setConfigs] = useState<ClassConfigResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getClassConfigs()
      .then((res) => { if (mounted) { setConfigs(res); setError(null); } })
      .catch((e) => {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load class stats.");
      });
    return () => { mounted = false; };
  }, []);

  return { configs, error, loading: !configs && !error };
}

/** Highest base value per stat across every class — the ceiling the discrete
 *  stat blocks normalise against, so a bar means "of the strongest order" and
 *  not "of a number someone typed once". */
export function statCeilings(configs: ClassConfigResponse[]) {
  return {
    hp: Math.max(1, ...configs.map((c) => c.maxHp)),
    atk: Math.max(1, ...configs.map((c) => c.atk)),
    def: Math.max(1, ...configs.map((c) => c.def)),
  };
}

/** Match a config row to the presentation entry in `lib/data/classes.ts`.
 *  `ClassConfig.ClassName` is the same string as `GameClass.name`. */
export function findConfig(configs: ClassConfigResponse[] | null, className: string) {
  return configs?.find((c) => c.className === className) ?? null;
}
