import { GraduationCap } from "lucide-react";
import { Link } from "wouter";

export function ClownCheckCTA() {
  return (
    <div
      className="my-10 border border-[#F5C518] rounded-xl bg-[#FEFCE8] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5"
      aria-label="Support ClownBinge"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B] mb-1.5">
          Grad Student Project &mdash; Sick of Fake News
        </p>
        <p className="text-sm font-bold text-[#1A3A8F] leading-snug">
          Every donation directly funds PhD researchers documenting the primary source record.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <GraduationCap className="w-8 h-8 text-[#1A3A8F] opacity-25 hidden sm:block" />
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/invest-in-us"
            className="inline-flex flex-col items-center justify-center px-4 py-2.5 rounded-lg bg-[#1A3A8F] text-white font-bold text-sm hover:bg-[#162f74] transition-colors leading-tight text-center"
          >
            <span>Support Our Work</span>
            <span className="text-[10px] font-normal opacity-60 mt-0.5">Fund a Student Analyst</span>
          </Link>
          <Link
            href="/invest-in-us"
            className="inline-flex flex-col items-center justify-center px-4 py-2.5 rounded-lg bg-[#F5C518] text-[#1A3A8F] font-black text-sm hover:bg-[#e0b315] transition-colors leading-tight text-center"
          >
            <span>DONATE NOW</span>
            <span className="text-[10px] font-normal opacity-60 mt-0.5">All proceeds to researchers</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
