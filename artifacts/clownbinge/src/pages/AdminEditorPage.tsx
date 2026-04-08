import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useUser, useClerk } from "@clerk/react";
import { AdminLogin } from "@/components/AdminLogin";
import { MetricadiaEditor } from "@/components/MetricadiaEditor";
import { Button } from "@/components/ui/button";
import {
  PenLine, LogOut, Plus, X, Loader2, Star, Trash2, Copy, Check,
  LayoutDashboard, FileText, Users, Key, BarChart2, DollarSign,
  LifeBuoy, Mail, Eye, ChevronRight, ShieldOff, ExternalLink,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  caseNumber?: string;
  publishedAt?: string;
  premiumOnly?: boolean;
}

interface SubscriberToken {
  token: string;
  label: string;
  email: string | null;
  active: boolean;
  createdAt: string;
  expiresAt: string | null;
}

interface Member {
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastLoginAt: string;
}

type Section = "dashboard" | "articles" | "members" | "subscribers" | "traffic" | "revenue" | "support" | "email";

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: { value: string; label: string }[] = [
  { value: "self_owned",            label: "Self-Owned" },
  { value: "law_and_justice",       label: "Law & Justice" },
  { value: "money_and_power",       label: "Money & Power" },
  { value: "us_constitution",       label: "US Constitution" },
  { value: "women_and_girls",       label: "Women & Girls" },
  { value: "anti_racist_heroes",    label: "Anti-Racist Heroes" },
  { value: "us_history",            label: "US History" },
  { value: "religion",              label: "Religion" },
  { value: "investigations",        label: "Investigations" },
  { value: "war_and_inhumanity",    label: "War & Inhumanity" },
  { value: "health_and_healing",    label: "Health & Healing" },
  { value: "technology",            label: "Technology" },
  { value: "censorship",            label: "Censorship" },
  { value: "global_south",          label: "Global South" },
  { value: "how_it_works",          label: "How It Works" },
  { value: "nerd_out",              label: "Nerd Out" },
  { value: "disarming_hate",        label: "Disarming Hate" },
  { value: "native_and_first_nations", label: "Native & First Nations" },
];

// ── Utilities ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = sessionStorage.getItem("metricadia_token");
  if (token) headers["X-Metricadia-Token"] = token;
  return headers;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── useAdminAuth ──────────────────────────────────────────────────────────────

function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("metricadia_authenticated") === "true") {
      setAuthenticated(true);
      return;
    }
    fetch("/api/metricadia/auth-status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAuthenticated(!!d.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  const logout = async () => {
    await fetch("/api/metricadia/logout", { method: "POST", credentials: "include" });
    sessionStorage.removeItem("metricadia_token");
    sessionStorage.removeItem("metricadia_authenticated");
    setAuthenticated(false);
  };

  return { authenticated, setAuthenticated, logout };
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeSection: Section;
  onSection: (s: Section) => void;
  onLogout: () => void;
}

const NAV_REAL: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { id: "articles",    label: "Articles",    icon: FileText },
  { id: "members",     label: "Members",     icon: Users },
  { id: "subscribers", label: "Subscribers", icon: Key },
];

const NAV_SOON: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "traffic",  label: "Traffic Analytics", icon: BarChart2 },
  { id: "revenue",  label: "Revenue & Sales",   icon: DollarSign },
  { id: "support",  label: "Support Tickets",   icon: LifeBuoy },
  { id: "email",    label: "Email Campaigns",   icon: Mail },
];

