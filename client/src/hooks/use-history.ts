import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { isDemoMode, getDemoEmotionalHistory } from "@/lib/demo-data";

export function useEmotionalHistory() {
  return useQuery({
    queryKey: [api.history.emotional.path],
    queryFn: async () => {
      if (isDemoMode()) {
        return getDemoEmotionalHistory();
      }
      const res = await fetch(api.history.emotional.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch emotional history");
      return await res.json();
    },
  });
}
