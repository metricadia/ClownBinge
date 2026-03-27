import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { Loader2, AlertCircle, Tag, FileText } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";
import { useTagSeoHead } from "@/hooks/use-seo-head";

export default function TagIndex() {
  const [, params] = useRoute("/tags/:tag");
  const tag = params?.tag ? decodeURIComponent(params.tag) : "";

  const { data, isLoading, error } = useListPosts(
    tag ? { tag, limit: 200, offset: 0 } : { limit: 0, offset: 0 }
  );

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;

  useTagSeoHead(tag, total);

  return (
    <Layout>
      <div className="cb-container py-8 sm:py-12">

        {/* Archive header */}
        <div className="border-b-2 border-border pb-6 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
              Subject Archive
            </span>
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header leading-tight mb-2">
            #{tag}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Every verified record on Citatious tagged{" "}
            <strong className="text-foreground">#{tag}</strong>.
            Primary sources only. Case numbers assigned in the order the record
            was verified and published.
          </p>
          {!isLoading && !error && total > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-primary text-white">
              <FileText className="w-3 h-3" />
              {total} Verified Record{total !== 1 ? "s" : ""} on File
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 text-destructive py-10">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load records for #{tag}.</span>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Tag className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No verified records found for <strong>#{tag}</strong>.</p>
            <p className="text-sm mt-1">Check back as we continue building the archive.</p>
          </div>
        )}

        {/* Results grid */}
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
