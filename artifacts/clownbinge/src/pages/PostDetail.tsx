import { useAuth } from "@clerk/react";
import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { CitedBadge } from "@/components/CitedBadge";
import { ReactionBar } from "@/components/ReactionBar";
import { ShareButtons } from "@/components/ShareButtons";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { usePostDetail, useViewTracker, useSeriesPosts } from "@/hooks/use-posts";
import { UserSubmittedBadge } from "@/components/UserSubmittedBadge";
import { SelfOwnScoreBadge } from "@/components/SelfOwnScoreBadge";
import { useArticleSeoHead } from "@/hooks/use-seo-head";
import { AdSlot } from "@/components/AdSlot";
import { ClownCheckCTA } from "@/components/ClownCheckCTA";
import { SponsorBar } from "@/components/SponsorBar";
import { useCategorySponsor } from "@/hooks/use-sponsor";
import { RelatedArticles } from "@/components/RelatedArticles";
import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { format } from "date-fns";
import { Loader2, AlertTriangle, Lock, Star } from "lucide-react";
import { useFactoidPopup } from "@/hooks/use-factoid-popup";
import { FactoidPopup } from "@/components/FactoidPopup";
import { MetricadiaIDPopup } from "@/components/MetricadiaIDPopup";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { useSubscription } from "@/hooks/use-subscription";
import { useAdmin } from "@/context/AdminContext";
import { Link } from "wouter";
import { abbreviateSource } from "@/lib/source-abbrev";
import { ForensicPivot } from "@/components/ForensicPivot";
import { getCategoryConfig } from "@/lib/category-config";
import { useArticleToc } from "@/hooks/use-article-toc";
import { ArticleToc } from "@/components/ArticleToc";

function linkifySource(text: string): React.ReactNode {
  return <span>{text}</span>;
}

function abbreviateTitle(title: string): string {
  if (/senator/i.test(title)) return "Sen.";
  if (/representative/i.test(title)) return "Rep.";
  if (/attorney general/i.test(title)) return "AG";
  if (/governor/i.test(title)) return "Gov.";
  if (/pastor/i.test(title)) return "Pastor";
  if (/mayor/i.test(title)) return "Mayor";
  if (/president/i.test(title)) return "President";
  return "";
}

function formatSubjectLabel(name: string, title: string | null, party: string | null): string {
  const abbr = title ? abbreviateTitle(title) : "";
  const partyInitial = party === "Republican" ? "(R)" : party === "Democrat" || party === "Democratic" ? "(D)" : "";
  return [abbr, name, partyInitial].filter(Boolean).join(" ");
}

interface Reference {
  title: string;
  summary: string;
  href: string;
}

function extractReferences(html: string): Reference[] {
  const seen = new Set<string>();
  const refs: Reference[] = [];
  const tagRe = /<a[^>]+class=["']cb-factoid["'][^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html)) !== null) {
    const tag = m[0];
    const href = /href=["']([^"']*)["']/.exec(tag)?.[1] ?? "";
    const title = /data-title=["']([^"']*)["']/.exec(tag)?.[1] ?? "";
    const summary = /data-summary=["']([^"']*)["']/.exec(tag)?.[1] ?? "";
    if (href && title && !seen.has(href)) {
      seen.add(href);
      refs.push({ href, title, summary });
    }
  }
  return refs;
}

function boldFirstMention(html: string, name: string, label: string): string {
  if (!name || !html) return html;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(
    new RegExp(`(>|^)([^<]*?)(${escaped})`),
    `$1$2<strong class="cb-subject-intro">${label}</strong>`
  );
}


