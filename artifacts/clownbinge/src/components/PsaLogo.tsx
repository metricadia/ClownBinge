interface PsaLogoProps {
  variant: "dark" | "white";
  className?: string;
  style?: React.CSSProperties;
}

export function PsaLogo({ variant, className = "", style }: PsaLogoProps) {
  const isDark = variant === "dark";

  const heavy   = isDark ? "#111111"              : "#ffffff";
  const navy    = isDark ? "#1A3A8F"              : "#ffffff";
  const light   = isDark ? "#5A5A5A"              : "rgba(255,255,255,0.78)";
  const dot     = "#C9A227";

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
      <span style={{ color: heavy, fontWeight: 700 }}>Primary</span>
      <span
        style={{
          color: dot,
          fontWeight: 700,
          fontSize: "1.1em",
          lineHeight: 0,
          position: "relative",
          top: "0.08em",
          margin: "0",
        }}
      >
        .
      </span>
      <span style={{ color: navy, fontWeight: 700 }}>Source</span>
      <span
        style={{
          color: light,
          fontWeight: 400,
          letterSpacing: "0.06em",
          marginLeft: "0.35em",
        }}
      >
        Analytics
      </span>
    </span>
  );
}
