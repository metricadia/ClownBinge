import { useState } from "react";
import { Info, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function VerifiedBadge({ source, date }: { source?: string | null, date?: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="verified-badge"
        aria-label="View verification details"
      >
        VERIFIED
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 text-verified mb-2">
              <Info className="h-5 w-5" />
              <DialogTitle className="font-display font-bold text-xl uppercase tracking-wider text-verified">
                Verification Protocol
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-foreground font-sans pt-2">
              Every factual claim on ClownBinge traces to a verified public source. We do not use unverified sources, we do not fabricate claims, and we do not target private individuals.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-lg mt-4 border border-border">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="col-span-1 text-muted-foreground font-semibold">Primary Source:</div>
              <div className="col-span-2 font-mono font-medium text-foreground">{source || "Public Record"}</div>
              
              {date && (
                <>
                  <div className="col-span-1 text-muted-foreground font-semibold">Incident Date:</div>
                  <div className="col-span-2 font-mono font-medium text-foreground">{date}</div>
                </>
              )}
              
              <div className="col-span-1 text-muted-foreground font-semibold">Legal Shield:</div>
              <div className="col-span-2 font-mono font-medium text-foreground">First Amendment / NYT v. Sullivan (1964)</div>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              onClick={() => setOpen(false)}
              className="w-full bg-header text-white font-bold py-3 rounded-lg hover:bg-header/90 transition-colors"
            >
              Back to the Receipts
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
