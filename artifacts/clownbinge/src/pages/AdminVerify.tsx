import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminVerify() {
  const [, setLocation] = useLocation();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const otp = digits.join("");

  const handleDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed.");

      const uuid = data.token as string;

      const activateRes = await fetch(`/api/admin/activate/${uuid}`, {
        credentials: "include",
      });
      const activateData = await activateRes.json();
      if (!activateRes.ok) throw new Error(activateData.error ?? "Activation failed.");

      sessionStorage.setItem("metricadia_token", activateData.token);
      sessionStorage.setItem("metricadia_authenticated", "true");
      setLocation("/Kemet8");
    } catch (err: any) {
      setError(err.message ?? "An error occurred.");
      setDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };

  const boxStyle = (filled: boolean): React.CSSProperties => ({
    width: "44px",
    height: "52px",
    background: filled ? "rgba(201,162,39,0.08)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${filled ? "rgba(201,162,39,0.4)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "0.5rem",
    color: "#F2E8D4",
    fontSize: "1.4rem",
    fontWeight: 700,
    textAlign: "center",
    outline: "none",
    transition: "all 0.15s",
    fontFamily: "'Montserrat', system-ui, sans-serif",
  });

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
            Enter Code
          </h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem", lineHeight: 1.6 }}>
            Check your admin email for the 6-digit code.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "1.5rem" }} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={boxStyle(!!d)}
                disabled={loading}
              />
            ))}
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
            type="submit"
            disabled={otp.length !== 6 || loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: otp.length === 6 && !loading ? "rgba(201,162,39,0.14)" : "rgba(201,162,39,0.05)",
              border: "1px solid rgba(201,162,39,0.35)",
              borderRadius: "0.5rem",
              color: otp.length === 6 && !loading ? "rgba(201,162,39,0.9)" : "rgba(201,162,39,0.35)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: otp.length === 6 && !loading ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              marginBottom: "1rem",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Verifying…" : "Verify & Enter"}
          </button>

          <button
            type="button"
            onClick={() => setLocation("/admin-access")}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: "0.25rem",
            }}
          >
            Request new code
          </button>
        </form>
      </div>
    </div>
  );
}
