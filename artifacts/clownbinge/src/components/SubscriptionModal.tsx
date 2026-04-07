import { useState } from "react";
import { X, Lock, Star } from "lucide-react";
import { useActivateSubscription } from "@/hooks/use-subscription";
import { Link } from "wouter";

interface SubscriptionModalProps {
  onClose: () => void;
  trigger?: "metricadiaid" | "factoid";
}

export function SubscriptionModal({ onClose, trigger }: SubscriptionModalProps) {
  const [tokenInput, setTokenInput] = useState("");
  const [view, setView] = useState<"gate" | "activate" | "success">("gate");
  const [successLabel, setSuccessLabel] = useState("");
  const activate = useActivateSubscription();

  const featureLabel =
    trigger === "metricadiaid"
      ? "Metricadia ID profiles"
      : trigger === "factoid"
        ? "CB Factoid citations"
        : "premium features";

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await activate.mutateAsync(tokenInput.trim());
      setSuccessLabel(result.label);
      setView("success");
    } catch (err: any) {
      // error displayed via activate.error
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(10,15,40,0.82)", backdropFilter: "blur(4px)" }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, #1B3E99, #F5C518)" }} />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {view === "gate" && (
          <div className="p-8 pt-9 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#EEF2FF" }}>
              <Lock className="w-7 h-7" style={{ color: "#1B3E99" }} />
            </div>
            <h2 className="font-sans font-bold text-xl text-gray-900 mb-2">Supporting Members Only</h2>
            <p className="text-gray-600 text-sm mb-1">
              <strong>{featureLabel.charAt(0).toUpperCase() + featureLabel.slice(1)}</strong> are available to Supporting Members.
            </p>
            <p className="text-gray-500 text-xs mb-6 leading-relaxed">
              All article text stays free and publicly accessible. Membership unlocks interactive research tools: Metricadia ID profiles and sourced CB Factoid popups.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-600 fill-amber-500 flex-shrink-0" />
                <span className="font-bold text-sm text-amber-900">Supporting Member — $9/mo</span>
              </div>
              <ul className="text-xs text-amber-800 space-y-1 pl-1">
                <li>Metricadia ID profiles on every person named in our reporting</li>
                <li>CB Factoid citation popups with full source detail</li>
                <li>Direct support for independent accountability journalism</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/subscribe"
                onClick={onClose}
                className="block w-full py-2.5 rounded-lg font-bold text-sm text-center transition-colors"
                style={{ background: "#1B3E99", color: "#fff" }}
              >
                Become a Supporting Member
              </Link>
              <button
                onClick={() => setView("activate")}
                className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2"
              >
                Already a member? Enter your access token
              </button>
            </div>
          </div>
        )}

        {view === "activate" && (
          <div className="p-8 pt-9">
            <button onClick={() => setView("gate")} className="text-xs text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">
              &#8592; Back
            </button>
            <h2 className="font-sans font-bold text-lg text-gray-900 mb-1">Enter Your Access Token</h2>
            <p className="text-gray-500 text-sm mb-5">Paste the access token from your welcome email below.</p>

            <form onSubmit={handleActivate} className="space-y-3">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste token here..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: "#1B3E99" } as any}
                autoFocus
              />
              {activate.error && (
                <p className="text-red-600 text-xs">{(activate.error as Error).message}</p>
              )}
              <button
                type="submit"
                disabled={!tokenInput.trim() || activate.isPending}
                className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                style={{ background: "#1B3E99", color: "#fff" }}
              >
                {activate.isPending ? "Activating..." : "Activate Access"}
              </button>
            </form>
          </div>
        )}

        {view === "success" && (
          <div className="p-8 pt-9 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F0FDF4" }}>
              <Star className="w-7 h-7 text-green-600 fill-green-500" />
            </div>
            <h2 className="font-sans font-bold text-xl text-gray-900 mb-2">Welcome, Supporting Member!</h2>
            {successLabel && <p className="text-gray-600 text-sm mb-4">Access granted for: <strong>{successLabel}</strong></p>}
            <p className="text-gray-500 text-sm mb-6">Your subscription is now active. Interactive research tools are unlocked across all articles.</p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors"
              style={{ background: "#1B3E99", color: "#fff" }}
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
