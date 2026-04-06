import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface MetricadiaIDPopupProps {
  open: boolean;
  onClose: () => void;
  name: string;
  imageUrl: string;
  description?: string;
  attribution?: string;
}

function deriveAttribution(imageUrl: string, explicit?: string): string | undefined {
  if (explicit) return explicit;
  if (!imageUrl) return undefined;
  if (/upload\.wikimedia\.org|wikipedia\.org\/wiki\/File:/i.test(imageUrl)) {
    return "Photo via Wikimedia Commons";
  }
  return undefined;
}

export function MetricadiaIDPopup({ open, onClose, name, imageUrl, description, attribution }: MetricadiaIDPopupProps) {
  const credit = deriveAttribution(imageUrl, attribution);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 overflow-hidden max-w-sm border-0 bg-transparent shadow-2xl"
        data-testid="dialog-metricadiaid-popup"
      >
        <VisuallyHidden>
          <DialogTitle>Metricadia ID: {name}</DialogTitle>
          <DialogDescription>
            {description || `Profile information for ${name}`}
          </DialogDescription>
        </VisuallyHidden>
        {/* Gold gradient border wrapper */}
        <div className="relative bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 rounded-2xl" style={{
          border: '3px solid transparent',
          backgroundImage: 'linear-gradient(135deg, #292524 0%, #1c1917 50%, #292524 100%), linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)',
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-stone-900/80 hover:bg-stone-800 flex items-center justify-center transition-colors border border-amber-900/30"
            data-testid="button-close-metricadiaid"
          >
            <X className="w-4 h-4 text-amber-500" />
          </button>

          {/* Metricadia ID™ Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 shadow-lg">
            <Sparkles className="w-3 h-3 text-stone-950" />
            <span className="text-xs font-bold text-stone-950 tracking-wide">
              Metricadia ID™
            </span>
          </div>

          {/* Person Image or Initial Avatar */}
          <div className="relative w-full h-64 bg-stone-950 overflow-hidden rounded-t-2xl flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center shadow-lg border-2 border-amber-500/40">
                  <span className="text-4xl font-bold text-amber-100 select-none">
                    {name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                  </span>
                </div>
                <span className="text-xs text-stone-500 tracking-widest uppercase">Historical Figure</span>
              </div>
            )}
            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-950 to-transparent" />
            {/* Attribution — auto-derived for Wikimedia, explicit for uploads */}
            {imageUrl && credit && (
              <div className="absolute bottom-1 left-0 right-0 flex justify-center z-10">
                <span className="text-[9px] text-stone-500 px-2 leading-tight text-center">
                  {credit}
                </span>
              </div>
            )}
          </div>

          {/* Person Info */}
          <div className="p-6 space-y-3">
            {/* "Identified" label */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/50 to-transparent" />
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                Identified
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/50 to-transparent" />
            </div>

            {/* Name */}
            <h3 className="text-xl md:text-2xl font-bold text-white text-center leading-tight">
              {name}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-sm text-stone-300 text-center leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
                {description}
              </p>
            )}

            {/* Decorative separator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
