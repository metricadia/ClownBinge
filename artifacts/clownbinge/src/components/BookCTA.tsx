import { BookOpen } from "lucide-react";
import { Link } from "wouter";

export function BookCTA({ variant = "banner" }: { variant?: "banner" | "inline" }) {
  if (variant === "inline") {
    return (
      <div className="bg-header p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 my-10">
        <div className="flex-1 text-center sm:text-left">
          <h4 className="font-display font-extrabold text-xl text-white mb-2">
            The receipts don't lie.
          </h4>
          <p className="text-white/80">
            This is one of 200 documented cases in our flagship book, exploring the gap between public rhetoric and actual records.
          </p>
        </div>
        <Link 
          href="/store" 
          className="shrink-0 bg-secondary text-dark-text font-bold uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all inline-flex items-center gap-2"
        >
          <BookOpen className="w-5 h-5" />
          Get "Illegal, Who?" — $21.95
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 p-4 sm:p-6 pointer-events-none">
      <div className="cb-container mx-auto max-w-4xl relative">
        <div className="bg-white border-2 border-border shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto backdrop-blur-md bg-white/95">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl hidden sm:block">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm sm:text-base">
                Get the full receipts.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                The complete archive in print. "Illegal, Who?"
              </p>
            </div>
          </div>
          <Link 
            href="/store"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors whitespace-nowrap text-center shadow-md shadow-primary/20"
          >
            BUY NOW - $21.95
          </Link>
        </div>
      </div>
    </div>
  );
}
