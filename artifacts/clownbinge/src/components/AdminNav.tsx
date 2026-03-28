import { Link, useLocation } from "wouter";

const ADMIN_LINKS = [
  { href: "/about",        label: "About" },
  { href: "/ethics",       label: "Ethics Policy" },
  { href: "/privacy",      label: "Privacy & Free Speech" },
  { href: "/terms",        label: "Terms of Service" },
  { href: "/contact",      label: "Contact" },
  { href: "/invest-in-us", label: "Support Us" },
  { href: "/submit",       label: "Submit a Tip" },
];

export function AdminNav() {
  const [location] = useLocation();

  return (
    <nav className="flex items-center flex-wrap gap-x-1 gap-y-1.5 mb-10">
      {ADMIN_LINKS.map(({ href, label }, i) => {
        const isActive = location === href || (href === "/contact" && location === "/advertise");
        return (
          <span key={href} className="flex items-center gap-1">
            <Link
              href={href}
              className={`text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              {label}
            </Link>
            {i < ADMIN_LINKS.length - 1 && (
              <span className="text-border text-xs select-none">·</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
