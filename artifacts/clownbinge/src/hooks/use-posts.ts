import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

export function usePostsFeed(category?: ListPostsCategory) {
  return useListPosts({ 
    limit: 20, 
    offset: 0,
    ...(category ? { category } : {})
  });
}

export function usePostDetail(slug: string) {
  return useGetPost(slug);
}

export function useViewTracker(slug: string) {
  const incrementMutation = useIncrementView();
  
  const trackView = useCallback(() => {
    if (slug) {
      incrementMutation.mutate({ slug });
    }
  }, [slug, incrementMutation]);

  return { trackView };
}
