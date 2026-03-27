export function LoraItalic() {
  return (
    <div style={{ background: "#1A3A8F", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "6px", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
        <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontStyle: "italic", fontSize: "2.4rem", color: "#F5C518", letterSpacing: "-0.01em" }}>Citatious</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "1.8rem", fontWeight: 300, margin: "0 10px", fontStyle: "normal" }}>|</span>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "sans-serif" }}>Newsroom</span>
      </div>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
        Independent<span style={{ color: "#F5C518" }}>.</span> Verified<span style={{ color: "#F5C518" }}>.</span> The Primary Source<span style={{ color: "#F5C518" }}>.</span>
      </span>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", marginTop: "16px", fontFamily: "monospace" }}>↑ Lora Italic, title case — literary, refined</p>
    </div>
  );
}
