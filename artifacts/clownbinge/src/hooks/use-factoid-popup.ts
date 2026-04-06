import { useState, useRef, useCallback, useEffect } from "react";

export interface FactoidState {
  title: string;
  summary: string;
  href: string;
  x: number;
  y: number;
  isLoading?: boolean;
}

export interface FactoidMeta {
  articleTitle?: string;
}

function getIsMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function isExternalLink(el: HTMLAnchorElement): boolean {
  const href = el.getAttribute("href") || el.dataset.href || "";
  if (!href || href.startsWith("#") || href.startsWith("/") || href.startsWith("javascript")) return false;
  try {
    const url = new URL(href, window.location.href);
    return url.hostname !== window.location.hostname;
  } catch {
    return false;
  }
}

function domainLabel(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

// Strip href/target from an anchor and store original href in data-href.
// The browser then has no URL to navigate to — only our click handler can act.
function patchAnchor(a: HTMLAnchorElement) {
  if (a.dataset.cbPatched) return; // already done
  const isCbFactoid = a.classList.contains("cb-factoid");
  const originalHref = a.getAttribute("href") || "";
  const isExternal =
    originalHref &&
    !originalHref.startsWith("#") &&
    !originalHref.startsWith("/") &&
    !originalHref.startsWith("javascript");

  if (!isCbFactoid && !isExternal) return;

  a.dataset.href = originalHref;
  a.dataset.cbPatched = "1";
  a.removeAttribute("href");
  a.removeAttribute("target");
  a.removeAttribute("rel");
  a.style.cursor = "pointer";
}

async function fetchContextualSummary(
  href: string,
  linkText: string,
  surroundingText: string,
  articleTitle: string,
): Promise<{ title: string; summary: string }> {
  const base = (import.meta.env.BASE_URL as string)?.replace(/\/$/, "") ?? "";
  const res = await fetch(`${base}/api/factoid-context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ href, linkText, surroundingText, articleTitle }),
  });
  if (!res.ok) throw new Error("factoid-context failed");
  return res.json() as Promise<{ title: string; summary: string }>;
}

export function useFactoidPopup(meta?: FactoidMeta) {
  const containerRef = useRef<HTMLElement | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [factoid, setFactoid] = useState<FactoidState | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeFactoid = useCallback(() => {
    setFactoid(null);
    setCopied(false);
  }, []);

  // MutationObserver: patch links the instant they appear in the DOM.
  // This handles the async article load — no timing assumption needed.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const patchAll = () => {
      container
        .querySelectorAll<HTMLAnchorElement>("a[href]")
        .forEach(patchAnchor);
    };

    patchAll(); // catch any already-present links

    const observer = new MutationObserver(patchAll);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Capture-phase click listener: fires before browser default and before
  // any child handlers. Combined with the stripped href this makes navigation
  // physically impossible.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a") as HTMLAnchorElement | null;
      if (!target) return;

      const href = target.dataset.href || "";
      const isCbFactoid = target.classList.contains("cb-factoid");

      // Only intercept external or cb-factoid links
      if (!isCbFactoid && !href) return;
      if (!isCbFactoid && (href.startsWith("#") || href.startsWith("/"))) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const rect = target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + (document.getElementById("root")?.scrollTop ?? window.scrollY);

      // Toggle off if same link clicked twice
      if (factoid && Math.abs(factoid.x - x) < 4 && Math.abs(factoid.y - y) < 4) {
        closeFactoid();
        return;
      }

      const linkText = target.textContent?.trim() || domainLabel(href);
      const existingTitle = target.dataset.title || linkText;
      const existingSummary = target.dataset.summary || "";

      setCopied(false);

      const surroundingText =
        target.closest("p, li, blockquote")?.textContent?.trim() || "";

      if (existingSummary) {
        // Show baked content immediately for instant feedback, then fetch
        // a comprehensive educational expansion in the background.
        setFactoid({ title: existingTitle, summary: existingSummary, href, x, y, isLoading: true });

        fetchContextualSummary(
          href,
          linkText,
          surroundingText,
          meta?.articleTitle || document.title || "",
        )
          .then(({ title, summary }) => {
            setFactoid((prev) =>
              prev && prev.x === x && prev.y === y
                ? { ...prev, title, summary, isLoading: false }
                : prev,
            );
          })
          .catch(() => {
            // Fall back to the baked summary silently
            setFactoid((prev) =>
              prev && prev.x === x && prev.y === y
                ? { ...prev, isLoading: false }
                : prev,
            );
          });
      } else {
        // No summary — show loading state, then fetch comprehensive explanation
        setFactoid({
          title: existingTitle,
          summary: "",
          href,
          x,
          y,
          isLoading: true,
        });

        fetchContextualSummary(
          href,
          linkText,
          surroundingText,
          meta?.articleTitle || document.title || "",
        )
          .then(({ title, summary }) => {
            setFactoid((prev) =>
              prev && prev.x === x && prev.y === y
                ? { ...prev, title, summary, isLoading: false }
                : prev,
            );
          })
          .catch(() => {
            setFactoid((prev) =>
              prev && prev.x === x && prev.y === y
                ? {
                    ...prev,
                    summary: `Primary source reference from ${domainLabel(href)}. Visit the linked record for full documentation.`,
                    isLoading: false,
                  }
                : prev,
            );
          });
      }
    };

    container.addEventListener("click", handleClick, { capture: true });
    return () => container.removeEventListener("click", handleClick, { capture: true });
  }, [factoid, closeFactoid, meta?.articleTitle]);

  useEffect(() => {
    if (!factoid) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFactoid();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [factoid, closeFactoid]);

  useEffect(() => {
    if (!factoid) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (popupRef.current?.contains(target)) return;
      if (target.closest("a")) return;
      closeFactoid();
    };
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

  return { containerRef, popupRef, factoid, copied, isMobile, closeFactoid, handleCopy };
}
