"use client";

import { useEffect, useState } from "react";
import localStates from "@/data/nigeria-states.json";
import { createClient } from "@/lib/supabase/client";

export type LocationState = {
  name: string;
  lgas: string[];
};

type LocalState = {
  name: string;
  lgas: string[];
};

export function useLocations() {
  const [states, setStates] = useState<LocationState[]>([]);
  const [fromSupabase, setFromSupabase] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fallback = localStates as LocalState[];

    async function load() {
      try {
        const supabase = createClient();
        const { data: stateRows, error } = await supabase
          .from("ng_states")
          .select("id,name")
          .order("name");
        const { data: lgaRows, error: lgaError } = await supabase
          .from("ng_lgas")
          .select("state_id,name")
          .order("name");
        if (error || !stateRows?.length || lgaError || !lgaRows) {
          throw error ?? lgaError ?? new Error("Location tables are empty");
        }

        const grouped = stateRows.map((state) => {
          const fromDatabase = lgaRows
            .filter((lga) => lga.state_id === state.id)
            .map((lga) => lga.name as string);
          const fromLocal = fallback.find((item) => item.name === state.name)?.lgas ?? [];
          return {
            name: state.name as string,
            lgas: fromDatabase.length > 0 ? fromDatabase : fromLocal,
          };
        });

        if (!cancelled) {
          setStates(grouped);
          setFromSupabase(true);
        }
      } catch {
        if (!cancelled) {
          setStates(fallback);
          setFromSupabase(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { states, fromSupabase };
}
