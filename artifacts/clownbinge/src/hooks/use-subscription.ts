import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SubscriptionStatus {
  isSubscriber: boolean;
  reason?: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function fetchStatus(): Promise<SubscriptionStatus> {
  try {
    const res = await fetch(`${BASE}/api/subscription/status`, { credentials: "include" });
    if (!res.ok) return { isSubscriber: false };
    return res.json();
  } catch {
    return { isSubscriber: false };
  }
}

export function useSubscription() {
  return useQuery<SubscriptionStatus>({
    queryKey: ["subscription-status"],
    queryFn: fetchStatus,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useActivateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      const res = await fetch(`${BASE}/api/subscription/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Activation failed");
      return data as { success: true; label: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription-status"] });
    },
  });
}

export function useDeactivateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch(`${BASE}/api/subscription/deactivate`, {
        method: "POST",
        credentials: "include",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription-status"] });
    },
  });
}
