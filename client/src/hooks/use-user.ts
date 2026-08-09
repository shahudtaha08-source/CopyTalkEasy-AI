import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { isDemoMode, getDemoUser, updateDemoUser } from "@/lib/demo-data";

export function useUser() {
  return useQuery({
    queryKey: [api.user.get.path],
    queryFn: async () => {
      if (isDemoMode()) {
        return getDemoUser();
      }
      const res = await fetch(api.user.get.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      if (isDemoMode()) {
        return updateDemoUser(data);
      }
      const res = await fetch(api.user.update.path, {
        method: api.user.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update user profile");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.user.get.path] });
    },
  });
}
