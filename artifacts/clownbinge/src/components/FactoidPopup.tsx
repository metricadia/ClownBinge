import { createPortal } from "react-dom";
import { Copy, Check, X, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { FactoidState } from "@/hooks/use-factoid-popup";

interface FactoidPopupProps {
  factoid: FactoidState;
  popupRef: React.RefObject<HTMLDivElement>;
  copied: boolean;
  isMobile: boolean;
  onClose: () => void;
  onCopy: () => void;
  extraFooter?: React.ReactNode;
}

const FONT_SIZES = [11, 13, 15] as const;
type SizeIdx = 0 | 1 | 2;

function sourceDomain(href: string): string {
  try { return new URL(href).hostname.replace(/^www\./, ""); } catch { return ""; }
}

function SummaryBody({ factoid }: { factoid: FactoidState }) {
  if (factoid.isLoading) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-gray-400 italic py-1">
        <Loader2 size={13} className="animate-spin shrink-0" strokeWidth={2} />
        <span>Analyzing source in context…</span>
      </div>
    );
  }
  const paras = typeof factoid.summary === "string"
    ? factoid.summary.split("||").map(s => s.trim()).filter(Boolean)
    : null;
  if (paras && paras.length > 1) {
    return <>{paras.map((p, i) => <p key={i} style={{ marginBottom: i < paras.length - 1 ? "0.7em" : 0 }}>{p}</p>)}</>;
  }
  return <>{factoid.summary}</>;
}

function FontSizer({ sizeIdx, onChange }: { sizeIdx: SizeIdx; onChange: (i: SizeIdx) => void }) {
  return (
    <div className="cb-factoid-sizer" aria-label="Text size">
      <button
        className={`cb-factoid-sizer-btn${sizeIdx === 0 ? " active" : ""}`}
        style={{ fontSize: "10px" }}
        onClick={() => onChange(0)}
        aria-label="Small text"
        title="Small"
      >a</button>
      <button
        className={`cb-factoid-sizer-btn${sizeIdx === 1 ? " active" : ""}`}
        style={{ fontSize: "13px" }}
        onClick={() => onChange(1)}
        aria-label="Medium text"
        title="Medium"
      >A</button>
      <button
        className={`cb-factoid-sizer-btn${sizeIdx === 2 ? " active" : ""}`}
        style={{ fontSize: "16px" }}
        onClick={() => onChange(2)}
        aria-label="Large text"
        title="Large"
      >A</button>
    </div>
  );
}

export function FactoidPopup({ factoid, popupRef, copied, isMobile, onClose, onCopy, extraFooter }: FactoidPopupProps) {
  const domain = factoid.href ? sourceDomain(factoid.href) : "";
  const [sizeIdx, setSizeIdx] = useState<SizeIdx>(1);
  const fontSize = `${FONT_SIZES[sizeIdx]}px`;

  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile]);

  if (isMobile) {
    return createPortal(
      <>
        <div className="cb-factoid-sheet-overlay" onClick={onClose} aria-hidden="true" />
        <div
          ref={popupRef}
          className="cb-factoid-sheet"
          role="dialog"
          aria-label="ClownBinge Factoid"
          style={{ "--factoid-font-size": fontSize } as React.CSSProperties}
        >
          <div className="cb-factoid-sheet-handle" aria-hidden="true" />

          <div className="cb-factoid-popup-header cb-factoid-sheet-header" style={{ position: "relative" }}>
            <div className="cb-factoid-popup-label">Primary Source Reference</div>
            <FontSizer sizeIdx={sizeIdx} onChange={setSizeIdx} />
            <button className="cb-factoid-popup-close" onClick={onClose} aria-label="Close" style={{ top: 6, right: 6 }}>
              <X size={11} strokeWidth={2.5} />
            </button>
          </div>

          <div className="cb-factoid-sheet-scrollable">
            <div className="cb-factoid-popup-title cb-factoid-sheet-title">{factoid.title}</div>
            <div className="cb-factoid-popup-summary cb-factoid-sheet-summary">
              <SummaryBody factoid={factoid} />
            </div>
            {domain && (
              <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono text-gray-400">
                <ExternalLink size={10} strokeWidth={2} />
                <span>{domain}</span>
              </div>
            )}
          </div>

          <div className="cb-factoid-popup-footer cb-factoid-sheet-footer">
            <button
              onClick={onCopy}
              disabled={factoid.isLoading}
              className="cb-factoid-popup-copy-btn self-start disabled:opacity-40"
            >
              {copied
                ? <><Check size={14} strokeWidth={3} /> Copied!</>
                : <><Copy size={14} strokeWidth={2} /> Copy Citation</>
              }
            </button>
            {extraFooter}
          </div>
        </div>
      </>,
      document.body
    );
  }

  return createPortal(
    <div
      ref={popupRef}
      className="cb-factoid-popup"
      style={{ left: factoid.x, top: factoid.y, "--factoid-font-size": fontSize } as React.CSSProperties}
      role="dialog"
      aria-label="ClownBinge Factoid"
    >
      <FontSizer sizeIdx={sizeIdx} onChange={setSizeIdx} />
      <button className="cb-factoid-popup-close" onClick={onClose} aria-label="Close">
        <X size={11} strokeWidth={2.5} />
      </button>

      <div className="cb-factoid-popup-header">
        <div className="cb-factoid-popup-label">Primary Source Reference</div>
      </div>

      <div className="cb-factoid-popup-scrollable">
        <div className="cb-factoid-popup-title">{factoid.title}</div>
        <div className="cb-factoid-popup-summary">
          <SummaryBody factoid={factoid} />
        </div>
        {domain && (
          <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-gray-400">
            <ExternalLink size={9} strokeWidth={2} />
            <span>{domain}</span>
          </div>
        )}
      </div>

      <div className="cb-factoid-popup-footer">
        <button
          onClick={onCopy}
          disabled={factoid.isLoading}
          className="cb-factoid-popup-copy-btn self-start disabled:opacity-40"
        >
          {copied
            ? <><Check size={12} strokeWidth={3} /> Copied!</>
            : <><Copy size={12} strokeWidth={2} /> Copy Citation</>
          }
        </button>
        {extraFooter}
      </div>
    </div>,
    document.body
  );
}
