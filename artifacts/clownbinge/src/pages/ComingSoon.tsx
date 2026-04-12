import { useEffect } from "react";

export default function ComingSoon() {
  useEffect(() => {
    document.title = "ClownBinge";
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#080d1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      color: "#fff",
      overflow: "hidden",
      position: "relative"
    }}>
      <div style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.35em",
        color: "rgba(255,255,255,0.45)",
        textTransform: "uppercase",
        marginBottom: "14px"
      }}>
        <span style={{ color: "#c9a84c" }}>METRICADIA</span> &mdash; RESEARCH LLC
      </div>

      <div style={{
        fontSize: "clamp(34px, 5.5vw, 54px)",
        fontWeight: 800,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "16px",
        fontSize: "52px"
      }}>
        ClownBinge
      </div>

      <div style={{
        width: "90px",
        height: "1px",
        background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        margin: "0 auto 16px"
      }} />

      <div style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: "16px",
        color: "rgba(255,255,255,0.5)",
        textAlign: "center",
        maxWidth: "360px",
        lineHeight: 1.7
      }}>
        Creative minds are busy nerding out.
      </div>

      <div style={{
        position: "fixed",
        bottom: "22px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "9px",
        letterSpacing: "0.3em",
        color: "rgba(201,168,76,0.2)",
        textTransform: "uppercase"
      }}>
        Restricted Access
      </div>
    </div>
  );
}
