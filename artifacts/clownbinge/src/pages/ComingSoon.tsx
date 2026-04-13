import { useEffect } from "react";

export default function ComingSoon() {
  useEffect(() => {
    document.title = "ClownBinge — Coming Soon";
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap');
        .cs-body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: linear-gradient(170deg, #0a1628 0%, #0d1c3a 45%, #0b1a35 100%);
          font-family: 'Montserrat', system-ui, sans-serif;
          overflow: hidden;
          position: relative;
        }
        .grid-overlay {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image: linear-gradient(#C9A227 1px, transparent 1px), linear-gradient(90deg, #C9A227 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes veinPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        .vein-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; animation: veinPulse 9s ease-in-out infinite; }
        .glow-wrap { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .glow-blue { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: #1a3060; opacity: 0.5; top: -15%; left: -10%; filter: blur(160px); }
        .glow-brown { position: absolute; width: 320px; height: 320px; border-radius: 50%; background: #2a1800; opacity: 0.35; bottom: 0%; right: -5%; filter: blur(120px); }

        .card-wrap { position: relative; width: 100%; max-width: 460px; padding-top: 110px; z-index: 1; }
        .lion { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 240px; height: auto; z-index: 10; pointer-events: none; filter: drop-shadow(0 8px 32px rgba(201,162,39,0.35)) drop-shadow(0 2px 8px rgba(0,0,0,0.7)); }

        .card {
          border-radius: 1.25rem;
          padding: 80px 2.5rem 2.5rem;
          background: linear-gradient(160deg, rgba(20,34,72,0.98) 0%, rgba(14,24,52,1) 100%);
          border: 1px solid rgba(201,162,39,0.20);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,162,39,0.08);
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        /* Subtle warm glow at top of card where lion meets card */
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 120px;
          background: radial-gradient(ellipse at 50% 0%, rgba(160,100,20,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Company name — the main identity */
        .company-name {
          font-family: Montserrat, system-ui, sans-serif;
          font-weight: 800;
          font-size: 1.55rem;
          color: #ffffff;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 0.3rem;
          position: relative;
          white-space: nowrap;
        }
        .company-name .dash { color: #C9A227; font-weight: 300; margin: 0 0.05em; }
        .company-llc {
          font-size: 0.85rem;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: Montserrat, system-ui, sans-serif;
          display: block;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent);
          margin-bottom: 1.75rem;
          position: relative;
        }

        /* Product name — secondary but bold */
        .product-name {
          font-family: Montserrat, system-ui, sans-serif;
          font-weight: 700;
          font-size: 2.1rem;
          color: #F2E8D4;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-shadow: 0 0 40px rgba(201,162,39,0.20);
          margin-bottom: 1.75rem;
          position: relative;
        }

        .pill {
          display: inline-block;
          background: rgba(201,162,39,0.08);
          border: 1px solid rgba(201,162,39,0.30);
          border-radius: 999px;
          padding: 7px 22px;
          font-family: Montserrat, system-ui, sans-serif;
          font-weight: 600;
          font-size: 0.6rem;
          color: rgba(201,162,39,0.9);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          position: relative;
        }

        .card-footer {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(201,162,39,0.45);
          user-select: none;
          font-family: Montserrat, system-ui, sans-serif;
        }
      `}</style>

      <div className="cs-body">
        <div className="grid-overlay"></div>

        <svg className="vein-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="vein-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <path d="M -10 590 C 70 530, 55 450, 160 400 C 265 350, 370 420, 450 360 C 530 300, 495 195, 598 148 C 672 115, 748 155, 820 98 C 890 42, 958 20, 1010 5" fill="none" stroke="#C8A230" strokeWidth="18" strokeOpacity="0.025" />
          <path d="M -10 590 C 70 530, 55 450, 160 400 C 265 350, 370 420, 450 360 C 530 300, 495 195, 598 148 C 672 115, 748 155, 820 98 C 890 42, 958 20, 1010 5" fill="none" stroke="#F0D070" strokeWidth="1.0" strokeOpacity="0.18" filter="url(#vein-glow)" />
          <path d="M -10 30 C 80 80, 60 170, 170 220 C 280 270, 390 200, 470 260 C 550 320, 520 430, 620 470 C 710 505, 810 465, 890 520 C 950 562, 990 590, 1010 605" fill="none" stroke="#C8A230" strokeWidth="14" strokeOpacity="0.022" />
          <path d="M -10 30 C 80 80, 60 170, 170 220 C 280 270, 390 200, 470 260 C 550 320, 520 430, 620 470 C 710 505, 810 465, 890 520 C 950 562, 990 590, 1010 605" fill="none" stroke="#F0D070" strokeWidth="0.8" strokeOpacity="0.15" filter="url(#vein-glow)" />
          <path d="M -10 480 C 80 460, 140 510, 240 495 C 340 480, 370 420, 480 438 C 590 456, 630 510, 740 500 C 840 490, 910 450, 1010 465" fill="none" stroke="#F0D070" strokeWidth="0.7" strokeOpacity="0.14" filter="url(#vein-glow)" />
        </svg>

        <div className="glow-wrap">
          <div className="glow-blue"></div>
          <div className="glow-brown"></div>
        </div>

        <div className="card-wrap">
          <img className="lion" src="/brain-lion.png" alt="Metricadia" />
          <div className="card">
            <p className="company-name">Metricadia<span className="dash">—</span>Research</p>
            <span className="company-llc">LLC</span>
            <div className="divider"></div>
            <p className="product-name">ClownBinge</p>
            <span className="pill">Launching Shortly</span>
          </div>
          <p className="card-footer">Metricadia Research LLC &mdash; All Rights Reserved</p>
        </div>
      </div>
    </>
  );
}
