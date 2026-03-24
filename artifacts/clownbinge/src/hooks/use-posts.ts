import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  useListPosts, 
  useGetPost, 
  useIncrementView,
  ListPostsCategory 
} from "@workspace/api-client-react";

export function usePostsFilter() {
  const [category, setCategory] = useState<ListPostsCategory | undefined>(undefined);
  
  const handleSetCategory = useCallback((cat: string | null) => {
    if (!cat || cat === "all") {
      setCategory(undefined);
    } else {
      setCategory(cat as ListPostsCategory);
    }
  }, []);

  return {
    category,
    setCategory: handleSetCategory
  };
}

export function usePostsFeed(category?: ListPostsCategory, limit = 20) {
  return useListPosts({ 
    limit, 
    offset: 0,
    ...(category ? { category } : {})
  });
}

export function usePostDetail(slug: string) {
  return useGetPost(slug);
}

export function usePostsCount() {
  return useQuery<number>({
    queryKey: ["posts-count"],
    queryFn: async () => {
      const res = await fetch("/api/posts/count");
      const data = await res.json();
      return data.count as number;
    },
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}

export function useViewTracker(slug: string) {
  const incrementMutation = useIncrementView();
  const mutateRef = useRef(incrementMutation.mutate);

  useEffect(() => {
    mutateRef.current = incrementMutation.mutate;
  });

  const trackView = useCallback(() => {
    if (slug) {
      mutateRef.current({ slug });
    }
  }, [slug]);

  return { trackView };
}
