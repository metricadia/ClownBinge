import { useEffect, useState } from "react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export interface TocItem {
  id: string;
  text: string;
}

export function useArticleToc(
  containerRef: React.RefObject<HTMLElement | null>,
  articleId: string | number | undefined,
  gated: boolean
): TocItem[] {
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    if (gated) {
      setHeadings([]);
      return;
    }

    const scan = () => {
      const el = containerRef.current;
      if (!el) return;

      const h2s = Array.from(el.querySelectorAll("h2"));
      const items: TocItem[] = [];

      h2s.forEach((h2, i) => {
        const text = h2.textContent?.trim() ?? "";
        if (!text) return;
        const base = slugify(text) || `section-${i + 1}`;
        if (!h2.id) h2.id = base;
        items.push({ id: h2.id, text });
      });

      setHeadings(items);
    };

    const timer = setTimeout(scan, 0);
    return () => clearTimeout(timer);
  }, [articleId, gated]); // eslint-disable-line react-hooks/exhaustive-deps

  return headings;
}
