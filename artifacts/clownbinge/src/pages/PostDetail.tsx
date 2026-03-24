import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { CitedBadge } from "@/components/CitedBadge";
import { ReactionBar } from "@/components/ReactionBar";
import { ShareButtons } from "@/components/ShareButtons";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { usePostDetail, useViewTracker } from "@/hooks/use-posts";
import { UserSubmittedBadge } from "@/components/UserSubmittedBadge";
import { SelfOwnScoreBadge } from "@/components/SelfOwnScoreBadge";
import { useArticleSeoHead } from "@/hooks/use-seo-head";
import { AdSlot } from "@/components/AdSlot";
import { ClownCheckCTA } from "@/components/ClownCheckCTA";
import { SponsorBar } from "@/components/SponsorBar";
import { useCategorySponsor } from "@/hooks/use-sponsor";
import { RelatedArticles } from "@/components/RelatedArticles";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Loader2, AlertTriangle, ArrowLeft, Copy, Check, Share2 } from "lucide-react";
import { Link } from "wouter";
import { abbreviateSource } from "@/lib/source-abbrev";

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


interface FactoidState {
  title: string;
  summary: string;
  x: number;
  y: number;
}

export default function PostDetail() {
  const [, params] = useRoute("/case/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading, error } = usePostDetail(slug);
  useArticleSeoHead(post);
  const { trackView } = useViewTracker(slug);
  const bodyRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);

  const processedBody = useMemo(() => {
    if (!post?.body) return post?.body ?? "";
    let html = post.body;
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
    while (count < 3) {
      const next = processedBody.indexOf("</p>", idx);
      if (next === -1) return [processedBody, ""];
      idx = next + 4;
      count++;
    }
    return [processedBody.slice(0, idx), processedBody.slice(idx)];
  }, [processedBody]);

  const references = useMemo(() => extractReferences(post?.body ?? ""), [post?.body]);

  const { data: sponsor } = useCategorySponsor(post?.category);
  const popupRef = useRef<HTMLDivElement>(null);
  const [factoid, setFactoid] = useState<FactoidState | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (post && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackView();
    }
  }, [post?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeFactoid = useCallback(() => {
    setFactoid(null);
    setCopied(false);
  }, []);

  // Click on factoid links — open popup, prevent navigation
  useEffect(() => {
    const container = bodyRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a.cb-factoid") as HTMLAnchorElement | null;
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();

      const rect = target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + window.scrollY;

      // Toggle off if clicking same factoid
      if (
        factoid &&
        Math.abs(factoid.x - x) < 4 &&
        Math.abs(factoid.y - y) < 4
      ) {
        closeFactoid();
        return;
      }

      setCopied(false);
      setFactoid({
        title: target.dataset.title || "",
        summary: target.dataset.summary || "",
        x,
        y,
      });
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [post, factoid, closeFactoid]);

  // Escape key dismisses popup
  useEffect(() => {
    if (!factoid) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFactoid();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [factoid, closeFactoid]);

  // Click outside popup and outside factoid links dismisses popup
  useEffect(() => {
    if (!factoid) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (popupRef.current?.contains(target)) return;
      if (target.closest("a.cb-factoid")) return;
      closeFactoid();
    };
    // Small delay so the click that opened the popup doesn't immediately close it
    const timeout = setTimeout(() => {
      document.addEventListener("click", handleOutside);
    }, 50);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handleOutside);
    };
  }, [factoid, closeFactoid]);

  const handleCopy = useCallback(() => {
    if (!factoid) return;
    const text = `${factoid.title}\n\n${factoid.summary}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [factoid]);

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

  return (
    <Layout>
      <article className="cb-container py-8 sm:py-12 max-w-3xl mx-auto pb-32">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>

        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-5 mb-0">
            <div>
              <div className="font-mono text-lg sm:text-xl font-bold tracking-tight text-header mb-1">
                CASE {post.caseNumber}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="uppercase tracking-widest">{post.category.replace(/_/g, " ")}</span>
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
              {post.selfOwnScore != null && <SelfOwnScoreBadge score={post.selfOwnScore} />}
              <VerifiedBadge
                source={post.verifiedSource}
                date={post.dateOfIncident ? format(new Date(post.dateOfIncident), "MMM d, yyyy") : undefined}
              />
              {references.length > 0 && <CitedBadge count={references.length} />}
            </div>
          </div>

          {/* Action links strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 py-2">
            <div className="flex gap-2 justify-center">
              <a
                href="/clowncheck"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-sm font-bold bg-secondary text-gray-900 hover:bg-secondary/80 transition-colors"
              >
                Verify ANY News
                <span className="text-[10px] font-semibold opacity-70 ml-0.5">$4.95</span>
              </a>
              <a
                href="/reports"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-sm font-bold bg-secondary text-gray-900 hover:bg-secondary/80 transition-colors"
              >
                Full PST Report
                <span className="text-[10px] font-semibold opacity-70 ml-0.5">$24.95</span>
              </a>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-muted-foreground/30 text-sm hidden sm:inline px-1">|</span>
              <a href="/submit" className="text-xs font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Submit a Post</a>
              <span className="text-muted-foreground/30">|</span>
              <a href="/ethics" className="text-xs font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Ethics Policy</a>
            </div>
          </div>
          <div className="border-b-2 border-border mb-4" />

          <h1 className={`font-sans font-bold text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight mb-5 ${isSelfOwned ? "text-primary" : "text-header"}`}>
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed border-l-4 border-secondary pl-5">
            {post.teaser}
          </p>
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

        {/* Zone 1: Hero Ad — direct sponsor takes priority; programmatic slot falls back */}
        {sponsor
          ? <SponsorBar sponsor={sponsor} />
          : <AdSlot id="cb-ad-top" className="my-6" />
        }

        {/* Article body split at paragraph 3 with ClownCheck CTA injected mid-article */}
        <div
          ref={bodyRef}
          className="cb-article-body prose prose-lg sm:prose-xl max-w-none text-foreground prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:font-bold prose-strong:text-header prose-p:leading-relaxed mb-12"
        >
          <div dangerouslySetInnerHTML={{ __html: bodyTop }} />
          <ClownCheckCTA />
          <div dangerouslySetInnerHTML={{ __html: bodyBottom }} />
        </div>

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

        {/* Discussion — compact strip */}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-3 mt-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-semibold text-sm text-header shrink-0">Discussion</span>
            <span className="text-xs text-foreground/50 truncate">Join the conversation — verified readers only</span>
          </div>
          <button className="shrink-0 bg-[#1A3A8F] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#162f74] transition-colors">
            Log in to Comment
          </button>
        </div>

        {/* Primary Sources */}
        {(references.length > 0 || post.verifiedSource) && (
          <section id="primary-sources" className="mt-10" aria-label="Primary Sources">
            <div className="h-1 w-full bg-[#F5C518] rounded-full mb-8" />
            <h2 className="font-mono font-bold text-lg tracking-tight text-header mb-6 uppercase">
              Primary Sources
            </h2>
            <ol className="space-y-5 list-none p-0 m-0">
              {references.length > 0
                ? references.map((ref, i) => (
                    <li key={ref.href} className="flex gap-4">
                      <span className="font-mono font-bold text-sm text-[#F5C518] mt-0.5 shrink-0 w-6 text-right">{i + 1}.</span>
                      <div>
                        <a
                          href={ref.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#1A3A8F] hover:underline text-sm leading-snug block mb-1"
                        >
                          {ref.title}
                        </a>
                        <p className="text-sm text-foreground/75 leading-relaxed m-0">{ref.summary}</p>
                        <span className="text-xs text-foreground/45 font-mono break-all">{ref.href}</span>
                      </div>
                    </li>
                  ))
                : post.sourceUrl
                  ? (
                    <li className="flex gap-4">
                      <span className="font-mono font-bold text-sm text-[#F5C518] mt-0.5 shrink-0 w-6 text-right">1.</span>
                      <div>
                        <a
                          href={post.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#1A3A8F] hover:underline text-sm leading-snug block mb-1"
                        >
                          {abbreviateSource(post.verifiedSource)}
                        </a>
                        <span className="text-xs text-foreground/45 font-mono break-all">{post.sourceUrl}</span>
                      </div>
                    </li>
                  )
                  : post.verifiedSource!.split(/[;|]/).map(s => s.trim()).filter(Boolean).map((entry, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-mono font-bold text-sm text-[#F5C518] mt-0.5 shrink-0 w-6 text-right">{i + 1}.</span>
                      <p className="text-sm text-foreground/75 leading-relaxed m-0">{entry}</p>
                    </li>
                  ))
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

        <RelatedArticles currentSlug={post.slug} />

        <div className="mt-14">
          <NewsletterSignup source={`post_${post.id}`} />
        </div>


      </article>


      {/* Factoid Popup Portal */}
      {factoid && createPortal(
        <div
          ref={popupRef}
          className="cb-factoid-popup"
          style={{ left: factoid.x, top: factoid.y }}
          role="dialog"
          aria-label="ClownBinge Factoid"
        >
          <div className="cb-factoid-popup-label">ClownBinge Factoid</div>
          <div className="cb-factoid-popup-title">{factoid.title}</div>
          <div className="cb-factoid-popup-summary">{factoid.summary}</div>

          {/* Action bar: Copy then Share on second line */}
          <div className="flex flex-col gap-2 mt-3">
            <button onClick={handleCopy} className="cb-factoid-popup-copy-btn self-start">
              {copied
                ? <><Check size={12} strokeWidth={3} /> Copied!</>
                : <><Copy size={12} strokeWidth={2} /> Copy Factoid</>
              }
            </button>

            <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 flex-shrink-0">Share Article</span>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title ?? "")}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank" rel="noopener noreferrer"
              title="Share on X"
              className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white font-bold text-[11px] hover:opacity-80 transition-opacity"
              style={{ background: "#000" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank" rel="noopener noreferrer"
              title="Share on Facebook"
              className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white font-bold hover:opacity-80 transition-opacity"
              style={{ background: "#1877F2" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank" rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white font-bold hover:opacity-80 transition-opacity"
              style={{ background: "#0A66C2" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent((post?.title ?? "") + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
              target="_blank" rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white hover:opacity-80 transition-opacity"
              style={{ background: "#25D366" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(post?.title ?? "")}`}
              target="_blank" rel="noopener noreferrer"
              title="Share on Telegram"
              className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-white hover:opacity-80 transition-opacity"
              style={{ background: "#26A5E4" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Layout>
  );
}
