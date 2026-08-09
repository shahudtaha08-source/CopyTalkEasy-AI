import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isDemoMode, getDemoJournals, createDemoJournal, updateDemoJournal, deleteDemoJournal } from "@/lib/demo-data";
import { apiRequest } from "@/lib/queryClient";

export function useJournals() {
  return useQuery({
    queryKey: ["/api/journals"],
    queryFn: async () => {
      if (isDemoMode()) {
        return getDemoJournals();
      }
      const res = await fetch("/api/journals", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch journals");
      return await res.json();
    },
  });
}

export function useCreateJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title?: string; content: string; type?: string; tags?: string }) => {
      if (isDemoMode()) {
        return createDemoJournal(data);
      }
      const res = await apiRequest("POST", "/api/journals", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/history/emotional"] });
    },
  });
}

export function useUpdateJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; title?: string; content?: string; type?: string; tags?: string }) => {
      if (isDemoMode()) {
        return updateDemoJournal(id, data);
      }
      const res = await apiRequest("PATCH", `/api/journals/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/history/emotional"] });
    },
  });
}

export function useDeleteJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (isDemoMode()) {
        return deleteDemoJournal(id);
      }
      const res = await apiRequest("DELETE", `/api/journals/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/history/emotional"] });
    },
  });
}
