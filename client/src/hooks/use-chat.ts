import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { isDemoMode, getDemoConversations, getDemoConversationHistory, createDemoConversation } from "@/lib/demo-data";

export function useConversations() {
  return useQuery({
    queryKey: [api.chat.list.path],
    queryFn: async () => {
      if (isDemoMode()) {
        return getDemoConversations();
      }
      const res = await fetch(api.chat.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return await res.json();
    },
  });
}

export function useConversationHistory(id: number | null) {
  return useQuery({
    queryKey: [api.chat.history.path, id],
    queryFn: async () => {
      if (!id) return [];
      if (isDemoMode()) {
        return getDemoConversationHistory(id);
      }
      const url = buildUrl(api.chat.history.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversation history");
      return await res.json();
    },
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string }) => {
      if (isDemoMode()) {
        return createDemoConversation(data.title);
      }
      const res = await fetch(api.chat.create.path, {
        method: api.chat.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.chat.list.path] });
    },
  });
}
