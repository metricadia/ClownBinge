interface PsaLogoProps {
  variant: "dark" | "white";
  className?: string;
  style?: React.CSSProperties;
}

export function PsaLogo({ variant, className = "", style }: PsaLogoProps) {
  const isDark = variant === "dark";

  const navy    = isDark ? "#1A3A8F"              : "#ffffff";
  const heavy   = isDark ? "#111111"              : "#ffffff";
  const light   = isDark ? "#5A5A5A"              : "rgba(255,255,255,0.78)";
  const dot     = isDark ? "#C9A227"              : "#ffffff";

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
      <span style={{ color: navy, fontWeight: 700 }}>Metricadia</span>
      <span
        style={{
          display: "inline-block",
          width: "0.65em",
          height: "0.13em",
          background: dot,
          borderRadius: "2px",
          position: "relative",
          top: "-0.28em",
          margin: "0 0.08em",
          flexShrink: 0,
        }}
      />
      <span style={{ color: heavy, fontWeight: 700 }}>Research</span>
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
