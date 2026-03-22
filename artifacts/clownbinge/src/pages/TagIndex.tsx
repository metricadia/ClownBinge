import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { Loader2, AlertCircle, Tag } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";

export default function TagIndex() {
  const [, params] = useRoute("/tags/:tag");
  const tag = params?.tag ? decodeURIComponent(params.tag) : "";

  const { data, isLoading, error } = useListPosts({ limit: 100, offset: 0 });

  const posts = (data?.posts ?? []).filter(
    (p) => Array.isArray(p.tags) && p.tags.some(
      (t) => t.toLowerCase() === tag.toLowerCase()
    )
  );

  return (
    <Layout>
      <div className="cb-container py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-5 h-5 text-primary" />
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header">
            #{tag}
          </h1>
        </div>
        <p className="text-muted-foreground mb-8 text-sm">
          All verified records tagged with <strong>{tag}</strong>
        </p>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 text-destructive py-10">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load records.</span>
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No records found for tag <strong>#{tag}</strong>.
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
