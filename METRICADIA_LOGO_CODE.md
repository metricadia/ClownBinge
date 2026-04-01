# Metricadia Logo — Code Instructions

Text-based lockup. No images. No SVG. Pure React + inline styles.
Copy the component below into the new Replit project and use it anywhere.

---

## What the Logo Looks Like

```
METRICADIA ━ RESEARCH  LLC
   navy      gold  near-black  gray
   bold      bar     bold    light
```

- **METRICADIA** — bold, navy blue (`#1A3A8F`), uppercase
- **━** — a small gold bar (`#C9A227`), floated slightly above baseline, not a text character
- **RESEARCH** — bold, near-black (`#111111`), uppercase
- **LLC** — regular weight, mid-gray (`#5A5A5A`), uppercase, extra letter-spacing

---

## Step 1 — Add the Google Font

In your `index.html`, inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

---

## Step 2 — The Component

Create `src/components/MetricadiaLogo.tsx`:

```tsx
interface MetricadiaLogoProps {
  /**
   * "dark" — navy + near-black text on a light background (default)
   * "white" — all white on a dark/navy background
   */
  variant?: "dark" | "white";
  /** Override the gold bar color. Defaults to #C9A227. */
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MetricadiaLogo({
  variant = "dark",
  accentColor,
  className = "",
  style,
}: MetricadiaLogoProps) {
  const isDark = variant === "dark";

  const navy  = isDark ? "#1A3A8F"             : "#ffffff";
  const heavy = isDark ? "#111111"             : "#ffffff";
  const light = isDark ? "#5A5A5A"             : "rgba(255,255,255,0.72)";
  const bar   = accentColor ?? "#C9A227";

  const base: React.CSSProperties = {
    fontFamily: "'Montserrat', sans-serif",
    textTransform: "uppercase",
    lineHeight: 1,
    letterSpacing: "0.01em",
    userSelect: "none",
    display: "inline-flex",
    alignItems: "baseline",
    ...style,
  };

  return (
    <span className={className} style={base}>
      {/* METRICADIA */}
      <span style={{ color: navy, fontWeight: 700 }}>
        Metricadia
      </span>

      {/* Gold bar separator — not a dash character, a styled block */}
      <span
        style={{
          display: "inline-block",
          width: "0.65em",
          height: "0.13em",
          background: bar,
          borderRadius: "2px",
          position: "relative",
          top: "-0.28em",
          margin: "0 0.08em",
          flexShrink: 0,
        }}
      />

      {/* RESEARCH */}
      <span style={{ color: heavy, fontWeight: 700 }}>
        Research
      </span>

      {/* LLC */}
      <span
        style={{
          color: light,
          fontWeight: 400,
          letterSpacing: "0.06em",
          marginLeft: "0.35em",
        }}
      >
        LLC
      </span>
    </span>
  );
}
```

---

## Step 3 — Usage Examples

```tsx
import { MetricadiaLogo } from "@/components/MetricadiaLogo";

// Standard — light background (default)
<MetricadiaLogo />

// Control font size via the style prop
<MetricadiaLogo style={{ fontSize: "2rem" }} />   // large hero
<MetricadiaLogo style={{ fontSize: "1.15rem" }} /> // navbar
<MetricadiaLogo style={{ fontSize: "0.85rem" }} /> // footer / small

// White variant — for navy or dark backgrounds
<MetricadiaLogo variant="white" />

// Custom accent bar color
<MetricadiaLogo accentColor="#F5C518" />

// With a Tailwind className
<MetricadiaLogo className="mb-6" style={{ fontSize: "1.5rem" }} />
```

---

## Step 4 — Recommended Font Sizes by Context

| Context        | `fontSize`   |
|----------------|--------------|
| Hero / H1      | `2.5rem`     |
| Navbar         | `1.2rem`     |
| Footer         | `1.1rem`     |
| Card / Badge   | `0.85rem`    |

Font size is the single control. Everything — the bar dimensions, spacing, weight — scales automatically because all measurements are in `em` units relative to the current font size.

---

## Step 5 — Favicon

The text logo does not work at favicon scale. Use a simple monogram instead.

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="16" fill="#1A3A8F"/>
  <text
    x="50" y="72"
    font-family="Montserrat, sans-serif"
    font-size="58"
    font-weight="800"
    text-anchor="middle"
    fill="#ffffff"
    letter-spacing="-2"
  >M</text>
  <rect x="58" y="28" width="18" height="5" rx="2" fill="#C9A227"/>
</svg>
```

In `index.html`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

---

## Brand Color Reference

| Name       | Hex       | Where it appears                     |
|------------|-----------|--------------------------------------|
| Navy       | `#1A3A8F` | "METRICADIA" text, backgrounds       |
| Gold       | `#C9A227` | The bar separator, accent highlights |
| Near-Black | `#111111` | "RESEARCH" text                      |
| Mid-Gray   | `#5A5A5A` | "LLC" text, secondary text           |
| White      | `#FFFFFF` | All text on dark backgrounds         |

---

## Key Design Notes

**The bar is not a dash character.** It is a styled `<span>` with `display: inline-block`, a fixed `em`-based width and height, and `position: relative; top: -0.28em` to float it above the text baseline. Using an em dash (`—`) or minus sign (`-`) will not produce the same result — the proportions and vertical position are specific.

**All sizing is in `em` units** so the logo scales perfectly at any font size with no adjustments needed.

**`alignItems: "baseline"`** on the container keeps "METRICADIA", the bar, "RESEARCH", and "LLC" all on a shared typographic baseline regardless of font size.

**`textTransform: "uppercase"`** is on the container, so you write `Metricadia`, `Research`, `LLC` in the JSX (easier to read) and CSS uppercases it for display.
