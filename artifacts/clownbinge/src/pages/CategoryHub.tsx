import { useRoute, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { Loader2, AlertCircle, BookOpen, ChevronRight, Home, PenLine, ShieldCheck, Ban, FileText } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { getCategoryConfig } from "@/lib/category-config";
import { US_HISTORY_CLUSTERS } from "@/lib/us-history-clusters";

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
  const isUsHistory = slug === "us_history";

  const clusterGroups = isUsHistory
    ? US_HISTORY_CLUSTERS.map((cluster) => ({
        cluster,
        posts: posts.filter((p) => cluster.caseNumbers.includes(p.caseNumber ?? "")),
      })).filter((g) => g.posts.length > 0)
    : [];

  const clusteredCaseNumbers = new Set(
    US_HISTORY_CLUSTERS.flatMap((c) => c.caseNumbers)
  );
  const unclustered = isUsHistory
    ? posts.filter((p) => !clusteredCaseNumbers.has(p.caseNumber ?? ""))
    : [];

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

        {/* ── Founder's Pen Special Editorial Statement ── */}
        {slug === "founders_pen" && (
          <div className="mb-10">

            {/* Definition block */}
            <div className="rounded-none border-l-4 border-[#C9A227] pl-6 py-4 mb-8" style={{ background: "#FAFAF8" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A227", fontFamily: "'Inter', sans-serif" }}>What It Is</p>
              <p className="text-sm leading-relaxed" style={{ color: "#0B1930", fontFamily: "'Georgia', serif" }}>
                The Founder's Pen is a <strong>rare, explicitly authored</strong> ClownBinge article category written exclusively by the platform founder. It publishes infrequently and deliberately. Every Founder's Pen piece is a long read by definition. No exceptions.
              </p>
            </div>

            {/* Epistemological posture */}
            <div className="rounded-none border border-[#C9A227]/30 p-6 mb-6" style={{ background: "#0B1930" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A227", fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}>Epistemological Posture</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Georgia', serif" }}>
                The Founder's Pen maintains all CB sourcing standards: Tier One primary documentation, falsifiable claims, verified evidence, three-tier source hierarchy. It departs from CB Dry Rationalism in one named and deliberate respect: <strong style={{ color: "#E8C840" }}>it makes no pretense at Eurocentric objectivity</strong> — which was itself a subjective determination made by specific people, in specific institutions, serving specific political and racial interests, at a specific historical moment, and then universalized as the only legitimate posture for knowledge production.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Georgia', serif" }}>
                The Founder's Pen carries a documented editorial posture, not an undisclosed one. The departure is named. The reasoning is published. Readers are not asked to mistake a standpoint for the absence of one.
              </p>
            </div>

            {/* What It Is Not */}
            <div className="p-6 mb-6" style={{ background: "#F0EDE6", borderTop: "3px solid #C9A227" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#0B1930", fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}>What It Is Not</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["CNN", "Fox News", "The view from nowhere"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Ban className="w-4 h-4 shrink-0" style={{ color: "#C9A227" }} />
                    <span className="text-sm font-semibold" style={{ color: "#0B1930", fontFamily: "'Inter', sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-4 italic" style={{ color: "rgba(11,25,48,0.65)", fontFamily: "'Georgia', serif" }}>
                There is no view from nowhere. There never was.
              </p>
            </div>

            {/* Guardrails */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-4 h-4" style={{ color: "#C9A227" }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0B1930", fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}>Editorial Guardrails — Non-Negotiable</p>
              </div>
              <div className="space-y-3">
                {[
                  "Every claim of fact requires a cited source at Tier One or Tier Two. Emotion and embodied scholarly voice are permitted. Unverified factual claims are not.",
                  "No named living private individual may be accused of a specific crime without a primary source document confirming legal finding or official investigation. Named public institutions and historical figures operating in their public capacity are not subject to this restriction.",
                  "No operational content. Analysis of systems, policies, institutions, and historical mechanisms is permitted without restriction. Instructions, incitement, or tactical guidance are never permitted regardless of framing.",
                  "The author's voice and grief are permitted. Calls for specific action against specific living individuals are not.",
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-4 py-3" style={{ borderBottom: "1px solid rgba(11,25,48,0.08)" }}>
                    <span className="shrink-0 mt-0.5 text-[11px] font-black" style={{ color: "#C9A227", fontFamily: "'Inter', sans-serif", minWidth: "20px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "#0B1930", fontFamily: "'Georgia', serif" }}>{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory footer disclosure */}
            <div className="flex items-start gap-4 p-5" style={{ background: "#0B1930", border: "1px solid rgba(201,162,39,0.3)" }}>
              <FileText className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#C9A227" }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A227", fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}>Mandatory Footer — Appears on Every Piece</p>
                <p className="text-sm italic leading-relaxed" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Georgia', serif" }}>
                  "This piece was written under The Founder's Pen category guidelines. It maintains CB three-tier sourcing standards. It does not maintain CB Dry Rationalism. The distinction is deliberate and documented in CB editorial policy."
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Article Grid — clustered for US History, flat for all other categories */}
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

          {!isLoading && !error && posts.length > 0 && !isUsHistory && (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {!isLoading && !error && isUsHistory && (
            <div className="space-y-16">
              {clusterGroups.map((group, clusterIdx) => (
                <section
                  key={group.cluster.id}
                  aria-labelledby={`cluster-${group.cluster.id}`}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span
                      className="text-xs font-black uppercase tracking-widest shrink-0"
                      style={{ color: "#C9A227" }}
                    >
                      {String(clusterIdx + 1).padStart(2, "0")} /
                    </span>
                    <h2
                      id={`cluster-${group.cluster.id}`}
                      className="text-lg sm:text-xl font-black text-header leading-snug tracking-tight"
                    >
                      {group.cluster.label}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-3xl border-l-2 pl-4" style={{ borderColor: "#C9A227" }}>
                    {group.cluster.description}
                  </p>
                  <div className="space-y-4">
                    {group.posts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              ))}

              {unclustered.length > 0 && (
                <section aria-labelledby="cluster-further">
                  <h2 id="cluster-further" className="text-lg font-black text-header mb-6">
                    Further Records
                  </h2>
                  <div className="space-y-4">
                    {unclustered.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}

              {/* Per-cluster JSON-LD ItemList for Google topical authority */}
              {clusterGroups.map((group) => (
                <script
                  key={`ld-${group.cluster.id}`}
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "ItemList",
                      "name": group.cluster.label,
                      "description": group.cluster.googleSignal,
                      "url": `https://clownbinge.com/category/us_history#${group.cluster.id}`,
                      "numberOfItems": group.posts.length,
                      "itemListElement": group.posts.map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "name": p.title,
                        "url": `https://clownbinge.com/case/${p.slug}`,
                      })),
                    }),
                  }}
                />
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
