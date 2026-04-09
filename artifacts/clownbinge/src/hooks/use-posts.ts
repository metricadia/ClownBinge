import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch, useLocation } from "wouter";
import { 
  useListPosts, 
  useIncrementView,
  ListPostsCategory 
} from "@workspace/api-client-react";

export function usePostsFilter() {
  const search = useSearch();
  const [, navigate] = useLocation();

  const getInitialCategory = (): ListPostsCategory | undefined => {
    const params = new URLSearchParams(search);
    const cat = params.get("category");
    if (!cat || cat === "all") return undefined;
    return cat as ListPostsCategory;
  };

  const [category, setCategory] = useState<ListPostsCategory | undefined>(getInitialCategory);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const cat = params.get("category");
    const next = (!cat || cat === "all") ? undefined : cat as ListPostsCategory;
    setCategory(next);
  }, [search]);

  const handleSetCategory = useCallback((cat: string | null) => {
    if (!cat || cat === "all") {
      navigate("/");
    } else {
      navigate(`/?category=${encodeURIComponent(cat)}`);
    }
  }, [navigate]);

  return {
    category,
    setCategory: handleSetCategory
  };
}

export function usePostsFeed(category?: ListPostsCategory, limit = 20, staffPick?: boolean) {
  return useListPosts({ 
    limit, 
    offset: 0,
    ...(category ? { category } : {}),
    ...(staffPick ? { staffPick } : {}),
  });
}

export function usePostsFeedPaginated(category?: ListPostsCategory, pageSize = 20) {
  const [offset, setOffset] = useState(0);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingMore = useRef(false);

  const { data, isLoading, error, isFetching } = useListPosts({
    limit: pageSize,
    offset,
    ...(category ? { category } : {})
  });

  useEffect(() => {
    setOffset(0);
    setAllPosts([]);
    setHasMore(true);
    isLoadingMore.current = false;
  }, [category]);

  useEffect(() => {
    if (!data?.posts) return;
    if (offset === 0) {
      setAllPosts(data.posts);
    } else {
      setAllPosts(prev => {
        const existingIds = new Set(prev.map((p: any) => p.id));
        const fresh = data.posts.filter((p: any) => !existingIds.has(p.id));
        return [...prev, ...fresh];
      });
    }
    setHasMore(data.posts.length === pageSize);
    isLoadingMore.current = false;
  }, [data, offset, pageSize]);

  const loadMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    isLoadingMore.current = true;
    setOffset(prev => prev + pageSize);
  }, [isFetching, hasMore, pageSize]);

  return {
    posts: allPosts,
    isLoading: isLoading && offset === 0,
    isLoadingMore: isFetching && offset > 0,
    error,
    hasMore,
    loadMore,
    total: data?.total,
  };
}

export function useSeriesPosts(seriesName: string | null | undefined) {
  return useQuery({
    queryKey: ["series-posts", seriesName],
    queryFn: async () => {
      if (!seriesName) return [];
      const res = await fetch(`/api/posts?series=${encodeURIComponent(seriesName)}&limit=10`, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.posts ?? []) as Array<{ slug: string; title: string; seriesSequence: string | null }>;
    },
    staleTime: 60_000,
    enabled: Boolean(seriesName),
  });
}

export function usePostDetail(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${slug}?_t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
    staleTime: 0,
    enabled: Boolean(slug),
  });
}

export function usePostsCount() {
  return useQuery<number>({
    queryKey: ["posts-count"],
    queryFn: async () => {
      const res = await fetch(`/api/posts/count?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      return data.count as number;
    },
    staleTime: 0,
    refetchInterval: 30_000,
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
