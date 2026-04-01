# Metricadia Logo — Code Instructions

Drop-in React + SVG component. No image files needed. No external dependencies beyond React.

---

## What the Logo Looks Like

Four 3D spheres in a 2×2 cluster on the left:
- Top-left: Gold
- Top-right: Charcoal/black
- Bottom-left: Silver/light gray
- Bottom-right: Navy blue

Text to the right:
- **METRICADIA** — bold, navy blue (#1A3A8F), uppercase
- **RESEARCH LLC** — regular weight, slate gray (#5A6A8A), uppercase, slight extra tracking

Font: Montserrat (Google Fonts). Falls back to system sans-serif.

---

## Step 1 — Add the Google Font

In your `index.html`, inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap"
  rel="stylesheet"
/>
```

---

## Step 2 — The Component

Create `src/components/MetricadiaLogo.tsx`:

```tsx
interface MetricadiaLogoProps {
  /** Height of the whole logo in pixels. Width scales automatically. Default: 40 */
  height?: number;
  /** "dark" = navy text on light background (default). "white" = all white on dark background. */
  variant?: "dark" | "white";
  className?: string;
}

export function MetricadiaLogo({
  height = 40,
  variant = "dark",
  className = "",
}: MetricadiaLogoProps) {
  const isWhite = variant === "white";

  // Colors
  const navyText  = isWhite ? "#FFFFFF" : "#1A3A8F";
  const grayText  = isWhite ? "rgba(255,255,255,0.72)" : "#5A6A8A";
  const sphereR   = height * 0.22; // sphere radius, scales with height
  const gap       = sphereR * 0.18; // gap between spheres
  const clusterW  = sphereR * 2 * 2 + gap; // total cluster width
  const clusterH  = sphereR * 2 * 2 + gap; // total cluster height
  const cx        = height * 0.014; // left padding

  // Sphere centers
  const s = {
    gold:   { cx: cx + sphereR,              cy: sphereR },
    black:  { cx: cx + sphereR * 2 + gap,    cy: sphereR },
    silver: { cx: cx + sphereR,              cy: sphereR * 2 + gap },
    navy:   { cx: cx + sphereR * 2 + gap,    cy: sphereR * 2 + gap },
  };

  const svgH   = clusterH;
  const svgW   = clusterW + cx * 2;

  const fontSize1 = height * 0.52;  // METRICADIA
  const fontSize2 = height * 0.34;  // RESEARCH LLC

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: height * 0.22,
        height,
        userSelect: "none",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Sphere cluster */}
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: "visible" }}
      >
        <defs>
          {/* Gold sphere gradient */}
          <radialGradient id="mg-gold" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#F5D98B" />
            <stop offset="45%"  stopColor="#C9A227" />
            <stop offset="100%" stopColor="#7A5C0A" />
          </radialGradient>

          {/* Black/charcoal sphere gradient */}
          <radialGradient id="mg-black" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#5A5A5A" />
            <stop offset="50%"  stopColor="#222222" />
            <stop offset="100%" stopColor="#080808" />
          </radialGradient>

          {/* Silver sphere gradient */}
          <radialGradient id="mg-silver" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#E8EBF0" />
            <stop offset="45%"  stopColor="#9BA5B5" />
            <stop offset="100%" stopColor="#4A5568" />
          </radialGradient>

          {/* Navy sphere gradient */}
          <radialGradient id="mg-navy" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#4A72D4" />
            <stop offset="45%"  stopColor="#1A3A8F" />
            <stop offset="100%" stopColor="#0A1A4A" />
          </radialGradient>
        </defs>

        {/* Gold — top left */}
        <circle cx={s.gold.cx}   cy={s.gold.cy}   r={sphereR} fill="url(#mg-gold)"   />

        {/* Charcoal — top right */}
        <circle cx={s.black.cx}  cy={s.black.cy}  r={sphereR} fill="url(#mg-black)"  />

        {/* Silver — bottom left */}
        <circle cx={s.silver.cx} cy={s.silver.cy} r={sphereR} fill="url(#mg-silver)" />

        {/* Navy — bottom right */}
        <circle cx={s.navy.cx}   cy={s.navy.cy}   r={sphereR} fill="url(#mg-navy)"   />
      </svg>

      {/* Text block */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1 }}>
        <span
          style={{
            fontSize: fontSize1,
            fontWeight: 800,
            color: navyText,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Metricadia
        </span>
        <span
          style={{
            fontSize: fontSize2,
            fontWeight: 400,
            color: grayText,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1,
            marginTop: height * 0.04,
          }}
        >
          Research LLC
        </span>
      </div>
    </div>
  );
}
```

---

## Step 3 — Usage Examples

```tsx
import { MetricadiaLogo } from "@/components/MetricadiaLogo";

