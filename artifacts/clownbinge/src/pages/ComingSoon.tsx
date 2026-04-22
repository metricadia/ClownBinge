import { useEffect } from "react";

function MetricadiaLogo() {
  return (
    <div style={{
      fontFamily: "'Montserrat', system-ui, sans-serif",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      fontSize: "1rem",
      lineHeight: 1,
      color: "#ffffff",
      whiteSpace: "nowrap",
    }}>
      <span>Metricadia</span>
      <span style={{ color: "#C9A227", fontWeight: 300, margin: "0 0.16em" }}>—</span>
      <span>Research</span>
      <span style={{
        fontWeight: 400,
        fontSize: "0.68em",
        color: "rgba(255,255,255,0.48)",
        letterSpacing: "0.2em",
        marginLeft: "0.4em",
        verticalAlign: "middle",
      }}>LLC</span>
    </div>
  );
}

export default function ComingSoon() {
  useEffect(() => {
    document.title = "ClownBinge — Coming Soon";
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800;900&display=swap');

        .cs-root {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(160deg, #080f22 0%, #0c1836 40%, #0a1428 75%, #06101e 100%);
          font-family: 'Montserrat', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .cs-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
          background-image: linear-gradient(#C9A227 1px, transparent 1px),
                            linear-gradient(90deg, #C9A227 1px, transparent 1px);
          background-size: 52px 52px;
        }

        .cs-glow-tl {
          position: absolute; pointer-events: none;
          width: 620px; height: 620px; border-radius: 50%;
          background: #0d2260; opacity: 0.5;
          top: -18%; left: -12%; filter: blur(190px);
        }
        .cs-glow-br {
          position: absolute; pointer-events: none;
          width: 440px; height: 440px; border-radius: 50%;
          background: #091440; opacity: 0.38;
          bottom: -12%; right: -10%; filter: blur(150px);
        }

        .cs-veins {
          position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
        }

        /* Top-left logo bar */
        .cs-topbar {
          position: absolute;
          top: 1.75rem; left: 2rem;
          display: flex; align-items: center; gap: 10px;
          z-index: 20;
        }
        .cs-flags {
          display: flex; align-items: center; gap: 3px;
          font-size: 13px; margin-top: 1px; opacity: 0.85;
        }

        /* Center column */
        .cs-center {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          flex: 1;
          padding: 5rem 1rem 0;
        }

        /* Founders image — large, centered, dissolving into background */
        .cs-founders {
          position: relative;
          width: 100%;
          max-width: 700px;
          height: 52vh;
          min-height: 280px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .cs-founders img {
          height: 125%;
          width: auto;
          object-fit: contain;
          object-position: bottom center;
          display: block;
          -webkit-mask-image: radial-gradient(ellipse 72% 82% at 50% 52%, black 20%, rgba(0,0,0,0.6) 45%, transparent 72%);
          mask-image: radial-gradient(ellipse 72% 82% at 50% 52%, black 20%, rgba(0,0,0,0.6) 45%, transparent 72%);
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Text content — below founders, centered */
        .cs-content {
          position: relative;
          z-index: 6;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 1rem 2.5rem;
          margin-top: -1rem;
        }

        .cs-eyebrow {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(201,162,39,0.7);
          margin-bottom: 0.7rem;
        }

        .cs-headline {
          font-size: clamp(2.8rem, 7vw, 5rem);
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          line-height: 1;
          text-shadow: 0 0 60px rgba(201,162,39,0.12), 0 2px 24px rgba(0,0,0,0.6);
          margin-bottom: 0.5rem;
        }

        .cs-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(201,162,39,0.07);
          border: 1px solid rgba(201,162,39,0.28);
          border-radius: 999px;
          padding: 7px 20px;
          font-size: 0.57rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(201,162,39,0.88);
          margin-bottom: 1.6rem;
          margin-top: 1rem;
        }
        .cs-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #C9A227;
          animation: dotpulse 2.2s ease-in-out infinite;
        }
        @keyframes dotpulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.65); }
        }

        /* Access links */
        .cs-links {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .cs-link-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          padding: 6px 16px;
          transition: color 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .cs-link-btn:hover { color: #C9A227; }
        .cs-link-sep {
          width: 1px;
          height: 14px;
          background: rgba(255,255,255,0.18);
        }

        /* Bottom copyright */
        .cs-copyright {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 1.2rem 1rem;
          font-size: 8.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(201,162,39,0.32);
          width: 100%;
        }
      `}</style>

      <div className="cs-root">
        <div className="cs-grid" />
        <div className="cs-glow-tl" />
        <div className="cs-glow-br" />

        <svg className="cs-veins" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="vg" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <path d="M -20 820 C 100 750, 90 640, 240 570 C 390 500, 540 590, 660 510 C 780 430, 730 280, 880 210 C 980 165, 1090 220, 1200 145 C 1310 70, 1400 30, 1460 10" fill="none" stroke="#F0D070" strokeWidth="0.9" strokeOpacity="0.14" filter="url(#vg)" />
          <path d="M -20 40 C 110 110, 95 240, 250 310 C 405 380, 565 280, 680 370 C 795 460, 760 620, 900 685 C 1020 740, 1160 680, 1280 750 C 1380 810, 1430 860, 1460 880" fill="none" stroke="#F0D070" strokeWidth="0.7" strokeOpacity="0.12" filter="url(#vg)" />
        </svg>

        {/* Top-left logo */}
        <div className="cs-topbar">
          <MetricadiaLogo />
          <div className="cs-flags">
            <span title="Saint Kitts and Nevis">🇰🇳</span>
            <span title="United States">🇺🇸</span>
            <span title="Iceland">🇮🇸</span>
          </div>
        </div>

        {/* Centered hero */}
        <div className="cs-center">
          <div className="cs-founders">
            <img src="/founders-nobg.png" alt="Metricadia founders" />
          </div>

          <div className="cs-content">
            <p className="cs-eyebrow">A Metricadia Research Publication</p>
            <h1 className="cs-headline"><span style={{ color: "#F2E8D4" }}>Clown</span><span style={{ color: "#C9A227" }}>Binge</span></h1>

            <span className="cs-pill">
              <span className="cs-dot" />
              Coming Soon
            </span>

            <div className="cs-links">
              <button className="cs-link-btn" onClick={() => { window.location.href = "/admin-access"; }}>
                Admin Access
              </button>
              <span className="cs-link-sep" />
              <a
                className="cs-link-btn"
                href="mailto:clownbinge@metricadia.com"
              >
                Contact Metricadia
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="cs-copyright">
          &copy; 2026 Metricadia-Research LLC &mdash; All Rights Reserved
        </p>
      </div>
    </>
  );
}
