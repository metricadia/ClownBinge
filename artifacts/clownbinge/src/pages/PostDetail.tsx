import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { CitedBadge } from "@/components/CitedBadge";
import { ReactionBar } from "@/components/ReactionBar";
import { ShareButtons } from "@/components/ShareButtons";
import { BookCTA } from "@/components/BookCTA";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { usePostDetail, useViewTracker } from "@/hooks/use-posts";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Loader2, AlertTriangle, ArrowLeft, Copy, Check } from "lucide-react";
import { Link } from "wouter";

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
  const tagRe = /<a[^>]+class="cb-factoid"[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html)) !== null) {
    const tag = m[0];
    const href = /href="([^"]*)"/.exec(tag)?.[1] ?? "";
    const title = /data-title="([^"]*)"/.exec(tag)?.[1] ?? "";
    const summary = /data-summary="([^"]*)"/.exec(tag)?.[1] ?? "";
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

  const references = useMemo(() => extractReferences(post?.body ?? ""), [post?.body]);
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
            <h1 className="font-display font-extrabold text-3xl text-red-900 mb-4">Case Not Found</h1>
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
  const isHero = post.category === "anti_racist_hero";

  return (
    <Layout>
      <article className="cb-container py-8 sm:py-12 max-w-3xl mx-auto pb-32">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>

        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-5 mb-6">
            <div>
              <div className="font-mono text-lg sm:text-xl font-bold tracking-tight text-header mb-1">
                CASE {post.caseNumber}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="uppercase tracking-widest">{post.category.replace(/_/g, " ")}</span>
                <span>•</span>
                <span>Source: <span className="text-foreground">{post.verifiedSource}</span></span>
                {post.dateOfIncident && (
                  <>
                    <span>•</span>
                    <span>Incident: {format(new Date(post.dateOfIncident), "MMM d, yyyy")}</span>
                  </>
                )}
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <VerifiedBadge
                source={post.verifiedSource}
                date={post.dateOfIncident ? format(new Date(post.dateOfIncident), "MMM d, yyyy") : undefined}
              />
              {references.length > 0 && <CitedBadge count={references.length} />}
            </div>
          </div>

          {/* Action links strip */}
          <div className="flex items-center justify-center gap-3 flex-wrap py-2.5 text-xs tracking-wide">
            <a href="/clowncheck" className="font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Verify News</a>
            <span className="text-muted-foreground/40">|</span>
            <a href="/reports" className="font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Order Comprehensive Report</a>
            <span className="text-muted-foreground/40">|</span>
            <a href="/submit" className="font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Submit A Clown</a>
            <span className="text-muted-foreground/40">|</span>
            <a href="/ethics" className="font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Our Ethics Policy</a>
          </div>
          <div className="border-b-2 border-border mb-6" />

          <h1 className={`font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight mb-5 ${isSelfOwned ? "text-primary" : "text-header"}`}>
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

        <div className="my-8 bg-muted border border-border h-[90px] w-full flex items-center justify-center rounded-lg">
          <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Advertisement</span>
        </div>

        <div
          ref={bodyRef}
          className="cb-article-body prose prose-lg sm:prose-xl max-w-none text-foreground prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:font-bold prose-strong:text-header prose-p:leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: processedBody }}
        />

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

        {/* Verified References */}
        {references.length > 0 && (
          <section id="verified-references" className="mt-10" aria-label="Verified References">
            <div className="h-1 w-full bg-[#F5C518] rounded-full mb-8" />
            <h2 className="font-display font-medium text-base text-header mb-6 uppercase tracking-widest">
              Verified References
            </h2>
            <ol className="space-y-5 list-none p-0 m-0">
              {references.map((ref, i) => (
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
              ))}
            </ol>
          </section>
        )}

        <div className="mt-14">
          <NewsletterSignup source={`post_${post.id}`} />
        </div>

        {isSelfOwned && <BookCTA variant="inline" />}

      </article>

      <BookCTA variant="banner" />

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
          <button
            onClick={handleCopy}
            className="cb-factoid-popup-copy-btn"
          >
            {copied
              ? <><Check size={12} strokeWidth={3} /> Copied!</>
              : <><Copy size={12} strokeWidth={2} /> Copy Factoid</>
            }
          </button>
        </div>,
        document.body
      )}
    </Layout>
  );
}
