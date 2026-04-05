import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PettyIDPopupProps {
  open: boolean;
  onClose: () => void;
  name: string;
  imageUrl: string;
  description?: string;
}

export function PettyIDPopup({ open, onClose, name, imageUrl, description }: PettyIDPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 overflow-hidden max-w-sm border-0 bg-transparent shadow-2xl"
        data-testid="dialog-pettyid-popup"
      >
        <VisuallyHidden>
          <DialogTitle>PettyID: {name}</DialogTitle>
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
            data-testid="button-close-pettyid"
          >
            <X className="w-4 h-4 text-amber-500" />
          </button>

          {/* PettyID™ Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 shadow-lg">
            <Sparkles className="w-3 h-3 text-stone-950" />
            <span className="text-xs font-bold text-stone-950 tracking-wide">
              PettyID™
            </span>
          </div>

          {/* Person Image */}
          <div className="relative w-full h-64 bg-stone-950 overflow-hidden rounded-t-2xl">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23292524' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23f59e0b' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-950 to-transparent" />
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
