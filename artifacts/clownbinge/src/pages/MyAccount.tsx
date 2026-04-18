import { useLocation } from "wouter";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { LogOut, User, Mail, Calendar, ShieldCheck } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";

export default function MyAccount() {
  const { isLoaded, isSignedIn, user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const { isAdmin } = useAdmin();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation("/sign-in");
    }
  }, [isLoaded, isSignedIn, setLocation]);

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user.name || user.email || "Member";
  const email = user.email;
  const verified = user.emailVerified ? (
    <span className="text-xs text-emerald-600 font-semibold">Verified</span>
  ) : (
    <span className="text-xs text-amber-600 font-semibold">Not verified</span>
  );

  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
  };

  return (
    <Layout>
      <div className="cb-container py-16 max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
            ClownBinge Newsroom
          </p>
          <h1 className="text-3xl font-black text-foreground">My Account</h1>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
          <div className="h-3 w-full" style={{ background: "linear-gradient(90deg, #1B3E99, #F5C518)" }} />
          <div className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-9 h-9 text-primary/40" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-foreground truncate">{displayName}</h2>
                {email && (
                  <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate">{email}</span>
                    <span className="ml-1">{verified}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="text-sm">ClownBinge Member</span>
                </div>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin panel link */}
        {isAdmin && (
          <div className="bg-[#1A3A8F] rounded-2xl border border-[#1A3A8F]/20 shadow-sm p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#F5C518]" />
              <div>
                <p className="font-black text-white text-sm">Admin Access Active</p>
                <p className="text-white/60 text-xs">You have editorial access to the Kemet8 system</p>
              </div>
            </div>
            <a
              href={`${basePath}/Kemet8`}
              className="px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-wider bg-[#F5C518] text-[#1A1A2E] hover:bg-[#e0b400] transition-colors shrink-0"
            >
              Open Editor
            </a>
          </div>
        )}

        {/* Subscription placeholder */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-6">
          <h3 className="font-black text-foreground mb-1">Subscription</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Access premium articles and in-depth investigative reports.
          </p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
              Free Access
            </span>
            <a
              href={`${basePath}/invest-in-us`}
              className="px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-wider bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Upgrade
            </a>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </Layout>
  );
}