function Sidebar({ activeSection, onSection, onLogout }: SidebarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleReaderMode = async () => {
    await fetch("/api/metricadia/logout", { method: "POST", credentials: "include" });
    sessionStorage.removeItem("metricadia_token");
    sessionStorage.removeItem("metricadia_authenticated");
    window.location.href = "/";
  };

  return (
    <aside className="w-[240px] min-h-screen flex flex-col shrink-0" style={{ background: "#08122E", borderRight: "1px solid rgba(201,162,39,0.18)" }}>

      {/* Gold top bar */}
      <div style={{ height: "4px", background: "linear-gradient(90deg,#C9A227 0%,#E8C840 20%,#D4A820 40%,#F0D458 55%,#D4A820 70%,#E8C840 82%,#C9A227 100%)", boxShadow: "0 1px 8px rgba(201,162,39,0.4)" }} />

      {/* Brand */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
        <div className="mb-1">
          <span
            className="text-white leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "22px", letterSpacing: "0.04em" }}
          >
            BRAIN
          </span>
        </div>
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "10px", letterSpacing: "0.18em", color: "rgba(201,162,39,0.7)", marginTop: "2px" }}>
          METRICADIA RESEARCH LLC
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_REAL.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSection(id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left"
            style={activeSection === id
              ? { background: "rgba(201,162,39,0.12)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.28)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.12em" }
              : { color: "rgba(255,255,255,0.55)", border: "1px solid transparent", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "0.12em" }}
            onMouseEnter={(e) => { if (activeSection !== id) { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,162,39,0.06)"; } }}
            onMouseLeave={(e) => { if (activeSection !== id) { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; } }}
          >
            <Icon size={14} className="shrink-0" />
            {label.toUpperCase()}
          </button>
        ))}

        <div className="pt-3 pb-1">
          <div style={{ height: "1px", background: "rgba(201,162,39,0.15)" }} />
          <p className="px-3 mt-3 mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "9px", letterSpacing: "0.22em", color: "rgba(201,162,39,0.4)" }}>COMING SOON</p>
        </div>

        {NAV_SOON.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            disabled
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-not-allowed text-left"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.22)" }}
          >
            <Icon size={14} className="shrink-0" />
            <span className="flex-1">{label.toUpperCase()}</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "8px", letterSpacing: "0.18em", padding: "2px 6px", borderRadius: "3px", background: "#0C1F52", color: "rgba(201,162,39,0.4)", border: "1px solid rgba(201,162,39,0.15)" }}>SOON</span>
          </button>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="px-3 pb-5 pt-4 space-y-1" style={{ borderTop: "1px solid rgba(201,162,39,0.15)" }}>
        {/* Current user */}
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" style={{ border: "1px solid rgba(201,162,39,0.3)" }} />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold" style={{ background: "#0C1F52", border: "1px solid rgba(201,162,39,0.3)", color: "#C9A227" }}>
                {(user.fullName || user.primaryEmailAddress?.emailAddress || "A")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.fullName || "Admin"}</p>
              <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        )}

        <a
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
          style={{ color: "rgba(255,255,255,0.45)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,162,39,0.06)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
        >
          <ExternalLink size={13} />
          View Site
        </a>

        <button
          onClick={handleReaderMode}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left"
          style={{ color: "#C9A227" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,162,39,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <ShieldOff size={13} />
          Switch to Reader Mode
        </button>

        <button
          onClick={async () => { await onLogout(); signOut(); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left"
          style={{ color: "rgba(255,100,100,0.7)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,100,100,0.7)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ── Dashboard Overview Panel ──────────────────────────────────────────────────

interface DashboardPanelProps {
  articlesCount: number;
  onNewArticle: () => void;
  onSection: (s: Section) => void;
}

function DashboardPanel({ articlesCount, onNewArticle, onSection }: DashboardPanelProps) {
  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["/api/members"],
    queryFn: async () => {
      const res = await fetch("/api/members", { credentials: "include", headers: authHeaders() });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: tokens = [] } = useQuery<SubscriberToken[]>({
    queryKey: ["/api/metricadia/subscriber-tokens"],
    queryFn: async () => {
      const res = await fetch("/api/metricadia/subscriber-tokens", { credentials: "include", headers: authHeaders() });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const activeSubscribers = tokens.filter(t => t.active).length;

  const statCards = [
    {
      label: "Total Articles",
      value: articlesCount,
      icon: FileText,
      color: "indigo",
      action: () => onSection("articles"),
    },
    {
      label: "Registered Members",
      value: members.length,
      icon: Users,
      color: "sky",
      action: () => onSection("members"),
    },
    {
      label: "Active Subscribers",
      value: activeSubscribers,
      icon: Key,
      color: "amber",
      action: () => onSection("subscribers"),
    },
    {
      label: "Today's Views",
      value: "—",
      icon: Eye,
      color: "slate",
      comingSoon: true,
    },
  ];

  const colorMap: Record<string, { card: string; icon: string }> = {
    indigo: { card: "border-[#C9A227]/25 bg-[#0C1F52]/50",  icon: "text-[#C9A227]" },
    sky:    { card: "border-[#C9A227]/18 bg-[#0C1F52]/35",  icon: "text-[#E8C840]" },
    amber:  { card: "border-[#C9A227]/20 bg-[#0C1F52]/40",  icon: "text-[#C9A227]" },
    slate:  { card: "border-[rgba(255,255,255,0.08)] bg-[#08122E]/60", icon: "text-[rgba(255,255,255,0.25)]" },
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "28px", letterSpacing: "0.06em" }}>DASHBOARD</h1>
          <p className="mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)" }}>{today.toUpperCase()}</p>
        </div>
        <button
          onClick={onNewArticle}
          className="flex items-center gap-2 px-4 py-2 rounded-sm transition-colors"
          style={{ background: "#C9A227", color: "#08122E", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.15em" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#E8C840"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C9A227"; }}
        >
          <Plus size={14} />
          NEW ARTICLE
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, action, comingSoon }) => (
          <div
            key={label}
            onClick={action}
            className={`relative border rounded-xl p-5 ${colorMap[color].card} ${action ? "cursor-pointer hover:scale-[1.02] transition-transform" : ""}`}
          >
            {comingSoon && (
              <span className="absolute top-3 right-3 text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider" style={{ background: "#08122E", color: "rgba(201,162,39,0.5)", border: "1px solid rgba(201,162,39,0.2)" }}>
                SOON
              </span>
            )}
            <Icon size={20} className={`mb-3 ${colorMap[color].icon}`} />
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Members */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(201,162,39,0.18)", background: "rgba(12,31,82,0.45)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.9)" }}>RECENT MEMBERS</h2>
            <button onClick={() => onSection("members")} className="flex items-center gap-1 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.15em", color: "#C9A227" }}>
              VIEW ALL <ChevronRight size={12} />
            </button>
          </div>
          <div className="p-4">
            {members.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: "rgba(255,255,255,0.3)" }}>No members yet.</p>
            ) : (
              <div className="space-y-2">
                {members.slice(0, 5).map((m) => (
                  <div key={m.clerkId} className="flex items-center gap-3">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" style={{ border: "1px solid rgba(201,162,39,0.25)" }} />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#0C1F52", border: "1px solid rgba(201,162,39,0.25)", color: "#C9A227" }}>
                        {(m.name || m.email)[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{m.name || <span className="italic" style={{ color: "rgba(255,255,255,0.35)" }}>No name</span>}</p>
                      <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{m.email}</p>
                    </div>
                    <p className="text-[10px] shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{fmtDate(m.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Planned Features */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(201,162,39,0.18)", background: "rgba(12,31,82,0.45)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.9)" }}>PLANNED FEATURES</h2>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>COMING AFTER OFFICIAL INCORPORATION</p>
          </div>
          <div className="p-4 space-y-3">
            {[
              { icon: BarChart2, label: "Google Analytics Integration", desc: "Traffic, pageviews, sessions" },
              { icon: DollarSign, label: "Revenue & Sales Dashboard",  desc: "Orders, subscriptions, payments" },
              { icon: LifeBuoy,  label: "Support Tickets",             desc: "AI-assisted customer service" },
              { icon: Mail,      label: "Email Campaigns",             desc: "Sent, opened, conversion rates" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#08122E", border: "1px solid rgba(201,162,39,0.2)" }}>
                  <Icon size={14} style={{ color: "rgba(201,162,39,0.45)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>{label}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ComingSoon Panel ──────────────────────────────────────────────────────────

function ComingSoonPanel({ section }: { section: Section }) {
  const info: Record<string, { icon: React.ElementType; title: string; desc: string; when: string }> = {
    traffic: {
      icon: BarChart2,
      title: "Traffic Analytics",
      desc: "Real-time pageviews, sessions, bounce rate, and geo data via Google Analytics.",
      when: "After Google Analytics setup (post-incorporation)",
    },
    revenue: {
      icon: DollarSign,
      title: "Revenue & Sales",
      desc: "Orders, subscriptions, pending sales, refunds, and revenue trends.",
      when: "After payment processor integration",
    },
    support: {
      icon: LifeBuoy,
      title: "Support Tickets",
      desc: "Incoming support requests. AI-assisted responses via Claude/Replit API will auto-handle the queue.",
      when: "After customer support workflow is built",
    },
    email: {
      icon: Mail,
      title: "Email Campaigns",
      desc: "Emails sent, opened, clicked. Active subscribers, unsubscribes, and campaign performance.",
      when: "After email provider integration",
    },
  };

  const data = info[section] || { icon: LayoutDashboard, title: section, desc: "", when: "" };
  const Icon = data.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "#08122E", border: "1px solid rgba(201,162,39,0.25)" }}>
        <Icon size={28} style={{ color: "rgba(201,162,39,0.4)" }} />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">{data.title}</h1>
      <p className="text-sm max-w-md mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>{data.desc}</p>
      <div className="rounded-xl px-4 py-3 text-xs max-w-sm" style={{ background: "#08122E", border: "1px solid rgba(201,162,39,0.2)", color: "rgba(255,255,255,0.45)" }}>
        <span className="font-bold" style={{ color: "rgba(201,162,39,0.75)" }}>Planned: </span>{data.when}
      </div>
    </div>
  );
}

// ── Articles Panel ────────────────────────────────────────────────────────────

interface ArticlesPanelProps {
  posts: Post[];
  allCount: number;
  isLoading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onNewArticle: () => void;
  onEdit: (p: Post) => void;
  premiumMutation: ReturnType<typeof useMutation<any, any, any>>;
}

function ArticlesPanel({ posts, allCount, isLoading, search, onSearch, onNewArticle, onEdit, premiumMutation }: ArticlesPanelProps) {
  return (
    <div>
      {/* Section header — Metricadia research-roster style */}
      <div className="flex items-center justify-between mb-0 pb-3" style={{ borderBottom: "1px solid rgba(201,162,39,0.3)" }}>
        <div className="flex items-baseline gap-6">
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "13px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.9)" }}>ARTICLES</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: "11px", letterSpacing: "0.14em", color: "rgba(201,162,39,0.6)" }}>{allCount} ON RECORD</span>
        </div>
        <button
          onClick={onNewArticle}
          className="flex items-center gap-2 px-4 py-1.5 rounded-sm transition-colors"
          style={{ background: "#C9A227", color: "#08122E", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.15em" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#E8C840"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C9A227"; }}
          data-testid="button-new-article"
        >
          <Plus size={13} />
          NEW ARTICLE
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by title or case number…"
        className="w-full mb-5 px-4 py-2.5 text-white text-sm focus:outline-none rounded-lg"
        style={{ background: "#08122E", border: "1px solid rgba(201,162,39,0.2)" }}
        onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.border = "1px solid rgba(201,162,39,0.55)"; }}
        onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.border = "1px solid rgba(201,162,39,0.2)"; }}
        data-testid="input-search-posts"
      />

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgba(201,162,39,0.3)", borderTopColor: "#C9A227" }} />
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.35)" }}>
          <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(201,162,39,0.25)" }} />
          <p className="text-sm">No articles found.</p>
        </div>
      )}

      <div>
        {posts.map((post, idx) => (
          <div
            key={post.id}
            className="group transition-all"
            style={{ borderBottom: "1px solid rgba(201,162,39,0.12)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(201,162,39,0.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            data-testid={`card-post-${post.id}`}
          >
            <div className="flex items-center gap-0 py-3.5 px-1">
              {/* Number */}
              <div className="w-12 shrink-0">
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "13px", color: "#C9A227", letterSpacing: "0.05em" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              {/* Title block */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(post)}>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  {post.premiumOnly && (
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "9px", letterSpacing: "0.18em", padding: "1px 6px", borderRadius: "2px", background: "#C9A227", color: "#08122E" }}>
                      MEMBERS
                    </span>
                  )}
                  {post.caseNumber && (
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "10px", letterSpacing: "0.1em", color: "rgba(201,162,39,0.55)" }}>{post.caseNumber}</span>
                  )}
                </div>
                <span className="font-bold text-white transition-colors group-hover:text-[#E8C840]" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "14px", fontWeight: 700 }}>
                  {post.title || "(Untitled)"}
                </span>
                {post.publishedAt && (
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{fmtDate(post.publishedAt)}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    premiumMutation.mutate({ id: post.id, premiumOnly: !post.premiumOnly });
                  }}
                  title={post.premiumOnly ? "Remove members-only" : "Mark as members-only"}
                  className={`p-1.5 rounded-lg transition-colors ${
                    post.premiumOnly
                      ? "text-amber-400 bg-amber-950/40 hover:bg-amber-950/60"
                      : "text-slate-600 hover:text-amber-400 hover:bg-slate-800"
                  }`}
                >
                  <Star className={`w-4 h-4 ${post.premiumOnly ? "fill-amber-400" : ""}`} />
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(post)}
                  className="shrink-0 border-slate-700 text-slate-300 group-hover:border-indigo-500 group-hover:text-indigo-300"
                  data-testid={`button-edit-post-${post.id}`}
                >
                  <PenLine className="w-4 h-4 mr-1.5" />Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── New Article Modal ─────────────────────────────────────────────────────────

