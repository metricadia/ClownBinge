import { CheckCircle } from "lucide-react";

export function CbExclusiveBadge() {
  return (
    <span title="Official Publication of ClownBinge: Certified" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-600 text-white cursor-help">
      <CheckCircle className="w-3.5 h-3.5 text-yellow-300 shrink-0" strokeWidth={3} />
      CB Exclusive
    </span>
  );
}
