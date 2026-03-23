import { useState } from "react";
import { ClownCheckModal } from "@/components/ClownCheckModal";

export function ClownCheckCTA() {
  const [verifyOpen, setVerifyOpen] = useState(false);

  return (
    <>
      <div
        className="my-10 border border-[#F5C518] rounded-xl bg-[#FEFCE8] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
        aria-label="Verification Services"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B] mb-1">
            Primary Source Analytics
          </p>
          <p className="text-sm font-bold text-[#1A3A8F] leading-snug">
            Every claim in this record can be independently verified. Two ways to do it.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={() => setVerifyOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A3A8F] text-white font-bold text-sm hover:bg-[#162f74] transition-colors"
          >
            ClownCheck
            <span className="text-[11px] font-semibold opacity-75">$4.95</span>
          </button>
          <a
            href="/reports"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F5C518] text-[#1A3A8F] font-bold text-sm hover:bg-[#e0b315] transition-colors"
          >
            Full Report
            <span className="text-[11px] font-semibold opacity-75">$24.95</span>
          </a>
        </div>
      </div>

      {verifyOpen && (
        <ClownCheckModal open={verifyOpen} onClose={() => setVerifyOpen(false)} postId={postId} />
      )}
    </>
  );
}
