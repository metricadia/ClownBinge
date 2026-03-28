import { createPortal } from "react-dom";
import { Copy, Check, X } from "lucide-react";
import type { FactoidState } from "@/hooks/use-factoid-popup";

interface FactoidPopupProps {
  factoid: FactoidState;
  popupRef: React.RefObject<HTMLDivElement>;
  copied: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function FactoidPopup({ factoid, popupRef, copied, onClose, onCopy }: FactoidPopupProps) {
  return createPortal(
    <div
      ref={popupRef}
      className="cb-factoid-popup"
      style={{ left: factoid.x, top: factoid.y }}
      role="dialog"
      aria-label="ClownBinge Factoid"
    >
      <button className="cb-factoid-popup-close" onClick={onClose} aria-label="Close">
        <X size={11} strokeWidth={2.5} />
      </button>

      <div className="cb-factoid-popup-header">
        <div className="cb-factoid-popup-label">ClownBinge Factoid</div>
      </div>

      <div className="cb-factoid-popup-scrollable">
        <div className="cb-factoid-popup-title">{factoid.title}</div>
        <div className="cb-factoid-popup-summary">{factoid.summary}</div>
      </div>

      <div className="cb-factoid-popup-footer">
        <button onClick={onCopy} className="cb-factoid-popup-copy-btn self-start">
          {copied
            ? <><Check size={12} strokeWidth={3} /> Copied!</>
            : <><Copy size={12} strokeWidth={2} /> Copy Factoid</>
          }
        </button>
      </div>
    </div>,
    document.body
  );
}
