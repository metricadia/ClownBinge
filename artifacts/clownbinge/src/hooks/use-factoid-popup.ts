import { useState, useRef, useCallback, useEffect } from "react";

export interface FactoidState {
  title: string;
  summary: string;
  href: string;
  x: number;
  y: number;
}

function getIsMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function isExternalLink(el: HTMLAnchorElement): boolean {
  const href = el.getAttribute("href") || "";
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

export function useFactoidPopup() {
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a") as HTMLAnchorElement | null;
      if (!target) return;

      const isCbFactoid = target.classList.contains("cb-factoid");
      const external = isExternalLink(target);

      if (!isCbFactoid && !external) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + window.scrollY;

      if (factoid && Math.abs(factoid.x - x) < 4 && Math.abs(factoid.y - y) < 4) {
        closeFactoid();
        return;
      }

      const href = target.getAttribute("href") || "";
      const linkText = target.textContent?.trim() || domainLabel(href);

      const title = target.dataset.title || linkText;
      const summary = target.dataset.summary
        || `Primary source: ${domainLabel(href)}\n\nThe full citation record for this reference is available at:\n${href}`;

      setCopied(false);
      setFactoid({ title, summary, href, x, y });
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [factoid, closeFactoid]);

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