// Standard size on white/light background
<MetricadiaLogo height={48} />

// Large hero lockup
<MetricadiaLogo height={72} />

// Small — footer or nav
<MetricadiaLogo height={32} />

// White variant — for dark/navy backgrounds
<MetricadiaLogo height={48} variant="white" />

// With custom className
<MetricadiaLogo height={48} className="my-8" />
```

---

## Step 4 — Favicon (SVG)

Create `public/favicon.svg` — the four-sphere mark only, no text:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="g" cx="35%" cy="30%" r="65%">
      <stop offset="0%"   stop-color="#F5D98B"/>
      <stop offset="50%"  stop-color="#C9A227"/>
      <stop offset="100%" stop-color="#7A5C0A"/>
    </radialGradient>
    <radialGradient id="b" cx="35%" cy="30%" r="65%">
      <stop offset="0%"   stop-color="#5A5A5A"/>
      <stop offset="60%"  stop-color="#1A1A1A"/>
      <stop offset="100%" stop-color="#080808"/>
    </radialGradient>
    <radialGradient id="s" cx="35%" cy="30%" r="65%">
      <stop offset="0%"   stop-color="#E8EBF0"/>
      <stop offset="50%"  stop-color="#9BA5B5"/>
      <stop offset="100%" stop-color="#4A5568"/>
    </radialGradient>
    <radialGradient id="n" cx="35%" cy="30%" r="65%">
      <stop offset="0%"   stop-color="#4A72D4"/>
      <stop offset="50%"  stop-color="#1A3A8F"/>
      <stop offset="100%" stop-color="#0A1A4A"/>
    </radialGradient>
  </defs>
  <!-- Gold top-left -->
  <circle cx="29" cy="29" r="26" fill="url(#g)"/>
  <!-- Black top-right -->
  <circle cx="71" cy="29" r="26" fill="url(#b)"/>
  <!-- Silver bottom-left -->
  <circle cx="29" cy="71" r="26" fill="url(#s)"/>
  <!-- Navy bottom-right -->
  <circle cx="71" cy="71" r="26" fill="url(#n)"/>
</svg>
```

In `index.html`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

---

## Brand Color Reference

| Name       | Hex       | Use                                      |
|------------|-----------|------------------------------------------|
| Navy       | `#1A3A8F` | Primary text, headings, sphere bottom-R  |
| Gold       | `#C9A227` | Accent, sphere top-L, highlights         |
| Charcoal   | `#1A1A2E` | Near-black backgrounds, sphere top-R     |
| Mid-Grey   | `#5A5A5A` | Body text, secondary text                |
| Slate      | `#5A6A8A` | "RESEARCH LLC" text                      |

---

## Notes

- The `height` prop controls everything — all sizes, spacing, and font sizes are derived from it proportionally. One prop to scale the whole logo.
- The `radialGradient` IDs (`mg-gold`, `mg-black`, `mg-silver`, `mg-navy`) are scoped to this SVG and will not conflict if you render the logo multiple times on the same page.
- If you render multiple logos on the same page (e.g., header + footer), add a unique `id` suffix to each gradient: `mg-gold-header`, `mg-gold-footer` — or extract the gradients into a shared `<defs>` in a root SVG sprite.
- No image files needed. No network requests. Pure code.