export default function PostDetail() {
  const [, params] = useRoute("/case/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading, error } = usePostDetail(slug);
  useArticleSeoHead(post);
  const { trackView } = useViewTracker(slug);
  const hasTrackedView = useRef(false);
  const { containerRef, popupRef, factoid, copied, isMobile, closeFactoid, handleCopy } = useFactoidPopup(
    post ? { articleTitle: post.title } : undefined,
  );
  // ── Subscription gate ───────────────────────────────────────────────────────
  const { data: subscriptionStatus } = useSubscription();
  const { isAdmin, checking: adminChecking } = useAdmin();
  const { data: seriesPosts } = useSeriesPosts((post as any)?.seriesName);
  const [gateOpen, setGateOpen] = useState(false);
  const [gateTrigger, setGateTrigger] = useState<"metricadiaid" | "factoid" | "comment">("metricadiaid");

  // Crawler detection — Googlebot and all major search/archive bots bypass the gate.
  // We declare the paywall in JSON-LD (isAccessibleForFree: False) so Google does not
  // treat this as cloaking; it is explicitly allowed under Google's Flexible Sampling policy.
  const isCrawler = typeof navigator !== "undefined" &&
    /Googlebot|Googlebot-Mobile|Googlebot-Image|bingbot|DuckDuckBot|Slurp|ia_archiver|Applebot|AhrefsBot|SemrushBot|MJ12bot/i
      .test(navigator.userAgent);

  // Clerk auth state
  const { isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const isAuthGated = !isCrawler && clerkLoaded && !isSignedIn;

  // True once we know both admin and subscriber status
  const authResolved = !adminChecking && subscriptionStatus !== undefined;
  const isPremiumGated = !isCrawler && !isAuthGated && authResolved && !!(post as any)?.premiumOnly && !isAdmin && !subscriptionStatus?.isSubscriber;

  const toc = useArticleToc(containerRef, post?.id, isAuthGated || isPremiumGated);

  const [commentText, setCommentText] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Gate factoid popup: if premium-only and not subscribed, close factoid and show gate
  useEffect(() => {
    if (factoid && post?.premiumOnly && !subscriptionStatus?.isSubscriber) {
      closeFactoid();
      setGateTrigger("factoid");
      setGateOpen(true);
    }
  }, [factoid, post?.premiumOnly, subscriptionStatus?.isSubscriber, closeFactoid]);

  // ── MetricadiaID™ — people click handler ───────────────────────────────────
  interface MetricadiaIDPerson { name: string; imageUrl: string; description?: string; attribution?: string; }
  const [activePerson, setActivePerson] = useState<MetricadiaIDPerson | null>(null);
  const closePersonPopup = useCallback(() => setActivePerson(null), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePersonClick = (e: MouseEvent) => {
      const span = (e.target as Element).closest("[data-metricadiaid-name]") as HTMLElement | null;
      if (!span) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (post?.premiumOnly && !subscriptionStatus?.isSubscriber && !isAdmin) {
        setGateTrigger("metricadiaid");
        setGateOpen(true);
        return;
      }
      const name = span.dataset.metricadiaidName || "";
      const imageUrl = span.dataset.metricadiaidImage || "";
      const description = span.dataset.metricadiaidDesc || undefined;
      const attribution = span.dataset.metricadiaidAttribution || undefined;
      if (name) setActivePerson({ name, imageUrl, description, attribution });
    };

    container.addEventListener("click", handlePersonClick, { capture: true });
    return () => container.removeEventListener("click", handlePersonClick, { capture: true });
  }, [containerRef, post?.id, post?.premiumOnly, subscriptionStatus?.isSubscriber, isAdmin]);

  const processedBody = useMemo(() => {
    if (!post?.body) return post?.body ?? "";
    let html = post.body;

    // Convert legacy div-based factoid blocks to the popup anchor format.
    // Pattern: <div class="cb-factoid"><strong>CB Factoid:</strong> text</div>
    html = html.replace(
      /<div class="cb-factoid">\s*<strong>CB Factoid:<\/strong>\s*([\s\S]*?)<\/div>/g,
      (_, rawText: string) => {
        const text = rawText.trim();
        // First sentence as anchor text (visible in article), full text in popup
        const dotIdx = text.search(/\.\s/);
        const linkRaw = dotIdx > 10 && dotIdx < 140 ? text.slice(0, dotIdx + 1) : text.slice(0, 100);
        const linkText = linkRaw.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        const title = linkRaw.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        const summary = text.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        return `<a class="cb-factoid" href="#" data-title="${title}" data-summary="${summary}">${linkText}</a>`;
      }
    );

    if (post.subjectName) {
      const label = formatSubjectLabel(post.subjectName, post.subjectTitle ?? null, post.subjectParty ?? null);
      html = boldFirstMention(html, post.subjectName, label);
    }
    return html;
  }, [post?.body, post?.subjectName, post?.subjectTitle, post?.subjectParty]);

  const [bodyTop, bodyBottom] = useMemo(() => {
    if (!processedBody) return [processedBody, ""];
    let count = 0;
    let idx = 0;
    while (count < 1) {
      const next = processedBody.indexOf("</p>", idx);
      if (next === -1) return [processedBody, ""];
      idx = next + 4;
      count++;
    }
    return [processedBody.slice(0, idx), processedBody.slice(idx)];
  }, [processedBody]);

  const references = useMemo(() => extractReferences(post?.body ?? ""), [post?.body]);

  // Citation count that matches what the Primary Sources section actually renders.
  // Priority: APA 7 (::) entries > factoid links in body > plain verifiedSource entries > sourceUrl.
  const citationCount = useMemo(() => {
    if (!post) return 0;
    if (post.verifiedSource && post.verifiedSource.includes("::")) {
      return post.verifiedSource.split(/[;|]/).map(s => s.trim()).filter(Boolean).length;
    }
    if (references.length > 0) return references.length;
    if (post.verifiedSource) {
      return post.verifiedSource.split(/[;|]/).map(s => s.trim()).filter(Boolean).length || 1;
    }
    const ps = (post as any).primarySources;
    if (Array.isArray(ps) && ps.length > 0) return ps.length;
    if (post.sourceUrl) return 1;
    return 0;
  }, [post, references]);

  const { data: sponsor } = useCategorySponsor(post?.category);

  useEffect(() => {
    if (post && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackView();
    }
  }, [post?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <Layout>
        <div className="cb-container py-24 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-bold text-foreground">Pulling the file...</h2>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="cb-container py-24 max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-10">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="font-sans font-bold text-3xl text-red-900 mb-4">Case Not Found</h1>
            <p className="text-red-700 mb-8">
              Either this URL is wrong, or the politicians finally figured out how to delete the internet. (Probably the former.)
            </p>
            <Link href="/" className="inline-flex bg-red-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-800 transition-colors">
              Return to Archives
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isSelfOwned = post.category === "self_owned";
  const isVideo = post.hasVideo;
  const isHero = post.category === "anti_racist_heroes";
  const isNerdOut = post.category === "nerd_out";
  const isFoundersPen = post.category === "founders_pen";
  const foundersPenWordCount = post?.body ? post.body.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length : 0;
  const foundersPenReadTime = Math.max(1, Math.ceil(foundersPenWordCount / 200));
  const foundersPenArticleHtml = post?.body ?? "";

  return (
    <Layout>
      <article className={`cb-container py-8 sm:py-12 max-w-3xl mx-auto pb-32 ${isFoundersPen ? "founders-pen-article" : ""}`}>

        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-5 mb-0">
            <div>
              <div className="font-mono text-lg sm:text-xl font-bold tracking-tight text-header mb-1">
                CASE {post.caseNumber}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
                {!isFoundersPen && <span className="uppercase tracking-widest">{post.category.replace(/_/g, " ")}</span>}
                {isFoundersPen && (
                  <>
                    <span>•</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "#8B1A1A" }}>
                      Founder's Pen
                    </span>
                    <span>•</span>
                    <span className="text-xs font-semibold text-header/70">
                      {foundersPenWordCount.toLocaleString()} WORDS | {foundersPenReadTime} MIN READ
                    </span>
                  </>
                )}
                {!isFoundersPen && processedBody && processedBody.length > 5000 && (
                  <>
                    <span>•</span>
                    <span className="text-xs font-semibold text-header/70">
                      {Math.ceil(processedBody.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length / 200)} MIN READ | {citationCount} PRIMARY SOURCES
                    </span>
                  </>
                )}
                <span>•</span>
                <span>Source: <span className="text-foreground">{abbreviateSource(post.verifiedSource)}</span></span>
                {post.dateOfIncident && (
                  <>
                    <span>•</span>
                    <span>Incident: {format(new Date(post.dateOfIncident), "MMM d, yyyy")}</span>
                  </>
                )}
              </div>
              {post.category === "nerd_out" && (
                <p className="text-xs italic text-fuchsia-900 font-medium mt-1">Academic analysis. Primary sources. For the seriously curious.</p>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-2 flex-wrap justify-end">
              {post.userSubmitted && <UserSubmittedBadge />}
              {post.selfOwnScore != null && post.category === "self_owned" && <SelfOwnScoreBadge score={post.selfOwnScore} />}
              <VerifiedBadge
                source={post.verifiedSource}
                date={post.dateOfIncident ? format(new Date(post.dateOfIncident), "MMM d, yyyy") : undefined}
              />
              {citationCount > 0 && <CitedBadge count={citationCount} />}
              {post.locked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" /> Record Locked
                </span>
              )}
              {post.premiumOnly && !subscriptionStatus?.isSubscriber && !isAdmin && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: "#F5C518", color: "#1A1A2E" }}
                  onClick={() => { setGateTrigger("metricadiaid"); setGateOpen(true); }}
                  title="Interactive tools are for Supporting Members"
                >
                  <Lock className="w-3 h-3" /> Members Only Tools
                </span>
              )}
            </div>
          </div>

          {/* Locked banner */}
          {post.locked && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-xs font-bold uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              This record has been locked. No changes can be made.
            </div>
          )}

          <div className="flex items-center justify-center gap-2 py-2">
            <span className="text-muted-foreground/30 text-sm hidden sm:inline px-1">|</span>
            <a href="/submit" className="text-xs font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Submit a Post</a>
            <span className="text-muted-foreground/30">|</span>
            <a href="/ethics" className="text-xs font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Ethics Policy</a>
          </div>
          <div className="border-b-2 border-border mb-4" />

          {isFoundersPen && (
            <div className="mb-4 inline-flex items-center px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em]" style={{ background: "#3D1A00", color: "#fff" }}>
              Founder's Pen
            </div>
          )}

          <h1 data-speakable-headline className={`font-sans font-bold text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight mb-3 ${isSelfOwned ? "text-primary" : "text-header"} ${isFoundersPen ? "founders-pen-title" : ""}`}>
            {post.title}
          </h1>

          {isNerdOut && (
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
              NerdOut Academic Analysis &mdash; Primary Sources &mdash; Scholarly Read
            </p>
          )}

          {isFoundersPen && (
            <div className="mb-5 p-4 border-l-[3px]" style={{ borderLeftColor: "#8B1A1A", background: "#F5F5F3" }}>
              <p className="text-sm uppercase tracking-[0.2em] font-black mb-2" style={{ color: "#8B1A1A" }}>A note on this category.</p>
              <p className="text-base leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Mainstream "Opinion" is discourse theatre. This is a Founder's Treatise. We maintain absolute ClownBinge sourcing standards to prove that our perspective isn't a bias—it's the only logical result of reading the documents. Read this as a data-driven indictment of the status quo.
              </p>
            </div>
          )}

          <p data-speakable-lede className={`text-base sm:text-lg text-muted-foreground font-medium leading-relaxed border-l-4 border-secondary pl-5 ${isFoundersPen ? "founders-pen-lede" : ""}`}>
            {post.teaser}
          </p>

          {(post as any).seriesName && (post as any).seriesSequence && (() => {
            const seq: string = (post as any).seriesSequence;
            const name: string = (post as any).seriesName;
            const partNum = seq.match(/ITP-(\d+)/)?.[1];
            const ordinals: Record<string, string> = { "1": "Part One", "2": "Part Two", "3": "Part Three" };
            const ordinal = ordinals[partNum ?? ""] ?? seq;
            const siblings = (seriesPosts ?? []).filter((p: any) => p.slug !== post.slug);
            const getPartLabel = (sibSeq: string) => {
              const n = sibSeq.match(/ITP-(\d+)/)?.[1];
              return ordinals[n ?? ""] ?? sibSeq;
            };
            return (
              <div className="mt-4 border-l-4 pl-5 py-2 text-base leading-relaxed" style={{ borderColor: "#C9A227", background: "#FDFAF3" }}>
                <strong>This is {ordinal}</strong> of {/^[Tt]he\s/.test(name) ? name.replace(/^[Tt]he\s+/, 'the ') : `the ${name}`}, a three-part ClownBinge archival investigation.
                {siblings.length > 0 && (
                  <span>
                    {siblings.map((sib: any, i: number) => (
                      <span key={sib.slug}>
                        {" "}<strong><Link href={`/case/${sib.slug}`} style={{ textDecoration: "underline", textDecorationColor: "#C9A227" }}>{getPartLabel((sib as any).seriesSequence ?? "")}: {sib.title.replace(/^The Ivory Terror Project:\s*/i, "").replace(/\.$/, "")}</Link></strong>{i < siblings.length - 1 ? "." : "."}
                      </span>
                    ))}
                  </span>
                )}
                {[1,2,3].filter(n => ![ ...(seriesPosts ?? []).map((p: any) => p.seriesSequence?.match(/ITP-(\d+)/)?.[1]), partNum ].includes(String(n))).length > 0 && (
                  <span className="text-muted-foreground"> {[1,2,3].filter(n => ![ ...(seriesPosts ?? []).map((p: any) => p.seriesSequence?.match(/ITP-(\d+)/)?.[1]), partNum ].includes(String(n))).map(n => ordinals[String(n)]).join(" and ")} {[1,2,3].filter(n => ![ ...(seriesPosts ?? []).map((p: any) => p.seriesSequence?.match(/ITP-(\d+)/)?.[1]), partNum ].includes(String(n))).length === 1 ? "is" : "are"} forthcoming.</span>
                )}
              </div>
            );
          })()}
        </header>

        {isVideo && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video relative">
            {post.videoUrl ? (
              <iframe
                src={post.videoUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <span className="text-3xl">▶</span>
                </div>
                <p className="font-mono text-sm tracking-widest uppercase">Secured Video Record</p>
              </div>
            )}
          </div>
        )}


        {/* Table of Contents — auto-generated from H2 tags; visible to crawlers and signed-in users */}
        <ArticleToc items={toc} isFoundersPen={isFoundersPen} />

        {/* Article body — preview only when gated */}
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`cb-article-body prose prose-lg sm:prose-xl max-w-none text-foreground prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-strong:text-header prose-p:leading-relaxed mb-4 ${isFoundersPen ? "founders-pen-body" : ""}`}
        >
          {isFoundersPen ? (
            <div className="fp-body" dangerouslySetInnerHTML={{ __html: (isAuthGated || isPremiumGated) ? bodyTop : foundersPenArticleHtml }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: bodyTop }} />
          )}
          {!isAuthGated && !isPremiumGated && (
            <>
              {sponsor
                ? <SponsorBar sponsor={sponsor} />
                : <AdSlot id="cb-ad-top" className="my-6 not-prose" />
              }
              <ClownCheckCTA />
              <ForensicPivot slug={slug} />
              {!isFoundersPen && <div dangerouslySetInnerHTML={{ __html: bodyBottom }} />}
            </>
          )}
        </div>

        {/* ── Auth gate — sign in required to read ── */}
        {isAuthGated && (
          <div className="mb-12">
            <div className="h-24 -mt-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
            <div style={{ border: "1px solid #1A3A8F", borderTop: "4px solid #1A3A8F", background: "#fff" }}>
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5" style={{ borderBottom: "1px solid #E5E7EB", background: "#FAFAFA" }}>
                <span className="text-xs font-semibold" style={{ color: "#374151" }}>
                  Members-Only Article
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.22em] px-2.5 py-0.5 rounded-full shrink-0" style={{ background: "#1A3A8F", color: "#F5C518" }}>
                  Sign In Required
                </span>
              </div>
              <div className="px-6 pt-6 pb-8 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#EEF2FF" }}>
                  <Lock className="w-6 h-6" style={{ color: "#1A3A8F" }} />
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: "#111827" }}>
                  Sign In to Read This Article
                </h3>
                <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                  ClownBinge is free to join. Create an account with Google or Apple to access the full article.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-colors"
                    style={{ background: "#1A3A8F", color: "#fff" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-colors"
                    style={{ border: "2px solid #1A3A8F", color: "#1A3A8F" }}
                  >
                    Create Free Account
                  </Link>
                </div>
                <p className="text-xs mt-4" style={{ color: "#9CA3AF" }}>
                  Already a subscriber?{" "}
                  <Link href="/sign-in" className="underline" style={{ color: "#1A3A8F" }}>Sign in</Link>{" "}
                  to access your premium content.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Premium gate — rendered OUTSIDE prose so styles work ── */}
        {isPremiumGated && (() => {
          const rawWc = post?.body ? post.body.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length : 0;
          const wcLabel = rawWc >= 1000 ? `~${(rawWc / 1000).toFixed(1).replace(/\.0$/, "")}K words` : rawWc > 0 ? `~${rawWc} words` : null;
          return (
            <div className="mb-12">
              {/* Fade over last lines of preview */}
              <div className="h-24 -mt-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />

              {/* Gate card */}
              <div style={{ border: "1px solid #C9A84C", borderTop: "4px solid #C9A84C", background: "#fff" }}>

                {/* Top info bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5" style={{ borderBottom: "1px solid #E5E7EB", background: "#FAFAFA" }}>
                  <span className="text-xs font-semibold" style={{ color: "#374151" }}>
                    Subscription Required To Read This Article
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] px-2.5 py-0.5 rounded-full shrink-0" style={{ background: "#1A3A8F", color: "#F5C518" }}>
                    Premium Article
                  </span>
                </div>

                {/* Main body */}
                <div className="px-6 pt-5 pb-6 text-center">

                  {/* Price — front and center */}
                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="font-display font-black" style={{ fontSize: "2.8rem", lineHeight: 1, color: "#1A3A8F" }}>$9</span>
                    <span className="font-bold text-base" style={{ color: "#374151" }}>/month</span>
                  </div>

                  <p className="font-bold text-xl leading-snug mb-5" style={{ color: "#1A1A2E" }}>
                    {rawWc > 0 ? `${rawWc.toLocaleString()} Words of Evidence.` : "Words of Evidence."} We Aren't Fox, CNN, or Washington Post.
                  </p>

                  <div className="flex flex-col gap-3">
                    <a
                      href="/subscribe"
                      className="flex items-center justify-center gap-2 w-full py-4 font-black text-base uppercase tracking-widest transition-opacity hover:opacity-90"
                      style={{ background: "#1A3A8F", color: "#F5C518", textDecoration: "none", letterSpacing: "0.15em" }}
                    >
                      <Lock className="w-4 h-4" />
                      Become a Supporting Member — $9/mo
                    </a>
                    <button
                      onClick={() => { setGateTrigger("metricadiaid"); setGateOpen(true); }}
                      className="text-sm font-semibold hover:underline underline-offset-4"
                      style={{ color: "#1A3A8F", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Already a member? Enter access token
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Engagement strip */}
        <div className="border-t border-border pt-4 mt-2 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-10 shrink-0">React</span>
            <ReactionBar postId={post.id} isHero={isHero} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-10 shrink-0">Share</span>
            <ShareButtons post={post} />
          </div>
        </div>

        {/* Discussion section */}
        <div className="border-t border-border pt-6 mt-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-header">☕ Coffee &amp; Tea</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Members Only</span>
              </div>
              <span className="text-xs font-medium" style={{ color: "#374151" }}>Join our respectful conversations.</span>
            </div>
            {subscriptionStatus?.isSubscriber && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>
                <Star className="w-2.5 h-2.5 fill-current" /> Active
              </span>
            )}
          </div>

          {/* Ghost comments — always visible, blurred for non-subscribers */}
          <div className="space-y-4 mb-5 relative">
            {[
              { initials: "MR", color: "#1A3A8F", name: "M. Rodriguez", time: "2h ago", text: "The primary source record on this is staggering. I pulled the original filing myself — every single number checks out. This is why I subscribe." },
              { initials: "TW", color: "#7C3AED", name: "T. Washington", time: "5h ago", text: "Compare this to the coverage in legacy outlets. Not a single citation to an actual document. ClownBinge is the only place doing this work correctly." },
              { initials: "AJ", color: "#065F46", name: "A. Johnson", time: "8h ago", text: "Shared this with my research group. The S. Hrg. number alone opens up three additional primary sources we hadn't cross-referenced yet." },
            ].map((c) => (
              <div
                key={c.initials}
                className={`flex gap-3 transition-all duration-200 ${subscriptionStatus?.isSubscriber ? "" : "select-none pointer-events-none"}`}
                style={subscriptionStatus?.isSubscriber ? {} : { filter: "blur(5px)", opacity: 0.55 }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-bold" style={{ background: c.color }}>
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-xs text-header">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}

            {/* Lock overlay for non-subscribers */}
            {!subscriptionStatus?.isSubscriber && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => { setGateTrigger("comment"); setGateOpen(true); }}
              >
                <div className="rounded-xl px-5 py-3 text-center shadow-lg border border-amber-200" style={{ background: "rgba(255,251,235,0.97)" }}>
                  <Lock className="w-4 h-4 mx-auto mb-1.5 text-amber-700" />
                  <p className="text-xs font-bold text-amber-900">Members read the full discussion</p>
                </div>
              </div>
            )}
          </div>

          {/* Comment input */}
          {subscriptionStatus?.isSubscriber ? (
            commentSubmitted ? (
              <div className="rounded-xl px-4 py-3 text-sm text-center border border-green-200" style={{ background: "#F0FDF4", color: "#166534" }}>
                Comment submitted. Our team reviews all discussion before publishing.
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your analysis, a question, or an additional primary source…"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3A8F]/30"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => { if (commentText.trim()) setCommentSubmitted(true); }}
                    disabled={!commentText.trim()}
                    className="px-4 py-2 rounded-lg font-bold text-xs text-white transition-opacity disabled:opacity-40"
                    style={{ background: "#1A3A8F" }}
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            )
          ) : (
            <div
              className="rounded-xl border border-border bg-muted/40 px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-[#1A3A8F]/40 transition-colors"
              onClick={() => { setGateTrigger("comment"); setGateOpen(true); }}
            >
              <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
              <span className="text-sm text-muted-foreground flex-1">Add to the discussion…</span>
              <span className="shrink-0 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "#1A3A8F", color: "#F5C518" }}>
                <Star className="w-3 h-3 fill-current" /> Subscribe
              </span>
            </div>
          )}
        </div>

        {/* Primary Sources */}
        {(references.length > 0 || post.verifiedSource) && (
          <section id="primary-sources" className="mt-10" aria-label="Primary Sources">
            <div className="h-1 w-full bg-[#F5C518] rounded-full mb-8" />
            <h2 className="font-mono font-bold text-lg tracking-tight text-header mb-6 uppercase">
              Primary Sources
            </h2>
            <ol className="space-y-5 list-none p-0 m-0">
              {/* verifiedSource with APA 7 format (::) always takes priority */}
              {post.verifiedSource && post.verifiedSource.includes("::")
                ? post.verifiedSource.split(/[;|]/).map(s => s.trim()).filter(Boolean).map((entry, i) => {
                    const cleaned = entry.replace(/(https?:\/\/[^\s,;)]+)/, "").trim();
                    const heading = cleaned.split("::")[0].trim();
                    const citation = cleaned.split("::").slice(1).join("::").trim();
                    return (
                      <li key={i} className="flex gap-4">
                        <span className="font-mono font-bold text-sm text-[#F5C518] mt-0.5 shrink-0 w-6 text-right">{i + 1}.</span>
                        <div>
                          <p className="font-bold text-sm text-foreground/80 leading-snug mb-0.5 m-0">{heading}</p>
                          {citation && <p className="text-sm text-foreground/65 leading-snug m-0 italic">{citation}</p>}
                        </div>
                      </li>
                    );
                  })
                : references.length > 0
                  ? references.map((ref, i) => (
                      <li key={ref.href} className="flex gap-4">
                        <span className="font-mono font-bold text-sm text-[#F5C518] mt-0.5 shrink-0 w-6 text-right">{i + 1}.</span>
                        <div>
                          <p className="font-bold text-sm text-foreground/80 leading-snug mb-1 m-0">{ref.title}</p>
                          <p className="text-sm text-foreground/75 leading-relaxed m-0">{ref.summary}</p>
                        </div>
                      </li>
                    ))
                  : post.sourceUrl
                    ? (
                      <li className="flex gap-4">
                        <span className="font-mono font-bold text-sm text-[#F5C518] mt-0.5 shrink-0 w-6 text-right">1.</span>
                        <div>
                          <p className="font-bold text-sm text-foreground/80 leading-snug mb-1 m-0">{abbreviateSource(post.verifiedSource)}</p>
                        </div>
                      </li>
                    )
                    : post.verifiedSource!.split(/[;|]/).map(s => s.trim()).filter(Boolean).map((entry, i) => {
                        const urlMatch = entry.match(/(https?:\/\/[^\s,;)]+)/);
                        const url = urlMatch ? urlMatch[1] : null;
                        const cleaned = url ? entry.replace(url, "").replace(/\s+$/, "").trim() : entry;
                        const displayLabel = cleaned || (url ? new URL(url).hostname.replace(/^www\./, "") : entry);
                        return (
                          <li key={i} className="flex gap-4">
                            <span className="font-mono font-bold text-sm text-[#F5C518] mt-0.5 shrink-0 w-6 text-right">{i + 1}.</span>
                            <div>
                              <p className="font-bold text-sm text-foreground/80 leading-snug m-0">{displayLabel}</p>
                            </div>
                          </li>
                        );
                      })
              }
            </ol>
          </section>
        )}

        {/* Zone 3: Bottom programmatic slot — after the full source record */}
        <AdSlot id="cb-ad-bottom" className="mt-10" />

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border hover:border-primary hover:text-primary transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Explore Further — Professional CTA */}
        <section className="mt-16 pt-12 border-t border-border space-y-6">
          <div>
            <h2 className="font-mono font-bold text-lg tracking-tight text-header mb-4 uppercase">
              Explore Further
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <a
                href="/clowncheck"
                className="group block p-6 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all"
              >
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Analyze Any News Story
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Submit a claim or news story for independent verification against primary sources.
                </p>
                <span className="text-xs font-semibold text-primary">$4.95</span>
              </a>
              <a
                href="/reports"
                className="group block p-6 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all"
              >
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Full Dossier on Any Public Figure
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive report: verified incidents, contradictions, voting record, documented record.
                </p>
                <span className="text-xs font-semibold text-primary">$24.95</span>
              </a>
            </div>
          </div>
        </section>

        {/* Category Hub Link — bidirectional internal linking for SEO topical authority */}
        {(() => {
          const catConfig = getCategoryConfig(post.category);
          if (!catConfig) return null;
          return (
            <div className="mt-8 mb-2">
              <Link
                href={`/category/${post.category}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0 ${catConfig.pillBg} ${catConfig.pillText}`}>
                    {catConfig.label}
                  </span>
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    Browse all <span className="text-primary">{catConfig.label}</span> verified records
                  </p>
                </div>
                <span className="text-primary font-bold text-sm shrink-0 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          );
        })()}

        <RelatedArticles currentSlug={post.slug} category={post.category} />

        <div className="mt-14">
          <NewsletterSignup source={`post_${post.id}`} />
        </div>


      </article>


      {/* Subscription gate modal */}
      {gateOpen && (
        <SubscriptionModal trigger={gateTrigger} onClose={() => setGateOpen(false)} />
      )}

      {/* MetricadiaID™ — people popup */}
      {activePerson && (
        <MetricadiaIDPopup
          open={!!activePerson}
          onClose={closePersonPopup}
          name={activePerson.name}
          imageUrl={activePerson.imageUrl}
          description={activePerson.description}
          attribution={activePerson.attribution}
        />
      )}

      {/* Factoid Popup / Bottom Sheet */}
      {factoid && (
        <FactoidPopup
          factoid={factoid}
          popupRef={popupRef}
          copied={copied}
          isMobile={isMobile}
          onClose={closeFactoid}
          onCopy={handleCopy}
          extraFooter={post ? (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex-shrink-0">Share</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title ?? "")}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noopener noreferrer" title="Share on X" className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white hover:opacity-80 transition-opacity" style={{ background: "#000" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noopener noreferrer" title="Share on Facebook" className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white hover:opacity-80 transition-opacity" style={{ background: "#1877F2" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white hover:opacity-80 transition-opacity" style={{ background: "#0A66C2" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent((post.title ?? "") + " " + (typeof window !== "undefined" ? window.location.href : ""))}`} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white hover:opacity-80 transition-opacity" style={{ background: "#25D366" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(post.title ?? "")}`} target="_blank" rel="noopener noreferrer" title="Share on Telegram" className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white hover:opacity-80 transition-opacity" style={{ background: "#26A5E4" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>
          ) : undefined}
        />
      )}
    </Layout>
  );
}
