import { useRoute, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { Loader2, AlertCircle, BookOpen, ChevronRight, Home } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { getCategoryConfig } from "@/lib/category-config";

function NotFoundHub() {
  return (
    <Layout>
      <div className="cb-container py-20 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-header mb-2">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">That category doesn't exist in our archive.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm">
          <Home className="w-4 h-4" /> Back to Feed
        </Link>
      </div>
    </Layout>
  );
}

export default function CategoryHub() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug ?? "";
  const config = getCategoryConfig(slug);

  const { data, isLoading, error } = useListPosts(
    slug ? { category: slug as any, limit: 200, offset: 0 } : { limit: 0, offset: 0 }
  );

  usePageSeoHead({
    title: config
      ? `${config.label} — Verified Records | ClownBinge`
      : "Category Archive | ClownBinge",
    description: config
      ? config.mission
      : "ClownBinge verified accountability journalism archive.",
    path: `/category/${slug}`,
    schemaType: "CollectionPage",
  });

  if (!config) return <NotFoundHub />;

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;

  return (
    <Layout>
      <div className="cb-container py-8 sm:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-foreground">{config.label}</span>
        </nav>

        {/* Hub Header */}
        <div className="border-b-2 border-border pb-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${config.pillBg} ${config.pillText}`}>
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {total > 0 ? `${total} verified record${total !== 1 ? "s" : ""}` : "Verified records"}
            </span>
          </div>

          <h1 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-header leading-tight tracking-tight mb-4">
            {config.label}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mb-5">
            {config.description}
          </p>

          {/* Mission statement */}
          <div className="border-l-4 border-secondary pl-4 py-1 max-w-2xl">
            <p className="text-sm font-semibold text-foreground italic">{config.mission}</p>
          </div>
        </div>

        {/* Pillar Topics + Key Entities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Coverage Areas
            </h2>
            <ul className="space-y-2">
              {config.pillarTopics.map(topic => (
                <li key={topic} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
              Primary Sources Used
            </h2>
            <ul className="space-y-2">
              {config.primarySources.map(source => (
                <li key={source} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Entities */}
        <div className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
            Key Entities Covered
          </h2>
          <div className="flex flex-wrap gap-2">
            {config.keyEntities.map(entity => (
              <span
                key={entity}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
              >
                {entity}
              </span>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="border-t-2 border-border pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-header text-lg">
              {isLoading ? "Loading records…" : `${total} Verified Record${total !== 1 ? "s" : ""}`}
            </h2>
            <Link
              href={`/?category=${slug}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View in live feed →
            </Link>
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Failed to load records. Please try again.
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No published records in this category yet.</p>
            </div>
          )}

          {!isLoading && !error && posts.length > 0 && (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors font-medium">
            ← All Categories
          </Link>
          <a href="/methodology" className="hover:text-primary transition-colors font-medium">
            Editorial Methodology
          </a>
        </div>
      </div>
    </Layout>
  );
}
