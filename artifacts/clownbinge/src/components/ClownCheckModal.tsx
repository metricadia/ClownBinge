interface ClownCheckModalProps {
  onClose: () => void;
}

export function ClownCheckModal({ onClose }: ClownCheckModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-xl font-bold leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="mb-1 text-xs font-mono font-bold uppercase tracking-widest" style={{ color: "#1A3A8F" }}>ClownCheck</div>
        <h2 className="font-display font-extrabold text-2xl text-header mb-3 leading-tight">
          Fake News Is Everywhere.
        </h2>
        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
          State-sponsored disinformation, domestic propaganda, and algorithmically-amplified lies have made it nearly impossible to know what is real.
        </p>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          For less than $2, ClownCheck cross-references any claim against government records, congressional archives, court filings, and peer-reviewed sources and delivers one clear verdict.
        </p>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <div className="font-bold text-green-700 text-sm">Verified</div>
            <div className="text-xs text-green-600 mt-0.5">Confirmed true</div>
          </div>
          <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <div className="font-bold text-red-700 text-sm">Fake News</div>
            <div className="text-xs text-red-600 mt-0.5">Demonstrably false</div>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <div className="font-bold text-gray-600 text-sm">Cannot Verify</div>
            <div className="text-xs text-gray-500 mt-0.5">Insufficient record</div>
          </div>
        </div>

        <a
          href="/clowncheck"
          className="block w-full text-center font-bold text-white py-3.5 rounded-xl transition-colors"
          style={{ backgroundColor: "#1A3A8F" }}
        >
          Verify a Claim &mdash; $1.95
        </a>
        <p className="text-center text-xs text-muted-foreground mt-3">Results delivered within 24 hours. No subscription required.</p>
      </div>
    </div>
  );
}
