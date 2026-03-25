import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

export function ClownCheckCTA() {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-[#F5C518]/60">
      {/* Collapsed bar -- always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-[#FEFCE8] hover:bg-[#fef9d0] transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">
            Donate Today &mdash; Keep Independent Research Alive
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#B8860B] shrink-0" />
          : <ChevronDown className="w-4 h-4 text-[#B8860B] shrink-0" />
        }
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          className="px-6 py-5 flex flex-col gap-4"
          style={{ background: "#1A3A8F" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">Donate</p>
              <p className="text-xl font-black text-white leading-tight">Any Amount</p>
            </div>
            <Heart className="w-5 h-5 text-[#F5C518] shrink-0 mt-0.5" />
          </div>

          <p className="text-sm text-white/75 leading-relaxed">
            No product. No deliverable. Just you deciding that verified, independent journalism is worth keeping alive.
          </p>

          <ul className="flex flex-col gap-1.5">
            {["Funds original research", "Supports editorial independence", "Keeps the site free"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-[#F5C518] font-bold text-xs">&#10003;</span>
                <span className="text-sm text-white/80">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/invest-in-us"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-base text-[#1A3A8F] hover:opacity-90 transition-opacity"
            style={{ background: "#F5C518" }}
          >
            I Want to Help
            <Heart className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
