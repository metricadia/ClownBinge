import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TAXONOMY: Record<number, { label: string; description: string }> = {
  1:  { label: "Loose Change",         description: "A minor inconsistency. Could be a misstatement, a forgotten vote, or a position that drifted over years. Barely receipt-worthy, but documented." },
  2:  { label: "Paper Trail",          description: "A documented contradiction with some plausible deniability. The receipts exist, but the subject could argue changed circumstances." },
  3:  { label: "Public Record",        description: "A clear contradiction between stated position and documented action. Excuses are available but increasingly thin." },
  4:  { label: "The Pivot",            description: "A verifiable flip that directly affected constituents or followers. The gap between word and deed is no longer deniable." },
  5:  { label: "Caught on File",       description: "Documented betrayal of a stated core belief. Primary sources are unambiguous. The subject's own records are working against them." },
  6:  { label: "Structural Hypocrisy", description: "Multiple documented reversals forming a pattern. Not a mistake. A method. The contradiction is the strategy." },
  7:  { label: "The Quiet Part Loud",  description: "Documented evidence that the public position was performance. A recording, a filing, or a primary source reveals what they actually believe." },
  8:  { label: "Spectacular Own Goal", description: "The contradiction directly undermines the subject's defining public identity. Their receipts are their brand, and their brand is the lie." },
  9:  { label: "Career-Defining",      description: "So complete, so well-documented, and so public that it permanently alters how the subject is understood. This is a legacy receipt." },
  10: { label: "Historic",             description: "A contradiction so total, so irrefutable, and so catastrophic that it stands as a documented monument to public hypocrisy. The receipts will outlive the career." },
};

export function SelfOwnScoreBadge({ score }: { score: number }) {
  const [open, setOpen] = useState(false);
  const entry = TAXONOMY[score];

  return (
    <>
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider whitespace-nowrap select-none"
        style={{ background: "#1A3A8F", color: "#fff" }}
      >
        {score}/10
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
          className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-black leading-none hover:opacity-80 transition-opacity"
          style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
          aria-label="What does this score mean?"
        >
          ?
        </button>
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl uppercase tracking-wider text-[#1A3A8F]">
              Self-Own Score Scale
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mt-1 mb-4">
            ClownBinge rates each self-own from 1 to 10. A score of 1 is a minor documented inconsistency. A score of 10 is a historic, career-defining act of public hypocrisy with irrefutable receipts.
          </p>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {Object.entries(TAXONOMY).map(([n, { label, description }]) => {
              const num = Number(n);
              const isThis = num === score;
              return (
                <div
                  key={n}
                  className={`flex gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isThis ? "bg-[#1A3A8F] text-white" : "bg-muted/40 text-foreground"}`}
                >
                  <span className={`font-black text-base w-6 shrink-0 text-center leading-snug ${isThis ? "text-[#F5C518]" : "text-[#1A3A8F]"}`}>
                    {n}
                  </span>
                  <div>
                    <div className={`font-bold uppercase tracking-wide text-[11px] mb-0.5 ${isThis ? "text-[#F5C518]" : "text-[#1A3A8F]"}`}>{label}</div>
                    <div className={`leading-snug text-[12px] ${isThis ? "text-white/90" : "text-muted-foreground"}`}>{description}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-[#1A3A8F] text-white font-bold py-3 rounded-lg hover:bg-[#1A3A8F]/90 transition-colors text-sm uppercase tracking-wider"
            >
              Back to The Record
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
