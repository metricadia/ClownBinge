import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function UserSubmittedBadge() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="user-submitted-badge"
        aria-label="View user submission details"
      >
        <CheckCircle2 className="w-3 h-3 shrink-0" strokeWidth={2.5} />
        <span>User Submitted</span>
        <span className="opacity-60 font-normal mx-0.5">|</span>
        <span>Verified</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <CheckCircle2 className="h-5 w-5" />
              <DialogTitle className="font-display font-bold text-xl uppercase tracking-wider text-green-700">
                Community Tip — Independently Verified
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-foreground font-sans pt-2">
              This case originated from a tip submitted by a ClownBinge reader. Before publication, our team independently verified every factual claim against government records, court filings, and peer-reviewed sources. Reader tips accelerate our work — they do not replace it.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="col-span-1 text-muted-foreground font-semibold">Source:</div>
              <div className="col-span-2 font-mono font-medium text-foreground">Reader Submission</div>

              <div className="col-span-1 text-muted-foreground font-semibold">Verification:</div>
              <div className="col-span-2 font-mono font-medium text-green-700">Independently Confirmed</div>

              <div className="col-span-1 text-muted-foreground font-semibold">Legal Shield:</div>
              <div className="col-span-2 font-mono font-medium text-foreground">First Amendment / NYT v. Sullivan (1964)</div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Want to submit a tip? Use the Submit A Clown form. All submissions are reviewed. We verify aggressively before we publish anything.
          </p>

          <div className="mt-4">
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors"
            >
              Back to the Receipts
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
