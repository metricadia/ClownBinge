import { createPortal } from "react-dom";
import { Copy, Check, X, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { FactoidState } from "@/hooks/use-factoid-popup";
import { PsaLogo } from "@/components/PsaLogo";

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
  if (factoid.isLoading && !factoid.summary) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-gray-400 italic py-1">
        <Loader2 size={13} className="animate-spin shrink-0" strokeWidth={2} />
        <span>Loading context…</span>
      </div>
    );
  }

  const rawParas = typeof factoid.summary === "string"
    ? factoid.summary.includes("||")
      ? factoid.summary.split("||").map(s => s.trim()).filter(Boolean)
      : factoid.summary.split(/\n\n+/).map(s => s.trim()).filter(Boolean)
    : null;

  const body = (rawParas && rawParas.length > 0)
    ? <>{rawParas.map((p, i) => <p key={i} style={{ marginBottom: i < rawParas.length - 1 ? "0.85em" : 0 }}>{p}</p>)}</>
    : <>{factoid.summary}</>;

  if (factoid.isLoading) {
    return (
      <>
        {body}
        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 italic">
          <Loader2 size={10} className="animate-spin shrink-0" strokeWidth={2} />
          <span>Expanding…</span>
        </div>
      </>
    );
  }

  return body;
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

function PopupHeader({ sizeIdx, onSizeChange, onClose }: {
  sizeIdx: SizeIdx;
  onSizeChange: (i: SizeIdx) => void;
  onClose: () => void;
}) {
  return (
    <div className="cb-factoid-popup-topbar">
      <div className="cb-factoid-popup-label">
        <span className="cb-factoid-popup-brand">Deep Dive Factoid</span>
        <span className="cb-factoid-popup-sublabel">by Metricadia Research LLC</span>
      </div>
      <div className="cb-factoid-popup-actions">
        <FontSizer sizeIdx={sizeIdx} onChange={onSizeChange} />
        <button className="cb-factoid-popup-close" onClick={onClose} aria-label="Close">
          <X size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export function FactoidPopup({ factoid, popupRef, copied, isMobile, onClose, onCopy, extraFooter }: FactoidPopupProps) {
  const domain = factoid.href ? sourceDomain(factoid.href) : "";
  const [sizeIdx, setSizeIdx] = useState<SizeIdx>(2);
  const fontSize = `${FONT_SIZES[sizeIdx]}px`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const footer = (
    <>
      <div className="cb-factoid-footer-left">
        <button
          onClick={onCopy}
          disabled={factoid.isLoading}
          className="cb-factoid-popup-copy-btn self-start disabled:opacity-40"
        >
          {copied
            ? <><Check size={12} strokeWidth={3} /> Copied</>
            : <><Copy size={12} strokeWidth={2} /> Copy Citation</>
          }
        </button>
        {extraFooter}
      </div>
      <PsaLogo variant="dark" className="cb-factoid-footer-logo" />
    </>
  );

  if (isMobile) {
    return createPortal(
      <>
        <div className="cb-factoid-sheet-overlay" onClick={onClose} aria-hidden="true" />
        <div
          ref={popupRef}
          className="cb-factoid-sheet"
          role="dialog"
          aria-label="Deep Dive Factoid"
          style={{ "--factoid-font-size": fontSize } as React.CSSProperties}
        >
          <div className="cb-factoid-sheet-handle" aria-hidden="true" />

          <div className="cb-factoid-popup-header cb-factoid-sheet-header">
            <PopupHeader sizeIdx={sizeIdx} onSizeChange={setSizeIdx} onClose={onClose} />
          </div>

          <div className="cb-factoid-sheet-scrollable">
            <div className="cb-factoid-popup-title cb-factoid-sheet-title">{factoid.title}</div>
            <div className="cb-factoid-popup-summary cb-factoid-sheet-summary">
              <SummaryBody factoid={factoid} />
            </div>
            {domain && (
              <div className="cb-factoid-popup-source">
                <ExternalLink size={10} strokeWidth={2} />
                <span>via {domain}</span>
              </div>
            )}
          </div>

          <div className="cb-factoid-popup-footer cb-factoid-sheet-footer">
            {footer}
          </div>
        </div>
      </>,
      document.body
    );
  }

  return createPortal(
    <>
      <div className="cb-factoid-sheet-overlay" onClick={onClose} aria-hidden="true" />
      <div
        ref={popupRef}
        className="cb-factoid-popup"
        style={{ "--factoid-font-size": fontSize } as React.CSSProperties}
        role="dialog"
        aria-label="Deep Dive Factoid"
      >
        <div className="cb-factoid-popup-header">
          <PopupHeader sizeIdx={sizeIdx} onSizeChange={setSizeIdx} onClose={onClose} />
        </div>

        <div className="cb-factoid-popup-scrollable">
          <div className="cb-factoid-popup-title">{factoid.title}</div>
          <div className="cb-factoid-popup-summary">
            <SummaryBody factoid={factoid} />
          </div>
          {domain && (
            <div className="cb-factoid-popup-source">
              <ExternalLink size={10} strokeWidth={2} />
              <span>via {domain}</span>
            </div>
          )}
        </div>

        <div className="cb-factoid-popup-footer">
          {footer}
        </div>
      </div>
    </>,
    document.body
  );
}
