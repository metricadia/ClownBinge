import { useQuery } from "@tanstack/react-query";

interface Sponsor {
  sponsorName: string;
  sponsorUrl: string;
  logoUrl?: string | null;
  tagline?: string | null;
}

async function fetchCategorySponsor(category: string): Promise<Sponsor | null> {
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  const res = await fetch(`${base}/api/sponsors/category/${encodeURIComponent(category)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.sponsor ?? null;
}

export function useCategorySponsor(category: string | undefined) {
  return useQuery<Sponsor | null>({
    queryKey: ["category-sponsor", category],
    queryFn: () => fetchCategorySponsor(category!),
    enabled: !!category,
    staleTime: 1000 * 60 * 10,
  });
}
