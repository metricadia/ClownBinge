import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminGate() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/request-otp", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send OTP.");
      setLocation("/admin-access/verify");
    } catch (err: any) {
      setError(err.message ?? "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#08122E",
      fontFamily: "'Montserrat', system-ui, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "380px",
        background: "linear-gradient(160deg, rgba(16,28,62,0.98) 0%, rgba(10,20,48,1) 100%)",
        border: "1px solid rgba(201,162,39,0.20)",
        borderRadius: "1rem",
        padding: "2.5rem 2rem",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,162,39,0.7)", marginBottom: "0.5rem" }}>
            Metricadia Research LLC
          </p>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#F2E8D4", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
            Admin Access
          </h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem", lineHeight: 1.6 }}>
            A one-time code will be sent to the registered admin address.
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.25)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            fontSize: "0.75rem",
            color: "#fca5a5",
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleRequest}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: loading ? "rgba(201,162,39,0.12)" : "rgba(201,162,39,0.14)",
            border: "1px solid rgba(201,162,39,0.35)",
            borderRadius: "0.5rem",
            color: loading ? "rgba(201,162,39,0.5)" : "rgba(201,162,39,0.9)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Sending…" : "Send Access Code"}
        </button>
      </div>
    </div>
  );
}
