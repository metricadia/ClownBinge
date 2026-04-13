import { useEffect } from "react";

export default function ComingSoon() {
  useEffect(() => {
    document.title = "ClownBinge — Coming Soon";
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .cs-body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          padding-bottom: 14vh;
          background: linear-gradient(170deg, #0a1628 0%, #0d1c3a 45%, #0b1a35 100%);
          font-family: 'Montserrat', system-ui, sans-serif;
          overflow: hidden;
          position: relative;
        }
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
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
        .card-wrap { position: relative; width: 100%; max-width: 384px; padding-top: 100px; z-index: 1; }
        .lion { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 260px; height: auto; z-index: 10; pointer-events: none; filter: drop-shadow(0 8px 32px rgba(201,162,39,0.35)) drop-shadow(0 2px 8px rgba(0,0,0,0.7)); }
        .card { border-radius: 1rem; padding: 80px 2rem 2.5rem; background: linear-gradient(160deg, rgba(26,44,85,0.97) 0%, rgba(18,30,62,0.99) 100%); border: 1px solid rgba(201,162,39,0.18); box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.65), 0 0 60px rgba(201,162,39,0.08); position: relative; overflow: hidden; }
        .card-glow { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 240px; height: 160px; background: radial-gradient(ellipse at top, rgba(201,162,39,0.10) 0%, transparent 70%); pointer-events: none; }
        .logo-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 1.25rem; }
        .psa-logo { display: inline-flex; align-items: baseline; font-family: Montserrat, system-ui, sans-serif; text-transform: uppercase; line-height: 1; letter-spacing: 0.01em; user-select: none; font-size: 1.1rem; margin-bottom: 0.5rem; }
        .psa-metricadia { color: #ffffff; font-weight: 700; }
        .psa-dot { display: inline-block; width: 0.65em; height: 0.13em; background: #C9A227; border-radius: 2px; position: relative; top: -0.28em; margin: 0 0.08em; flex-shrink: 0; }
        .psa-research { color: #ffffff; font-weight: 700; }
        .psa-llc { color: rgba(255,255,255,0.78); font-weight: 400; letter-spacing: 0.06em; margin-left: 0.35em; }
        .gold-rule { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,162,39,0.33), transparent); margin-bottom: 0.75rem; }
        .brain-badge { display: flex; flex-direction: column; align-items: center; gap: 3px; user-select: none; }
        .brain-name { display: flex; align-items: baseline; gap: 6px; }
        .brain-title { font-family: Montserrat, system-ui, sans-serif; font-weight: 700; font-size: 0.95rem; color: #C9A227; letter-spacing: 0.28em; text-transform: uppercase; }
        .brain-version { font-family: Montserrat, system-ui, sans-serif; font-weight: 300; font-size: 0.75rem; color: #C9A227; letter-spacing: 0.15em; }
        .brain-instance-row { display: flex; align-items: center; gap: 6px; }
        .brain-rule { height: 1px; width: 24px; background: rgba(255,255,255,0.35); }
        .brain-instance { font-family: Montserrat, system-ui, sans-serif; font-weight: 600; font-size: 0.52rem; color: #ffffff; letter-spacing: 0.22em; text-transform: uppercase; }
        .coming-body { display: flex; flex-direction: column; align-items: center; gap: 1.1rem; margin-top: 1rem; }
        .coming-headline { font-family: Montserrat, system-ui, sans-serif; font-weight: 700; font-size: 1.45rem; color: #F2E8D4; letter-spacing: 0.06em; text-transform: uppercase; text-align: center; }
        .coming-sub { font-family: Montserrat, system-ui, sans-serif; font-weight: 400; font-size: 0.78rem; color: rgba(242,232,212,0.6); letter-spacing: 0.04em; text-align: center; line-height: 1.6; max-width: 260px; }
        .coming-pill { display: inline-block; background: rgba(201,162,39,0.09); border: 1px solid rgba(201,162,39,0.28); border-radius: 999px; padding: 6px 18px; font-family: Montserrat, system-ui, sans-serif; font-weight: 600; font-size: 0.63rem; color: #C9A227; letter-spacing: 0.22em; text-transform: uppercase; }
        @keyframes barShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .shimmer-bar { width: 120px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, rgba(201,162,39,0.15) 0%, #C9A227 40%, #F0D458 55%, #C9A227 70%, rgba(201,162,39,0.15) 100%); background-size: 200% auto; animation: barShimmer 2.8s linear infinite; }
        .card-footer { text-align: center; margin-top: 1rem; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(201,162,39,0.6); user-select: none; }
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
          <path d="M -10 590 C 70 530, 55 450, 160 400 C 265 350, 370 420, 450 360 C 530 300, 495 195, 598 148 C 672 115, 748 155, 820 98 C 890 42, 958 20, 1010 5" fill="none" stroke="#D4A832" strokeWidth="5" strokeOpacity="0.055" />
          <path d="M -10 590 C 70 530, 55 450, 160 400 C 265 350, 370 420, 450 360 C 530 300, 495 195, 598 148 C 672 115, 748 155, 820 98 C 890 42, 958 20, 1010 5" fill="none" stroke="#F0D070" strokeWidth="1.0" strokeOpacity="0.18" filter="url(#vein-glow)" />
          <path d="M -10 30 C 80 80, 60 170, 170 220 C 280 270, 390 200, 470 260 C 550 320, 520 430, 620 470 C 710 505, 810 465, 890 520 C 950 562, 990 590, 1010 605" fill="none" stroke="#C8A230" strokeWidth="14" strokeOpacity="0.022" />
          <path d="M -10 30 C 80 80, 60 170, 170 220 C 280 270, 390 200, 470 260 C 550 320, 520 430, 620 470 C 710 505, 810 465, 890 520 C 950 562, 990 590, 1010 605" fill="none" stroke="#D4A832" strokeWidth="4" strokeOpacity="0.050" />
          <path d="M -10 30 C 80 80, 60 170, 170 220 C 280 270, 390 200, 470 260 C 550 320, 520 430, 620 470 C 710 505, 810 465, 890 520 C 950 562, 990 590, 1010 605" fill="none" stroke="#F0D070" strokeWidth="0.8" strokeOpacity="0.15" filter="url(#vein-glow)" />
          <path d="M 200 -10 C 180 60, 240 120, 210 200 C 180 280, 100 310, 120 400 C 140 480, 220 500, 190 590 C 175 620, 155 640, 140 620" fill="none" stroke="#D4A832" strokeWidth="3" strokeOpacity="0.04" />
          <path d="M 200 -10 C 180 60, 240 120, 210 200 C 180 280, 100 310, 120 400 C 140 480, 220 500, 190 590 C 175 620, 155 640, 140 620" fill="none" stroke="#F0D070" strokeWidth="0.6" strokeOpacity="0.13" filter="url(#vein-glow)" />
          <path d="M 820 -10 C 845 50, 780 110, 810 190 C 840 270, 920 300, 900 390 C 880 470, 800 490, 830 580 C 848 620, 870 635, 860 615" fill="none" stroke="#D4A832" strokeWidth="3" strokeOpacity="0.035" />
          <path d="M 820 -10 C 845 50, 780 110, 810 190 C 840 270, 920 300, 900 390 C 880 470, 800 490, 830 580 C 848 620, 870 635, 860 615" fill="none" stroke="#F0D070" strokeWidth="0.55" strokeOpacity="0.12" filter="url(#vein-glow)" />
          <path d="M -10 480 C 80 460, 140 510, 240 495 C 340 480, 370 420, 480 438 C 590 456, 630 510, 740 500 C 840 490, 910 450, 1010 465" fill="none" stroke="#C8A230" strokeWidth="12" strokeOpacity="0.020" />
          <path d="M -10 480 C 80 460, 140 510, 240 495 C 340 480, 370 420, 480 438 C 590 456, 630 510, 740 500 C 840 490, 910 450, 1010 465" fill="none" stroke="#D4A832" strokeWidth="3.5" strokeOpacity="0.045" />
          <path d="M -10 480 C 80 460, 140 510, 240 495 C 340 480, 370 420, 480 438 C 590 456, 630 510, 740 500 C 840 490, 910 450, 1010 465" fill="none" stroke="#F0D070" strokeWidth="0.7" strokeOpacity="0.14" filter="url(#vein-glow)" />
          <path d="M -10 110 C 100 90, 150 148, 260 135 C 370 122, 400 60, 520 78 C 640 96, 670 162, 790 148 C 890 137, 960 95, 1010 108" fill="none" stroke="#C8A230" strokeWidth="10" strokeOpacity="0.018" />
          <path d="M -10 110 C 100 90, 150 148, 260 135 C 370 122, 400 60, 520 78 C 640 96, 670 162, 790 148 C 890 137, 960 95, 1010 108" fill="none" stroke="#D4A832" strokeWidth="3" strokeOpacity="0.040" />
          <path d="M -10 110 C 100 90, 150 148, 260 135 C 370 122, 400 60, 520 78 C 640 96, 670 162, 790 148 C 890 137, 960 95, 1010 108" fill="none" stroke="#F0D070" strokeWidth="0.6" strokeOpacity="0.12" filter="url(#vein-glow)" />
        </svg>

        <div className="glow-wrap">
          <div className="glow-blue"></div>
          <div className="glow-brown"></div>
        </div>

        <div className="card-wrap">
          <img className="lion" src="/brain-lion.png" alt="Metricadia Brain" />
          <div className="card">
            <div className="card-glow"></div>
            <div className="logo-section">
              <div className="psa-logo">
                <span className="psa-metricadia">Metricadia</span>
                <span className="psa-dot"></span>
                <span className="psa-research">Research</span>
                <span className="psa-llc">LLC</span>
              </div>
            </div>
            <div className="coming-body">
              <div className="shimmer-bar"></div>
              <p className="coming-headline">Coming Soon = ClownBinge</p>
              <p className="coming-sub">
                Next Generation Information Innovation<br />
                <br />
                Accountability journalism.<br />
                Primary sources. No performance.<br />
                <br />
                The record is being prepared.
              </p>
              <span className="coming-pill">Launching shortly</span>
            </div>
          </div>
          <p className="card-footer">Metricadia Research LLC &mdash; All Rights Reserved</p>
        </div>
      </div>
    </>
  );
}
