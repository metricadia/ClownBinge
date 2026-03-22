import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useSubscribe } from "@workspace/api-client-react";

export function NewsletterSignup({ source = "inline" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  
  const subscribeMutation = useSubscribe({
    mutation: {
      onSuccess: () => {
        setStatus("success");
        setMessage("You're in. Watch your inbox for the receipts.");
        setEmail("");
      },
      onError: (err) => {
        setStatus("error");
        setMessage(err.error || "Something went wrong. Try again.");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("idle");
    subscribeMutation.mutate({ data: { email, source } });
  };

  return (
    <div className="bg-header rounded-2xl p-6 sm:p-10 relative overflow-hidden text-center sm:text-left">
      {/* Decorative background elements */}
      <div className="absolute -right-24 -top-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3">
            Get The Record Delivered.
          </h3>
          <p className="text-white/80 text-sm sm:text-base">
            Join the ClownBinge newsletter for the most documented self-owns and political hypocrisy, straight to your inbox. No spam. Just facts.
          </p>
        </div>
        
        <div className="w-full sm:w-auto sm:min-w-[320px]">
          {status === "success" ? (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-10 h-10 text-secondary mb-3" />
              <p className="font-bold text-white">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border-2 border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/20 focus:outline-none text-foreground font-medium transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="w-full bg-secondary text-dark-text font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:transform-none transition-all uppercase tracking-wide"
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </button>
              
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-1 justify-center sm:justify-start">
                  <AlertCircle className="w-4 h-4" />
                  <span>{message}</span>
                </div>
              )}
              
              <p className="text-xs text-white/50 text-center mt-2">
                By subscribing, you agree to our Terms & Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
