import { Link, useLocation } from "wouter";
import { Menu, X, CheckCircle, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { usePostsCount } from "@/hooks/use-posts";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "political", label: "Political" },
  { id: "self_owned", label: "Self-Owned" },
  { id: "clown_electeds", label: "Clown Electeds" },
  { id: "religious", label: "Religious" },
  { id: "cultural", label: "Cultural" },
  { id: "anti_racist_hero", label: "Anti-Racist Hero" },
  { id: "cb_exclusive", label: "CB Exclusive" },
];

export function Layout({ children, onCategoryChange, activeCategory }: { 
  children: React.ReactNode,
  onCategoryChange?: (id: string | null) => void,
  activeCategory?: string 
}) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [footerOpen, setFooterOpen] = useState<Record<string, boolean>>({});
  const { data: postCount } = usePostsCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileMenuOpen(false), [location]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-verified selection:text-white">
      {/* Sticky Navbar */}
      <header className={`
        sticky top-0 z-50 w-full transition-all duration-200
        ${scrolled ? 'bg-header/95 backdrop-blur-md shadow-lg' : 'bg-header'}
      `}>
        <div className="cb-container h-20 sm:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none hover:opacity-90 transition-opacity group">
            <div className="flex items-baseline gap-0">
              <span className="logo-text text-3xl sm:text-4xl text-white tracking-tight">Clown</span>
              <span className="logo-text text-3xl sm:text-4xl text-secondary tracking-tight">Binge</span>
              <span className="text-white/40 text-2xl sm:text-3xl font-sans font-light mx-2">|</span>
              <span className="text-white/80 text-xl sm:text-2xl font-sans font-light tracking-normal">
                {postCount != null ? `${postCount.toLocaleString()} Records` : "The Record"}
              </span>
            </div>
            <span className="text-white/50 text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase mt-0.5 group-hover:text-white/70 transition-colors">
              Verified. Primary Sourced News. For The People.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
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

        {/* Category sub-bar -- always visible on every page */}
        <div className="bg-white border-b shadow-sm">
          <div className="cb-container">
            <div className="flex overflow-x-auto py-3 gap-2 sm:gap-4 no-scrollbar scroll-smooth">
              {CATEGORIES.map(cat => {
                const isActive = location === '/' && (activeCategory === cat.id || (!activeCategory && cat.id === 'all'));
                const isHero = cat.id === 'anti_racist_hero';
                const isCbExclusive = cat.id === 'cb_exclusive';
                const baseStyle = `shrink-0 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors`;
                const activeStyle = isCbExclusive
                  ? isActive
                    ? 'bg-green-600 text-white shadow-md ring-2 ring-green-600/40'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  : isHero
                  ? isActive ? 'bg-secondary text-gray-900 shadow-md ring-2 ring-secondary/50' : 'bg-secondary/80 text-gray-900 hover:bg-secondary'
                  : isActive ? 'bg-primary text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-border hover:text-foreground';
                const content = isCbExclusive ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-yellow-300 shrink-0" strokeWidth={3} />
                    CB Exclusive
                  </span>
                ) : cat.label;
                return onCategoryChange && location === '/' ? (
                  <button key={cat.id} onClick={() => onCategoryChange(cat.id)} className={`${baseStyle} ${activeStyle}`}>
                    {content}
                  </button>
                ) : (
                  <Link key={cat.id} href={cat.id === 'all' ? '/' : `/?category=${cat.id}`} className={`${baseStyle} ${activeStyle}`}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
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
            <Link href="/submit" className="text-2xl font-bold bg-secondary text-gray-900 uppercase tracking-widest px-8 py-3 rounded-full">Submit a Post</Link>
          </nav>
        </div>
      )}

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
                  <span className="text-white/80 text-xl font-sans font-light tracking-normal">
                    {postCount != null ? `${postCount.toLocaleString()} Records` : "The Record"}
                  </span>
                </div>
                <span className="text-white/50 text-[10px] font-mono tracking-[0.2em] uppercase mt-0.5">
                  Verified. Primary Sources. For The People.
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
    </div>
  );
}
