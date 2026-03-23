import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePostsCount } from "@/hooks/use-posts";

const CATEGORIES = [
  { id: "all",               label: "All" },
  { id: "self_owned",        label: "Self-Owned" },
  { id: "law_and_justice",   label: "Law & Justice Files" },
  { id: "money_and_power",   label: "Money & Power" },
  { id: "us_constitution",   label: "U.S. Constitution" },
  { id: "women_and_girls",   label: "Women & Girls" },
  { id: "anti_racist_heroes",label: "Anti-Racist Heroes" },
  { id: "us_history",        label: "U.S. History" },
  { id: "religion",          label: "Religion" },
  { id: "investigations",    label: "Investigations" },
  { id: "war_and_inhumanity",label: "War & Inhumanity" },
  { id: "health_and_healing",label: "Health & Healing" },
  { id: "technology",        label: "Technology" },
  { id: "censorship",        label: "Censorship" },
  { id: "global_south",      label: "Global South" },
  { id: "how_it_works",      label: "How It Works" },
];

const PILL: Record<string, { on: string; off: string }> = {
  all:               { on: 'bg-primary text-white shadow-md ring-2 ring-primary/40',         off: 'bg-muted text-muted-foreground hover:bg-border hover:text-foreground' },
  self_owned:        { on: 'bg-primary text-white shadow-md ring-2 ring-primary/40',         off: 'bg-primary text-white hover:bg-primary/80' },
  law_and_justice:   { on: 'bg-red-700 text-white shadow-md ring-2 ring-red-700/40',         off: 'bg-red-700 text-white hover:bg-red-800' },
  money_and_power:   { on: 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-700/40', off: 'bg-emerald-700 text-white hover:bg-emerald-800' },
  us_constitution:   { on: 'bg-indigo-700 text-white shadow-md ring-2 ring-indigo-700/40',   off: 'bg-indigo-700 text-white hover:bg-indigo-800' },
  women_and_girls:   { on: 'bg-rose-600 text-white shadow-md ring-2 ring-rose-600/40',       off: 'bg-rose-600 text-white hover:bg-rose-700' },
  anti_racist_heroes:{ on: 'bg-secondary text-gray-900 shadow-md ring-2 ring-secondary/50', off: 'bg-secondary/80 text-gray-900 hover:bg-secondary' },
  us_history:        { on: 'bg-teal-700 text-white shadow-md ring-2 ring-teal-700/40',       off: 'bg-teal-700 text-white hover:bg-teal-800' },
  religion:          { on: 'bg-violet-700 text-white shadow-md ring-2 ring-violet-700/40',   off: 'bg-violet-700 text-white hover:bg-violet-800' },
  investigations:    { on: 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/40',     off: 'bg-amber-600 text-white hover:bg-amber-700' },
  war_and_inhumanity:{ on: 'bg-orange-700 text-white shadow-md ring-2 ring-orange-700/40',   off: 'bg-orange-700 text-white hover:bg-orange-800' },
  health_and_healing:{ on: 'bg-green-700 text-white shadow-md ring-2 ring-green-700/40',     off: 'bg-green-700 text-white hover:bg-green-800' },
  technology:        { on: 'bg-sky-600 text-white shadow-md ring-2 ring-sky-600/40',         off: 'bg-sky-600 text-white hover:bg-sky-700' },
  censorship:        { on: 'bg-zinc-700 text-white shadow-md ring-2 ring-zinc-700/40',       off: 'bg-zinc-700 text-white hover:bg-zinc-800' },
  global_south:      { on: 'bg-cyan-700 text-white shadow-md ring-2 ring-cyan-700/40',       off: 'bg-cyan-700 text-white hover:bg-cyan-800' },
  how_it_works:      { on: 'bg-slate-600 text-white shadow-md ring-2 ring-slate-600/40',     off: 'bg-slate-600 text-white hover:bg-slate-700' },
};

export function Layout({ children, onCategoryChange, activeCategory }: { 
  children: React.ReactNode,
  onCategoryChange?: (id: string | null) => void,
  activeCategory?: string 
}) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [footerOpen, setFooterOpen] = useState<Record<string, boolean>>({});
  const [mobileCtaOpen, setMobileCtaOpen] = useState(false);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  const { data: postCount } = usePostsCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => { setMobileMenuOpen(false); setCatDropdownOpen(false); }, [location]);

  // Close category dropdown on outside click
  useEffect(() => {
    if (!catDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [catDropdownOpen]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-verified selection:text-white">
      {/* Sticky Navbar */}
      <header className={`
        sticky top-0 z-50 w-full transition-all duration-200
        ${scrolled ? 'bg-header/95 backdrop-blur-md shadow-lg' : 'bg-header'}
      `}>
        <div className="cb-container h-20 sm:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => { onCategoryChange?.('all'); setCatDropdownOpen(false); }}
            className="flex flex-col leading-none hover:opacity-90 transition-opacity group"
          >
            <div className="flex items-baseline gap-0">
              <span className="logo-text text-3xl sm:text-4xl text-white tracking-tight">Clown</span>
              <span className="logo-text text-3xl sm:text-4xl text-secondary tracking-tight">Binge</span>
              <span className="text-white/40 text-2xl sm:text-3xl font-sans font-light mx-2">|</span>
              <span className="text-white/80 text-xl sm:text-2xl font-sans font-semibold tracking-widest uppercase">
                Newsroom
              </span>
            </div>
            <span className="text-white text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase mt-0.5 transition-colors">
              Independent Primary Sourced News Only
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 ml-10">
            <Link href="/" className={`text-sm font-bold uppercase tracking-wider hover:text-white transition-colors ${location === '/' ? 'text-white' : 'text-white/70'}`}>
              Home
            </Link>
            <Link href="/about" className={`text-sm font-bold uppercase tracking-wider hover:text-white transition-colors ${location === '/about' ? 'text-white' : 'text-white/70'}`}>
              About
            </Link>
            <Link href="/store" className={`text-sm font-bold uppercase tracking-wider hover:text-secondary transition-colors ${location === '/store' ? 'text-secondary' : 'text-white/70'}`}>
              Books
            </Link>
            <Link href="/contact" className={`text-sm font-bold uppercase tracking-wider hover:text-white transition-colors ${location === '/contact' ? 'text-white' : 'text-white/70'}`}>
              Contact
            </Link>
            <Link href="/advertise" className={`text-sm font-bold uppercase tracking-wider hover:text-secondary transition-colors ${location === '/advertise' ? 'text-secondary' : 'text-white/70'}`}>
              Advertise
            </Link>
            <Link href="/submit" className={`text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-colors ${location === '/submit' ? 'bg-secondary text-gray-900' : 'bg-secondary/90 text-gray-900 hover:bg-secondary'}`}>
              Submit a Post
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 sm:top-24 z-40 bg-header/95 backdrop-blur-xl flex flex-col md:hidden">
          <nav className="flex flex-col items-center justify-center flex-1 gap-8 p-6">
            <Link href="/" className="text-2xl font-bold text-white uppercase tracking-widest">Home</Link>
            <Link href="/about" className="text-2xl font-bold text-white uppercase tracking-widest">About</Link>
            <Link href="/store" className="text-2xl font-bold text-secondary uppercase tracking-widest">Books</Link>
            <Link href="/contact" className="text-2xl font-bold text-white uppercase tracking-widest">Contact</Link>
            <Link href="/advertise" className="text-2xl font-bold text-secondary uppercase tracking-widest">Advertise</Link>
            <Link href="/submit" className="text-2xl font-bold bg-secondary text-gray-900 uppercase tracking-widest px-8 py-3 rounded-full">Submit a Post</Link>
          </nav>
        </div>
      )}

      {/* Category sub-bar -- sticky below nav */}
      <div className="sticky top-[80px] z-40 bg-white border-b shadow-sm relative" ref={catDropdownRef}>
        <div className="cb-container">

          {/* Desktop: two-row wrap (md+) */}
          <div className="hidden md:flex flex-wrap py-2.5 gap-2">
            {CATEGORIES.map(cat => {
              const isActive = location === '/' && (activeCategory === cat.id || (!activeCategory && cat.id === 'all'));
              const pill = PILL[cat.id] ?? PILL.all;
              const cls = `px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${isActive ? pill.on : pill.off}`;
              return onCategoryChange && location === '/' ? (
                <button key={cat.id} onClick={() => onCategoryChange(cat.id)} className={cls}>{cat.label}</button>
              ) : (
                <Link key={cat.id} href={cat.id === 'all' ? '/' : `/?category=${cat.id}`} className={cls}>{cat.label}</Link>
              );
            })}
          </div>

          {/* Mobile: tap-to-open dropdown (below md) */}
          <div className="md:hidden">
            {(() => {
              const activeCat = CATEGORIES.find(c => c.id === (activeCategory || 'all')) ?? CATEGORIES[0];
              const pill = PILL[activeCat.id] ?? PILL.all;
              return (
                <button
                  onClick={() => setCatDropdownOpen(o => !o)}
                  className="flex items-center justify-between w-full py-3 gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${location === '/' ? pill.on : PILL.all.off}`}>
                      {activeCat.label}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${catDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              );
            })()}

            {catDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-50 bg-white border-b border-t border-border shadow-xl">
                <div className="cb-container py-4 flex flex-wrap gap-2 max-h-[70vh] overflow-y-auto">
                  {CATEGORIES.map(cat => {
                    const isActive = location === '/' && (activeCategory === cat.id || (!activeCategory && cat.id === 'all'));
                    const pill = PILL[cat.id] ?? PILL.all;
                    const cls = `px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${isActive ? pill.on : pill.off}`;
                    const handleSelect = () => {
                      setCatDropdownOpen(false);
                      if (onCategoryChange && location === '/') onCategoryChange(cat.id);
                    };
                    return onCategoryChange && location === '/' ? (
                      <button key={cat.id} onClick={handleSelect} className={cls}>{cat.label}</button>
                    ) : (
                      <Link key={cat.id} href={cat.id === 'all' ? '/' : `/?category=${cat.id}`} onClick={() => setCatDropdownOpen(false)} className={cls}>{cat.label}</Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-header mt-20 py-12 sm:py-16">
        <div className="cb-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex flex-col leading-none mb-4 inline-flex hover:opacity-90 transition-opacity">
                <div className="flex items-baseline gap-0">
                  <span className="logo-text text-3xl text-white tracking-tight">Clown</span>
                  <span className="logo-text text-3xl text-secondary tracking-tight">Binge</span>
                  <span className="text-white/40 text-2xl font-sans font-light mx-2">|</span>
                  <span className="text-white/80 text-xl font-sans font-semibold tracking-widest uppercase">
                    Newsroom
                  </span>
                </div>
                <span className="text-white/50 text-[10px] font-mono tracking-[0.2em] uppercase mt-0.5">
                  Independent Primary Sourced News Only
                </span>
              </Link>
              <p className="text-white/70 font-medium max-w-sm mb-6 leading-relaxed">
                Verified accountability journalism. Primary sources only. The receipts don't lie.
              </p>
              <div className="text-xs text-white/50 font-mono leading-relaxed">
                © {new Date().getFullYear()} ClownBinge
              </div>
              <div className="text-xs text-white/40 mt-1 leading-relaxed">
                Primary Source Analytics, LLC
              </div>
            </div>
            
            <div>
              <button
                className="w-full flex items-center justify-between text-white font-bold uppercase tracking-widest text-sm py-3 md:py-0 md:mb-4 border-b border-white/10 md:border-none md:cursor-default"
                onClick={() => setFooterOpen(s => ({ ...s, platform: !s.platform }))}
                aria-expanded={!!footerOpen.platform}
              >
                Platform
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform duration-200 ${footerOpen.platform ? "rotate-180" : ""}`}
                />
              </button>
              <ul className={`space-y-4 mt-3 md:mt-0 overflow-hidden transition-all duration-200 ${footerOpen.platform ? "max-h-96" : "max-h-0 md:max-h-96"}`}>
                <li><Link href="/" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Home Feed</Link></li>
                <li><Link href="/submit" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Submit a Post</Link></li>
                <li><Link href="/store" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Books & Store</Link></li>
                <li><Link href="/about" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">About & Mission</Link></li>
                <li><Link href="/contact" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <button
                className="w-full flex items-center justify-between text-white font-bold uppercase tracking-widest text-sm py-3 md:py-0 md:mb-4 border-b border-white/10 md:border-none md:cursor-default"
                onClick={() => setFooterOpen(s => ({ ...s, legal: !s.legal }))}
                aria-expanded={!!footerOpen.legal}
              >
                Legal
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform duration-200 ${footerOpen.legal ? "rotate-180" : ""}`}
                />
              </button>
              <ul className={`space-y-4 mt-3 md:mt-0 overflow-hidden transition-all duration-200 ${footerOpen.legal ? "max-h-96" : "max-h-0 md:max-h-96"}`}>
                <li><Link href="/privacy" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Terms of Service</Link></li>
                <li><a href="/ethics#self-own-methodology" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Scoring Methodology</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Verify CTA -- desktop: low-opacity, reveal on hover */}
      <div
        className="hidden lg:flex fixed bottom-6 left-6 z-30 flex-col gap-2 shadow-2xl rounded-2xl overflow-hidden border border-white/10 opacity-25 hover:opacity-100 transition-opacity duration-300"
        style={{ background: "#1A3A8F" }}
      >
        <div className="px-4 pt-3 pb-1">
          <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Primary Source Verification</p>
        </div>
        <div className="px-3 pb-3 flex flex-col gap-2">
          <Link
            href="/clowncheck"
            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-gray-900 hover:opacity-90 transition-opacity"
            style={{ background: "#F5C518" }}
          >
            <span>Verify ANY News</span>
            <span className="text-xs font-semibold opacity-70">$4.95</span>
          </Link>
          <Link
            href="/reports"
            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-white border border-white/20 hover:bg-white/10 transition-colors"
          >
            <span>Full PST Report</span>
            <span className="text-xs font-semibold opacity-70">$24.95</span>
          </Link>
        </div>
      </div>

      {/* Floating Verify CTA -- mobile: tap to reveal */}
      <div className="flex lg:hidden fixed bottom-5 left-4 z-30 flex-col items-start">
        {mobileCtaOpen && (
          <div
            className="mb-2 flex flex-col gap-2 shadow-2xl rounded-2xl overflow-hidden border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{ background: "#1A3A8F" }}
          >
            <div className="px-4 pt-3 pb-1">
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Primary Source Verification</p>
            </div>
            <div className="px-3 pb-3 flex flex-col gap-2">
              <Link
                href="/clowncheck"
                onClick={() => setMobileCtaOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-gray-900"
                style={{ background: "#F5C518" }}
              >
                <span>Verify ANY News</span>
                <span className="text-xs font-semibold opacity-70">$4.95</span>
              </Link>
              <Link
                href="/reports"
                onClick={() => setMobileCtaOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-white border border-white/20"
              >
                <span>Full PST Report</span>
                <span className="text-xs font-semibold opacity-70">$24.95</span>
              </Link>
            </div>
          </div>
        )}
        <button
          onClick={() => setMobileCtaOpen((o) => !o)}
          className="px-4 py-2 rounded-full font-bold text-xs text-gray-900 shadow-lg transition-transform active:scale-95"
          style={{ background: "#F5C518" }}
        >
          {mobileCtaOpen ? "Close" : "PST Verify"}
        </button>
      </div>
    </div>
  );
}