interface NewArticleModalProps {
  onClose: () => void;
  onCreated: (post: Post) => void;
}

function NewArticleModal({ onClose, onCreated }: NewArticleModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [caseManual, setCaseManual] = useState(false);
  const [caseLoading, setCaseLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCaseLoading(true);
    fetch("/api/metricadia/next-case-number", { credentials: "include", headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (d.caseNumber) setCaseNumber(d.caseNumber); })
      .catch(() => setCaseNumber("CB-000001"))
      .finally(() => setCaseLoading(false));
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !caseNumber.trim() || !slug.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^CB-\d{6}$/.test(caseNumber.trim())) {
      setError("Case number must be in CB-XXXXXX format.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/metricadia/posts", {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify({
          caseNumber: caseNumber.trim(),
          title: title.trim(),
          slug: slug.trim(),
          category,
          status: "draft",
          body: "",
          teaser: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to create article."); return; }
      onCreated({ id: data.id, title: title.trim(), slug: slug.trim(), excerpt: "", content: "", caseNumber: caseNumber.trim() });
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: "#08122E", border: "1px solid rgba(201,162,39,0.25)" }}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "#C9A227", color: "#08122E" }}>
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-white">New Article</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,162,39,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"; }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm rounded-lg px-4 py-3" style={{ color: "#f87171", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}>{error}</div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(201,162,39,0.75)" }}>
              Title <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article headline..."
              className="w-full px-3 py-2.5 text-white text-sm focus:outline-none rounded-lg"
              style={{ background: "#0C1F52", border: "1px solid rgba(201,162,39,0.2)" }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.border = "1px solid rgba(201,162,39,0.5)"; }}
              onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.border = "1px solid rgba(201,162,39,0.2)"; }}
              autoFocus
              data-testid="input-new-article-title"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(201,162,39,0.75)" }}>
              Category <span style={{ color: "#f87171" }}>*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-white text-sm focus:outline-none rounded-lg"
              style={{ background: "#0C1F52", border: "1px solid rgba(201,162,39,0.2)" }}
              onFocus={(e) => { (e.currentTarget as HTMLSelectElement).style.border = "1px solid rgba(201,162,39,0.5)"; }}
              onBlur={(e) => { (e.currentTarget as HTMLSelectElement).style.border = "1px solid rgba(201,162,39,0.2)"; }}
              data-testid="select-new-article-category"
            >
              <option value="" disabled>Select a category...</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(201,162,39,0.75)" }}>
                Case Number <span style={{ color: "#f87171" }}>*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={caseLoading ? "" : caseNumber}
                  onChange={(e) => { setCaseManual(true); setCaseNumber(e.target.value); }}
                  placeholder={caseLoading ? "Loading..." : "CB-000000"}
                  className="w-full px-3 py-2.5 text-white text-sm font-mono focus:outline-none rounded-lg"
                  style={{ background: "#0C1F52", border: "1px solid rgba(201,162,39,0.2)" }}
                  onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.border = "1px solid rgba(201,162,39,0.5)"; }}
                  onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.border = "1px solid rgba(201,162,39,0.2)"; }}
                  data-testid="input-new-article-case-number"
                />
                {caseLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: "rgba(201,162,39,0.5)" }} />}
              </div>
              {!caseManual && !caseLoading && <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Auto-generated · editable</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(201,162,39,0.75)" }}>
                Slug <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
                placeholder="url-slug"
                className="w-full px-3 py-2.5 text-white text-sm font-mono focus:outline-none rounded-lg"
                style={{ background: "#0C1F52", border: "1px solid rgba(201,162,39,0.2)" }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.border = "1px solid rgba(201,162,39,0.5)"; }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.border = "1px solid rgba(201,162,39,0.2)"; }}
                data-testid="input-new-article-slug"
              />
              {!slugManual && slug && <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Auto-derived from title</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1 font-bold" style={{ color: "rgba(255,255,255,0.55)" }} onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 font-bold border-0"
              style={{ background: "#C9A227", color: "#08122E" }}
              disabled={submitting || caseLoading || !title.trim() || !category || !slug.trim()}
              data-testid="button-create-article"
            >
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : <><Plus className="w-4 h-4 mr-2" />Create &amp; Open Editor</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Subscribers Panel ─────────────────────────────────────────────────────────

function SubscribersPanel({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const queryClient = useQueryClient();
  const [newLabel, setNewLabel] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data: tokens = [], isLoading } = useQuery<SubscriberToken[]>({
    queryKey: ["/api/metricadia/subscriber-tokens"],
    queryFn: async () => {
      const res = await fetch("/api/metricadia/subscriber-tokens", { credentials: "include", headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch tokens");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/metricadia/subscriber-tokens", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ label: newLabel.trim(), email: newEmail.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Failed to create token");
      return res.json();
    },
    onSuccess: () => {
      setNewLabel(""); setNewEmail(""); setCreating(false);
      queryClient.invalidateQueries({ queryKey: ["/api/metricadia/subscriber-tokens"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ token, active }: { token: string; active: boolean }) => {
      const res = await fetch(`/api/metricadia/subscriber-tokens/${token}/active`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/metricadia/subscriber-tokens"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (token: string) => {
      await fetch(`/api/metricadia/subscriber-tokens/${token}`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/metricadia/subscriber-tokens"] }),
  });

  function copyToken(token: string) {
    const url = `${window.location.origin}/subscribe?token=${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Subscribers</h1>
          <p className="text-slate-500 text-sm mt-0.5">{tokens.filter(t => t.active).length} active tokens</p>
        </div>
        <Button size="sm" onClick={() => setCreating(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
          <Plus className="w-4 h-4 mr-2" />Issue Token
        </Button>
      </div>

      {creating && (
        <div className="bg-slate-900 border border-amber-700/40 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-white mb-4">Issue New Access Token</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Label <span className="text-red-400">*</span></label>
              <input
                type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Jane Smith — Apr 2026"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email (optional)</label>
              <input
                type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                placeholder="subscriber@example.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button size="sm" onClick={() => createMutation.mutate()} disabled={!newLabel.trim() || createMutation.isPending} className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
                {createMutation.isPending ? "Creating..." : "Create Token"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCreating(false)} className="text-slate-400">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}

      {!isLoading && tokens.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Key className="w-10 h-10 mx-auto mb-3 text-slate-700" />
          <p className="text-sm">No subscriber tokens yet. Issue one to get started.</p>
        </div>
      )}

      <div className="grid gap-3">
        {tokens.map((t) => (
          <div key={t.token} className={`bg-slate-900 border rounded-xl p-4 ${t.active ? "border-slate-800" : "border-slate-800/40 opacity-60"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-bold text-white text-sm">{t.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.active ? "bg-green-950 text-green-400" : "bg-slate-800 text-slate-500"}`}>
                    {t.active ? "ACTIVE" : "REVOKED"}
                  </span>
                </div>
                {t.email && <p className="text-xs text-slate-500">{t.email}</p>}
                <p className="text-[10px] text-slate-700 font-mono mt-1 truncate max-w-[240px]" title={t.token}>{t.token}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Issued: {fmtDate(t.createdAt)}{t.expiresAt && ` · Expires: ${fmtDate(t.expiresAt)}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => copyToken(t.token)} title="Copy activation link" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  {copiedToken === t.token ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleMutation.mutate({ token: t.token, active: !t.active })}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${t.active ? "bg-red-950/50 text-red-400 hover:bg-red-950" : "bg-green-950/50 text-green-400 hover:bg-green-950"}`}
                >
                  {t.active ? "Revoke" : "Restore"}
                </button>
                <button
                  onClick={() => { if (confirm(`Delete token for "${t.label}"?`)) deleteMutation.mutate(t.token); }}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Members Panel ─────────────────────────────────────────────────────────────

function MembersPanel({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
    queryFn: async () => {
      const res = await fetch("/api/members", { credentials: "include", headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch members");
      return res.json();
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgba(201,162,39,0.3)", borderTopColor: "#C9A227" }} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-0 pb-3" style={{ borderBottom: "1px solid rgba(201,162,39,0.3)" }}>
        <div className="flex items-baseline gap-6">
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "13px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.9)" }}>MEMBERS</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: "11px", letterSpacing: "0.14em", color: "rgba(201,162,39,0.6)" }}>{members.length} REGISTERED</span>
        </div>
      </div>
      <div className="mt-5" />

      {members.length === 0 ? (
        <div className="text-center py-20 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(201,162,39,0.25)" }} />
          <p>No members yet. They appear here after signing in via Clerk.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(201,162,39,0.2)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0C1F52", borderBottom: "1px solid rgba(201,162,39,0.2)" }}>
                {["Member", "Email", "Joined", "Last Login"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest" style={{ color: "#C9A227" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.clerkId} style={{ background: i % 2 === 0 ? "rgba(8,18,46,0.9)" : "rgba(12,31,82,0.3)", borderBottom: "1px solid rgba(201,162,39,0.08)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" style={{ border: "1px solid rgba(201,162,39,0.25)" }} />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#0C1F52", border: "1px solid rgba(201,162,39,0.25)" }}>
                          <span className="text-[10px] font-bold" style={{ color: "#C9A227" }}>{(m.name || m.email)[0].toUpperCase()}</span>
                        </div>
                      )}
                      <span className="text-white font-medium">{m.name || <span className="italic" style={{ color: "rgba(255,255,255,0.35)" }}>—</span>}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{m.email}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{fmtDate(m.createdAt)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{fmtDate(m.lastLoginAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── AdminEditorPage (main) ────────────────────────────────────────────────────

export default function AdminEditorPage() {
  const params = useParams<{ postId?: string }>();
  const [, setLocation] = useLocation();
  const { authenticated, setAuthenticated, logout } = useAdminAuth();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [search, setSearch] = useState("");
  const [showNewArticle, setShowNewArticle] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const queryClient = useQueryClient();

  const premiumMutation = useMutation({
    mutationFn: async ({ id, premiumOnly }: { id: string; premiumOnly: boolean }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = sessionStorage.getItem("metricadia_token");
      if (token) headers["X-Metricadia-Token"] = token;
      const res = await fetch(`/api/metricadia/posts/${id}/premium`, {
        method: "PATCH", headers, credentials: "include",
        body: JSON.stringify({ premiumOnly }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/metricadia/posts"] }),
  });

  const { data: postsData, isLoading } = useQuery<{ posts: Post[] }>({
    queryKey: ["/api/metricadia/posts"],
    enabled: authenticated === true,
    queryFn: async () => {
      const headers: Record<string, string> = {};
      const token = sessionStorage.getItem("metricadia_token");
      if (token) headers["X-Metricadia-Token"] = token;
      const res = await fetch("/api/metricadia/posts", { credentials: "include", headers });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const allPosts = postsData?.posts || [];
  const posts = search.trim()
    ? allPosts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.caseNumber || "").toLowerCase().includes(search.toLowerCase())
      )
    : allPosts;

  useEffect(() => {
    if (params.postId && allPosts.length > 0) {
      const found = allPosts.find((p) => p.id === params.postId || p.slug === params.postId);
      if (found) setEditingPost(found);
    }
  }, [params.postId, allPosts]);

  const handleCreated = useCallback((post: Post) => {
    setShowNewArticle(false);
    queryClient.invalidateQueries({ queryKey: ["/api/metricadia/posts"] });
    setEditingPost(post);
  }, [queryClient]);

  // ── Loading state ──
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#08122E" }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgba(201,162,39,0.25)", borderTopColor: "#C9A227" }} />
      </div>
    );
  }

  // ── Login screen ──
  if (!authenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          sessionStorage.setItem("metricadia_authenticated", "true");
          setAuthenticated(true);
        }}
      />
    );
  }

  // ── Article editor (full-screen) ──
  if (editingPost) {
    return (
      <MetricadiaEditor
        postId={editingPost.id}
        initialTitle={editingPost.title}
        initialContent={editingPost.content}
        initialExcerpt={editingPost.excerpt}
        onClose={() => {
          setEditingPost(null);
          setLocation("/Kemet8");
        }}
      />
    );
  }

  // ── Main dashboard layout ──
  return (
    <div className="flex min-h-screen text-white" style={{ background: "#08122E" }}>
      {showNewArticle && (
        <NewArticleModal
          onClose={() => setShowNewArticle(false)}
          onCreated={handleCreated}
        />
      )}

      <Sidebar
        activeSection={activeSection}
        onSection={(s) => { setActiveSection(s); setSearch(""); }}
        onLogout={logout}
      />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 px-8 py-4" style={{ background: "rgba(8,18,46,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(201,162,39,0.12)" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.2em", color: "#C9A227" }}>BRAIN</span>
            <span style={{ color: "rgba(201,162,39,0.35)", fontSize: "12px" }}>&ndash;</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.65)" }}>{activeSection.toUpperCase()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 max-w-5xl">
          {activeSection === "dashboard" && (
            <DashboardPanel
              articlesCount={allPosts.length}
              onNewArticle={() => { setActiveSection("articles"); setShowNewArticle(true); }}
              onSection={setActiveSection}
            />
          )}

          {activeSection === "articles" && (
            <ArticlesPanel
              posts={posts}
              allCount={allPosts.length}
              isLoading={isLoading}
              search={search}
              onSearch={setSearch}
              onNewArticle={() => setShowNewArticle(true)}
              onEdit={setEditingPost}
              premiumMutation={premiumMutation as any}
            />
          )}

          {activeSection === "members" && <MembersPanel authHeaders={authHeaders} />}
          {activeSection === "subscribers" && <SubscribersPanel authHeaders={authHeaders} />}

          {(activeSection === "traffic" || activeSection === "revenue" || activeSection === "support" || activeSection === "email") && (
            <ComingSoonPanel section={activeSection} />
          )}
        </div>
      </main>
    </div>
  );
}
