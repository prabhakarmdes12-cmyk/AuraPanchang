import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── STYLE ───────────────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Cormorant:wght@300;400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Noto+Sans+Devanagari:wght@300;400;500;600&family=Noto+Sans+Gujarati:wght@300;400;500&family=Noto+Sans+Bengali:wght@300;400;500&display=swap');

  :root {
    --void: #04050A;
    --deep: #070810;
    --panel: #0C0D18;
    --card: #0F1020;
    --gold: #C8902A;
    --gold-l: #E5B04A;
    --gold-p: #F2D080;
    --gold-d: rgba(200,144,42,0.12);
    --saffron: #D06025;
    --lotus: #B85580;
    --lotus-l: #D8729A;
    --teal: #18BAB3;
    --teal-d: rgba(24,186,179,0.1);
    --moon: #EAD8C0;
    --moon-d: rgba(234,216,192,0.45);
    --ink: rgba(234,216,192,0.06);
    --ink2: rgba(234,216,192,0.1);
    --ink3: rgba(234,216,192,0.16);
    --border: rgba(200,144,42,0.12);
    --border2: rgba(200,144,42,0.22);
    --power: #FFD700;
    --caution: #FF6B6B;
    --power-d: rgba(255,215,0,0.12);
    --caution-d: rgba(255,107,107,0.1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--void); color: var(--moon); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* ── AMBIENT ── */
  .ap-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 15% 0%, rgba(200,144,42,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 100%, rgba(184,85,128,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(24,186,179,0.03) 0%, transparent 70%);
  }
  .ap-noise {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.4;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }

  /* ── LAYOUT ── */
  .ap-root { position: relative; z-index: 1; max-width: 1300px; margin: 0 auto; padding: 0 12px 100px; }

  /* ── HEADER ── */
  .ap-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0 10px; gap: 8px; flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
  }
  .ap-logo-wrap { display: flex; align-items: center; gap: 10px; }
  .ap-logo-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, var(--saffron), var(--gold));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; box-shadow: 0 0 16px rgba(200,144,42,0.35);
  }
  .ap-logo-text {
    font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700;
    background: linear-gradient(135deg, var(--gold-p), var(--gold-l));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 1px;
  }
  .ap-logo-sub { font-size: 8px; letter-spacing: 3px; color: rgba(200,144,42,0.4); text-transform: uppercase; margin-top: -2px; }

  .ap-topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  /* Lang switcher */
  .lang-switcher {
    display: flex; gap: 2px; background: var(--ink); border: 1px solid var(--border);
    border-radius: 20px; padding: 3px; overflow-x: auto; scrollbar-width: none;
  }
  .lang-switcher::-webkit-scrollbar { display: none; }
  .lang-btn {
    padding: 5px 12px; border-radius: 16px; background: none; border: none;
    color: rgba(234,216,192,0.4); cursor: pointer; font-size: 12px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; white-space: nowrap; transition: all 0.2s;
  }
  .lang-btn.active {
    background: linear-gradient(135deg, rgba(200,144,42,0.2), rgba(208,96,37,0.15));
    color: var(--gold-p); border: 1px solid rgba(200,144,42,0.25);
  }

  /* My Days toggle */
  .mydays-toggle {
    display: flex; align-items: center; gap: 8px; padding: 7px 14px;
    background: var(--ink); border: 1px solid var(--border);
    border-radius: 20px; cursor: pointer; transition: all 0.2s; user-select: none;
  }
  .mydays-toggle.on {
    background: var(--power-d); border-color: rgba(255,215,0,0.35);
  }
  .mydays-toggle-label { font-size: 12px; font-weight: 500; color: rgba(234,216,192,0.5); }
  .mydays-toggle.on .mydays-toggle-label { color: var(--power); }
  .toggle-pill {
    width: 32px; height: 16px; border-radius: 8px; background: var(--ink2);
    position: relative; transition: background 0.2s;
  }
  .mydays-toggle.on .toggle-pill { background: rgba(255,215,0,0.3); }
  .toggle-thumb {
    width: 12px; height: 12px; border-radius: 50%; background: rgba(234,216,192,0.3);
    position: absolute; top: 2px; left: 2px; transition: all 0.2s;
  }
  .mydays-toggle.on .toggle-thumb { left: 18px; background: var(--power); box-shadow: 0 0 6px rgba(255,215,0,0.5); }

  /* Profile button */
  .profile-btn {
    width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; border: 2px solid var(--border); transition: all 0.2s;
    background: var(--ink); position: relative;
  }
  .profile-btn.has-profile { border-color: var(--gold); background: var(--gold-d); }
  .profile-btn.has-profile::after {
    content: ''; position: absolute; top: -2px; right: -2px;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--teal); border: 2px solid var(--void);
  }
  .profile-btn:hover { border-color: var(--gold-l); transform: scale(1.08); }

  /* ── SAMVAT STRIP ── */
  .samvat-strip {
    display: flex; align-items: center; gap: 0;
    border-bottom: 1px solid var(--border); overflow-x: auto; scrollbar-width: none;
    background: linear-gradient(to right, rgba(200,144,42,0.03), transparent);
  }
  .samvat-strip::-webkit-scrollbar { display: none; }
  .sv-item {
    display: flex; flex-direction: column; align-items: center;
    padding: 6px 14px; border-right: 1px solid var(--border); flex-shrink: 0;
    min-width: fit-content;
  }
  .sv-item:last-child { border-right: none; }
  .sv-label { font-size: 7px; letter-spacing: 2px; text-transform: uppercase; color: rgba(234,216,192,0.25); font-family: 'Cormorant', serif; }
  .sv-value { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-weight: 600; color: var(--gold-p); }

  /* ── MONTH NAVIGATION ── */
  .month-nav {
    display: grid; grid-template-columns: 56px 1fr 56px;
    align-items: center; padding: 20px 0 16px; gap: 12px;
  }
  .mnav-btn {
    width: 52px; height: 52px; border-radius: 50%; background: var(--ink);
    border: 1px solid var(--border); color: var(--gold-l); font-size: 22px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; font-family: 'Cormorant Garamond', serif;
  }
  .mnav-btn:hover { background: var(--gold-d); border-color: var(--gold); transform: scale(1.08); }
  .month-center { text-align: center; }
  .month-en {
    font-family: 'Cormorant Garamond', serif; font-weight: 300;
    font-size: clamp(32px, 7vw, 60px); letter-spacing: 10px; text-transform: uppercase;
    color: var(--moon); line-height: 1; position: relative; display: inline-block;
  }
  .month-en::after {
    content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .month-hi {
    font-family: 'Noto Sans Devanagari', sans-serif; font-size: 15px; font-weight: 300;
    color: rgba(234,216,192,0.35); letter-spacing: 4px; margin-top: 6px; display: block;
  }
  .month-badge {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 10px;
    background: var(--gold-d); border: 1px solid rgba(200,144,42,0.2);
    border-radius: 20px; padding: 4px 14px;
    font-family: 'Cormorant', serif; font-size: 12px; color: var(--gold-p); letter-spacing: 1px;
  }
  .month-season {
    display: flex; align-items: center; justify-content: center;
    gap: 16px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(234,216,192,0.25); padding-bottom: 14px; font-family: 'Cormorant', serif;
  }
  .month-season em { color: var(--gold-l); font-style: normal; }

  /* ── PERSONAL ENERGY STRIP ── */
  .energy-strip {
    display: flex; align-items: center; gap: 10px; padding: 10px 16px;
    background: var(--power-d); border: 1px solid rgba(255,215,0,0.2);
    border-radius: 14px; margin-bottom: 12px;
    animation: energyPulse 3s ease-in-out infinite;
  }
  @keyframes energyPulse {
    0%,100% { box-shadow: 0 0 10px rgba(255,215,0,0.1); }
    50% { box-shadow: 0 0 20px rgba(255,215,0,0.2); }
  }
  .energy-strip-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--saffron));
    display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
  }
  .energy-strip-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 600; color: var(--gold-p); }
  .energy-strip-sub { font-size: 11px; color: rgba(234,216,192,0.45); }
  .energy-pills { display: flex; gap: 6px; margin-left: auto; flex-wrap: wrap; }
  .energy-pill {
    padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600;
    letter-spacing: 0.5px; white-space: nowrap; font-family: 'Cormorant', serif;
  }
  .ep-power { background: rgba(255,215,0,0.15); color: var(--power); border: 1px solid rgba(255,215,0,0.3); }
  .ep-caution { background: rgba(255,107,107,0.12); color: var(--caution); border: 1px solid rgba(255,107,107,0.25); }
  .ep-soul { background: rgba(24,186,179,0.1); color: var(--teal); border: 1px solid rgba(24,186,179,0.25); }

  /* ── WEEKDAY HEADERS ── */
  .wday-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 2px; }
  .wday-cell { padding: 8px 6px; text-align: center; border-bottom: 1px solid var(--border); }
  .wday-hi { font-family: 'Noto Sans Devanagari', sans-serif; font-size: 13px; color: var(--gold); display: block; font-weight: 500; }
  .wday-en { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: rgba(234,216,192,0.22); display: block; margin-top: 2px; }
  .wday-pl { font-size: 7px; color: rgba(234,216,192,0.15); display: block; margin-top: 1px; }

  /* ── CALENDAR GRID ── */
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }

  /* ── DAY CELL ── */
  .dc {
    min-height: 108px; padding: 9px 9px 0; position: relative;
    cursor: pointer; overflow: hidden; border: 1px solid var(--border);
    transition: all 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex; flex-direction: column; background: var(--deep);
    animation: cellIn 0.3s ease both;
  }
  @keyframes cellIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  .dc.sp { background: linear-gradient(160deg, rgba(200,144,42,0.03) 0%, var(--deep) 100%); }
  .dc.kp { background: linear-gradient(160deg, rgba(70,90,200,0.05) 0%, var(--deep) 100%); }
  .dc.empty { opacity: 0.15; pointer-events: none; background: var(--void); }
  .dc:hover { border-color: rgba(200,144,42,0.4); background: rgba(200,144,42,0.06); transform: scale(1.025); z-index: 5; box-shadow: 0 8px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,144,42,0.25); }
  .dc.is-today { border-color: var(--gold) !important; background: rgba(200,144,42,0.07) !important; box-shadow: 0 0 18px rgba(200,144,42,0.15); }
  .dc.is-today::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .dc.is-selected { border-color: var(--gold-l) !important; background: rgba(200,144,42,0.1) !important; box-shadow: 0 0 28px rgba(200,144,42,0.2); }
  .dc.purnima { animation: cellIn 0.3s ease both, purnimaG 5s 0.3s ease-in-out infinite; border-color: rgba(200,144,42,0.35) !important; }
  @keyframes purnimaG { 0%,100%{box-shadow:0 0 12px rgba(200,144,42,0.1)} 50%{box-shadow:0 0 28px rgba(200,144,42,0.25),0 0 60px rgba(200,144,42,0.06)} }
  .dc.amavasya { background: linear-gradient(160deg, rgba(50,60,160,0.08), var(--deep)) !important; border-color: rgba(90,100,200,0.2) !important; }

  /* Personal day overlays */
  .dc.power-day { border-color: rgba(255,215,0,0.45) !important; }
  .dc.power-day::after { content:''; position:absolute; inset:0; border: 1px solid rgba(255,215,0,0.15); pointer-events:none; }
  .dc.caution-day { border-color: rgba(255,107,107,0.4) !important; }
  .dc.caution-day::after { content:''; position:absolute; inset:0; border: 1px solid rgba(255,107,107,0.1); pointer-events:none; }
  .dc.soul-day { border-color: rgba(24,186,179,0.45) !important; }
  .dc.amplified.power-day { background: rgba(255,215,0,0.07) !important; box-shadow: 0 0 20px rgba(255,215,0,0.15), inset 0 0 30px rgba(255,215,0,0.04) !important; animation: cellIn 0.3s ease both, powerGlow 4s 0.3s ease-in-out infinite; }
  @keyframes powerGlow { 0%,100%{box-shadow:0 0 14px rgba(255,215,0,0.12)} 50%{box-shadow:0 0 32px rgba(255,215,0,0.28)} }
  .dc.amplified.caution-day { background: rgba(255,107,107,0.06) !important; box-shadow: 0 0 16px rgba(255,107,107,0.12), inset 0 0 20px rgba(255,107,107,0.03) !important; }
  .dc.amplified.soul-day { background: rgba(24,186,179,0.07) !important; box-shadow: 0 0 18px rgba(24,186,179,0.15) !important; }
  .dc.has-festival { border-left-width: 3px; }

  /* Cell top */
  .dc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 4px; }
  .dc-date {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(22px,3vw,30px);
    font-weight: 300; line-height: 1; color: var(--moon); letter-spacing: -1px; position: relative;
  }
  .is-today .dc-date { color: var(--gold-p); font-weight: 600; }
  .dc-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
  .dc-moon { font-size: 13px; opacity: 0.65; }

  /* Personal indicator dot */
  .dc-personal-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    box-shadow: 0 0 4px currentColor;
  }

  /* Tithi */
  .dc-tithi {
    font-family: 'Cormorant Garamond', serif; font-size: 10px; font-weight: 600;
    letter-spacing: 0.3px; color: var(--gold-l); white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;
    display: flex; align-items: center; gap: 3px;
  }
  .pk-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .dc-nakshatra { font-size: 8px; color: rgba(234,216,192,0.3); margin-bottom: 2px; display: flex; align-items: center; gap: 2px; }
  .dc-nakshatra::before { content: '✦'; font-size: 6px; color: rgba(200,144,42,0.35); }
  .dc-yoga {
    display: inline-block; background: var(--teal-d); border: 1px solid rgba(24,186,179,0.18);
    border-radius: 3px; padding: 1px 4px; font-size: 7px; color: var(--teal);
    letter-spacing: 0.3px; margin-bottom: 2px; font-family: 'Cormorant', serif; font-weight: 600;
  }
  .dc-festival {
    margin-top: auto; padding: 3px 5px; border-radius: 3px; font-size: 8px;
    font-weight: 600; display: flex; align-items: center; gap: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-family: 'Cormorant', serif; font-size: 9px; max-width: 100%;
  }
  .dc-rahu {
    margin-top: auto; padding-top: 3px;
  }
  .dc-rahu-lbl { font-size: 6px; letter-spacing: 1px; color: rgba(200,80,80,0.45); text-transform: uppercase; font-family: 'Cormorant', serif; margin-bottom: 1px; }
  .dc-rahu-bar { height: 3px; width: 100%; background: rgba(234,216,192,0.05); border-radius: 1px; position: relative; overflow: hidden; margin-bottom: 7px; }
  .dc-rahu-fill { position: absolute; top: 0; height: 100%; background: linear-gradient(90deg, rgba(200,50,50,0.75), rgba(200,80,50,0.55)); border-radius: 1px; }

  /* ── LEGEND ── */
  .cal-legend {
    display: flex; flex-wrap: wrap; gap: 10px 16px; padding: 12px 0;
    border-top: 1px solid var(--border); margin-top: 4px; font-size: 10px;
    color: rgba(234,216,192,0.38);
  }
  .leg-item { display: flex; align-items: center; gap: 5px; }
  .leg-swatch { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
  .leg-line { width: 20px; height: 3px; border-radius: 2px; }

  /* ── TITHI SUMMARY ── */
  .tithi-summary { margin-top: 20px; border-top: 1px solid var(--border); padding-top: 18px; }
  .ts-title { font-family: 'Cormorant', serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--saffron); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .ts-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(208,96,37,0.3), transparent); }
  .ts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 7px; }
  .ts-item {
    display: flex; gap: 10px; align-items: center; background: var(--ink);
    border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px;
    cursor: pointer; transition: all 0.15s;
  }
  .ts-item:hover { background: var(--gold-d); border-color: var(--border2); }
  .ts-day { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: var(--gold-p); min-width: 30px; line-height: 1; }
  .ts-name { font-family: 'Cormorant', serif; font-size: 12px; color: var(--moon); font-weight: 600; }
  .ts-note { font-size: 9px; color: rgba(234,216,192,0.38); margin-top: 2px; }

  /* ── ONBOARDING OVERLAY ── */
  .ob-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.92); backdrop-filter: blur(20px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.4s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .ob-card {
    width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
    background: var(--panel); border: 1px solid rgba(200,144,42,0.2);
    border-radius: 28px; padding: 36px 32px 28px; position: relative;
    scrollbar-width: thin; scrollbar-color: rgba(200,144,42,0.2) transparent;
    animation: cardUp 0.45s cubic-bezier(0.32, 0.72, 0, 1);
  }
  @keyframes cardUp { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .ob-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }

  /* Progress dots */
  .ob-progress { display: flex; justify-content: center; gap: 6px; margin-bottom: 28px; }
  .ob-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--ink3); transition: all 0.3s;
  }
  .ob-dot.active { background: var(--gold); width: 20px; border-radius: 3px; box-shadow: 0 0 8px rgba(200,144,42,0.5); }
  .ob-dot.done { background: rgba(200,144,42,0.5); }

  /* Onboarding step content */
  .ob-step { animation: stepIn 0.35s ease; }
  @keyframes stepIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .ob-icon { font-size: 52px; text-align: center; margin-bottom: 12px; filter: drop-shadow(0 0 20px rgba(200,144,42,0.4)); }
  .ob-heading {
    font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600;
    color: var(--gold-p); text-align: center; margin-bottom: 6px; line-height: 1.2;
  }
  .ob-sub { font-size: 13px; color: var(--moon-d); text-align: center; margin-bottom: 28px; line-height: 1.6; }
  .ob-sub strong { color: var(--gold-l); font-weight: 500; }

  /* Form fields */
  .ob-field { margin-bottom: 16px; }
  .ob-label { font-family: 'Cormorant', serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(234,216,192,0.4); display: block; margin-bottom: 7px; }
  .ob-input, .ob-select {
    width: 100%; background: var(--ink); border: 1px solid var(--border2);
    border-radius: 12px; padding: 13px 16px; color: var(--moon);
    font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none;
    transition: border-color 0.2s; -webkit-appearance: none;
  }
  .ob-input:focus, .ob-select:focus { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(200,144,42,0.15); }
  .ob-input::placeholder { color: rgba(234,216,192,0.2); }
  .ob-select option { background: #0F1020; color: var(--moon); }
  .ob-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  /* Buttons */
  .ob-btn-primary {
    width: 100%; padding: 15px; border-radius: 14px;
    background: linear-gradient(135deg, var(--saffron), var(--gold));
    border: none; color: white; font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 600; cursor: pointer; letter-spacing: 1px;
    transition: all 0.2s; margin-top: 8px;
    box-shadow: 0 4px 20px rgba(200,144,42,0.3);
  }
  .ob-btn-primary:hover { transform: scale(1.02); box-shadow: 0 6px 28px rgba(200,144,42,0.4); }
  .ob-btn-skip { display: block; text-align: center; margin-top: 12px; font-size: 12px; color: rgba(234,216,192,0.3); cursor: pointer; letter-spacing: 1px; font-family: 'Cormorant', serif; }
  .ob-btn-skip:hover { color: rgba(234,216,192,0.6); }
  .ob-btn-back {
    position: absolute; top: 20px; left: 24px; background: var(--ink);
    border: 1px solid var(--border); border-radius: 10px; padding: 7px 14px;
    color: rgba(234,216,192,0.4); cursor: pointer; font-size: 12px;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .ob-btn-back:hover { color: var(--moon); border-color: var(--border2); }

  /* Result card */
  .ob-result-card {
    background: var(--gold-d); border: 1px solid rgba(200,144,42,0.2);
    border-radius: 16px; padding: 18px; margin-bottom: 14px;
  }
  .orc-label { font-family: 'Cormorant', serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(234,216,192,0.3); margin-bottom: 4px; }
  .orc-value { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: var(--gold-p); }
  .orc-sub { font-size: 11px; color: rgba(234,216,192,0.45); margin-top: 3px; }
  .orc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .orc-item { background: var(--ink); border: 1px solid var(--border); border-radius: 12px; padding: 12px 10px; text-align: center; }
  .orc-item-icon { font-size: 22px; margin-bottom: 4px; }
  .orc-item-lbl { font-size: 8px; letter-spacing: 1px; text-transform: uppercase; color: rgba(234,216,192,0.3); font-family: 'Cormorant', serif; }
  .orc-item-val { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 700; color: var(--gold-p); margin-top: 2px; }

  /* Day detail panel */
  .dp-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); animation: fadeIn 0.2s; }
  .dp-panel {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 600;
    background: var(--panel); border-top: 1px solid rgba(200,144,42,0.2);
    border-radius: 24px 24px 0 0; max-height: 80vh; overflow-y: auto;
    animation: panelUp 0.35s cubic-bezier(0.32,0.72,0,1);
    scrollbar-width: thin; scrollbar-color: rgba(200,144,42,0.2) transparent;
  }
  @keyframes panelUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .dp-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .dp-handle { width: 40px; height: 4px; background: var(--ink3); border-radius: 2px; margin: 14px auto 0; }
  .dp-inner { padding: 18px 22px 36px; position: relative; }
  .dp-close {
    position: absolute; top: 18px; right: 22px; width: 34px; height: 34px;
    border-radius: 50%; background: var(--ink); border: 1px solid var(--border);
    color: rgba(234,216,192,0.4); cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 5;
  }
  .dp-close:hover { background: var(--gold-d); color: var(--gold); }
  .dp-date-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
  .dp-big-date { font-family: 'Cormorant Garamond', serif; font-size: 68px; font-weight: 300; line-height: 1; color: var(--gold-p); letter-spacing: -4px; }
  .dp-day-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: var(--moon); }
  .dp-gregorian { font-size: 11px; letter-spacing: 2px; color: rgba(234,216,192,0.35); text-transform: uppercase; margin-top: 2px; }
  .dp-samvat-line { font-family: 'Noto Sans Devanagari', sans-serif; font-size: 11px; color: rgba(234,216,192,0.35); margin-top: 4px; }
  .dp-pills { display: flex; flex-direction: column; gap: 5px; align-items: flex-end; margin-left: auto; }
  .dp-pill { background: var(--ink); border: 1px solid var(--border); border-radius: 20px; padding: 4px 11px; font-size: 12px; font-family: 'Cormorant Garamond', serif; display: flex; align-items: center; gap: 5px; }
  .dp-pill .t { color: var(--gold-p); font-weight: 600; }
  .dp-pill .l { color: rgba(234,216,192,0.35); font-size: 9px; letter-spacing: 1px; }

  .dp-tabs { display: flex; gap: 3px; background: var(--ink); padding: 4px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 18px; overflow-x: auto; scrollbar-width: none; }
  .dp-tabs::-webkit-scrollbar { display: none; }
  .dp-tab {
    flex-shrink: 0; padding: 7px 12px; border-radius: 8px; background: none; border: none;
    color: rgba(234,216,192,0.38); cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 500; transition: all 0.2s; letter-spacing: 0.3px;
  }
  .dp-tab.on { background: linear-gradient(135deg, rgba(200,144,42,0.18), rgba(208,96,37,0.1)); color: var(--gold-p); border: 1px solid rgba(200,144,42,0.22); }

  .dp-sec-title { font-family: 'Cormorant', serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--saffron); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .dp-sec-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(208,96,37,0.3), transparent); }

  .pancha-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; margin-bottom: 22px; }
  .pancha-card {
    background: var(--ink); border: 1px solid var(--border); border-radius: 12px;
    padding: 12px 14px; position: relative; overflow: hidden;
  }
  .pancha-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(to bottom, var(--gold), transparent); }
  .pancha-card.span2 { grid-column: span 2; }
  .pc-lbl { font-family: 'Cormorant', serif; font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: rgba(234,216,192,0.28); margin-bottom: 3px; }
  .pc-val { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--gold-p); }
  .pc-dev { font-family: 'Noto Sans Devanagari', sans-serif; font-size: 10px; color: rgba(234,216,192,0.28); margin-top: 2px; }
  .pc-det { font-size: 10px; color: rgba(234,216,192,0.38); margin-top: 2px; }
  .pc-ends { position: absolute; right: 10px; top: 10px; font-size: 8px; color: rgba(234,216,192,0.2); font-family: 'Cormorant', serif; }

  .chog-bar { display: flex; height: 50px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 8px; }
  .chog-seg { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: filter 0.15s; cursor: pointer; border-right: 1px solid rgba(0,0,0,0.25); }
  .chog-seg:last-child { border-right: none; }
  .chog-seg:hover { filter: brightness(1.25); }
  .cs-name { font-size: 9px; font-family: 'Cormorant', serif; font-weight: 700; }
  .cs-time { font-size: 7px; opacity: 0.7; margin-top: 1px; }

  .muh-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
  .muh-item { display: flex; align-items: center; gap: 10px; padding: 10px 13px; background: var(--ink); border: 1px solid var(--border); border-radius: 10px; }
  .muh-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .muh-name { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 600; color: var(--moon); flex: 1; }
  .muh-time { font-size: 11px; color: var(--gold-p); font-family: 'Cormorant Garamond', serif; font-weight: 600; }
  .muh-badge { font-size: 8px; padding: 2px 8px; border-radius: 10px; letter-spacing: 0.5px; font-weight: 700; }

  .rahu-box { background: rgba(180,40,40,0.08); border: 1px solid rgba(180,40,40,0.2); border-radius: 10px; padding: 12px 15px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .rahu-lbl { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: rgba(234,216,192,0.8); }
  .rahu-warn { font-size: 10px; color: rgba(200,80,80,0.55); margin-top: 2px; }
  .rahu-time { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 700; color: #CC4444; }

  .planet-row { display: flex; overflow-x: auto; gap: 7px; padding-bottom: 4px; scrollbar-width: none; margin-bottom: 20px; }
  .planet-row::-webkit-scrollbar { display: none; }
  .planet-card { flex-shrink: 0; background: var(--ink); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; text-align: center; min-width: 76px; }
  .planet-sym { font-size: 17px; margin-bottom: 3px; }
  .planet-name { font-size: 9px; color: rgba(234,216,192,0.3); letter-spacing: 0.5px; }
  .planet-rashi { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: var(--gold-p); font-weight: 600; margin-top: 2px; }

  /* Personal day panel */
  .personal-day-card { border-radius: 16px; padding: 16px; margin-bottom: 18px; }
  .pdc-type { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-family: 'Cormorant', serif; margin-bottom: 10px; }
  .pdc-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--moon); margin-bottom: 6px; }
  .pdc-body { font-size: 13px; line-height: 1.75; color: rgba(234,216,192,0.7); }
  .pdc-body strong { color: var(--gold-p); font-weight: 500; }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .dc { min-height: 78px; padding: 6px 5px 0; }
    .dc-date { font-size: 18px; }
    .dc-nakshatra { display: none; }
    .dc-yoga { display: none; }
    .energy-pills { display: none; }
    .ob-card { padding: 24px 20px 20px; }
    .orc-grid { grid-template-columns: repeat(3,1fr); }
  }
  @media (max-width: 380px) {
    .dc-moon { display: none; }
    .dc-rahu-lbl { display: none; }
    .wday-pl { display: none; }
    .month-en { letter-spacing: 4px; }
  }
`;

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    appSub: "Ancient Wisdom · Modern Vibes",
    langName: "English",
    myDays: "My Days",
    today: "Today",
    weekdays: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    weekdaysHi: ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"],
    weekdayPlanets: ["Surya ☉","Chandra ☽","Mangala ♂","Budha ☿","Brihaspati ♃","Shukra ♀","Shani ♄"],
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    monthsHi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्टूबर","नवम्बर","दिसम्बर"],
    tithiLabel: "Tithi", nashtaLabel: "Nakshatra", yogaLabel: "Yoga",
    rahuLabel: "Rahu Kalam", panchangLabel: "Panchang", chogLabel: "Choghadiya",
    muhLabel: "Muhurat", festLabel: "Festival", planetLabel: "Gochara", personalLabel: "My Energy",
    onboard: {
      s1h: "Namaste 🙏", s1b: "Welcome to <strong>AuraPanchang</strong> — your sacred space where ancient wisdom meets modern life.",
      s2h: "Who Are You?", s2b: "Tell us your name so we can personalise your spiritual calendar.",
      s3h: "Your Birth Star", s3b: "Your birth details unlock your <strong>Janma Nakshatra</strong>, personal power days, and caution periods.",
      s4h: "Your Cosmic Blueprint", s4b: "Here is your personal Janma profile, calculated from your birth details.",
      namePlh: "Your full name", dobLabel: "Date of Birth", timeLabel: "Birth Time (optional)", placeLabel: "Birth Place (optional)",
      timePlh: "e.g. 10:30 AM", placePlh: "e.g. Mumbai, India",
      btn1: "Begin Journey →", btn2: "Continue →", btn3: "Calculate My Chart →", btn4: "Enter My Calendar →",
      skip: "Skip personalization",
    },
    powerDay: "Power Day ✦", cautionDay: "Caution Day ⚠", soulDay: "Soul Day ☽",
    powerDayDesc: "Your <strong>Janma Nakshatra</strong> governs today — energy flows naturally in your favour. Ideal for new ventures, important decisions, and spiritual practice.",
    cautionDayDesc: "Today's planetary alignment activates a <strong>sensitive point</strong> in your chart. Proceed mindfully. Avoid confrontations and major new commitments.",
    soulDayDesc: "Today shares your <strong>Janma Tithi</strong> — the lunar phase of your birth. A deeply personal day for reflection, gratitude, and honouring your roots.",
    vikram: "Vikram Samvat", shaka: "Shaka Samvat", fasli: "Fasli San", hijri: "Hijri", bangla: "Bangla San", nepali: "Nepali Samvat",
    season: "Vasanta Ritu (Spring)", maas1: "Phalguna", maas2: "Chaitra", sun: "Sun in Meena",
    tithiSchedule: "Tithi Schedule",
  },
  hi: {
    appSub: "प्राचीन ज्ञान · आधुनिक जीवन",
    langName: "हिंदी",
    myDays: "मेरे दिन",
    today: "आज",
    weekdays: ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"],
    weekdaysHi: ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"],
    weekdayPlanets: ["सूर्य ☉","चंद्र ☽","मंगल ♂","बुध ☿","बृहस्पति ♃","शुक्र ♀","शनि ♄"],
    months: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्टूबर","नवम्बर","दिसम्बर"],
    monthsHi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्टूबर","नवम्बर","दिसम्बर"],
    tithiLabel: "तिथि", nashtaLabel: "नक्षत्र", yogaLabel: "योग",
    rahuLabel: "राहु काल", panchangLabel: "पंचांग", chogLabel: "चौघड़िया",
    muhLabel: "मुहूर्त", festLabel: "त्यौहार", planetLabel: "गोचर", personalLabel: "मेरी ऊर्जा",
    onboard: {
      s1h: "नमस्ते 🙏", s1b: "<strong>औरापंचांग</strong> में आपका स्वागत है — जहाँ प्राचीन ज्ञान मिलता है आधुनिक जीवन से।",
      s2h: "आपका परिचय", s2b: "अपना नाम बताएं ताकि हम आपका व्यक्तिगत पंचांग तैयार कर सकें।",
      s3h: "आपका जन्म-नक्षत्र", s3b: "आपके जन्म विवरण से आपका <strong>जन्म नक्षत्र</strong>, शुभ दिन और सावधानी के दिन पता चलते हैं।",
      s4h: "आपकी जन्म-कुंडली", s4b: "आपके विवरण से तैयार आपका व्यक्तिगत जन्म प्रोफाइल।",
      namePlh: "आपका पूरा नाम", dobLabel: "जन्म तिथि", timeLabel: "जन्म समय (वैकल्पिक)", placeLabel: "जन्म स्थान (वैकल्पिक)",
      timePlh: "जैसे 10:30 AM", placePlh: "जैसे मुंबई",
      btn1: "यात्रा शुरू करें →", btn2: "आगे बढ़ें →", btn3: "कुंडली देखें →", btn4: "पंचांग खोलें →",
      skip: "व्यक्तिगतकरण छोड़ें",
    },
    powerDay: "शक्ति दिवस ✦", cautionDay: "सावधानी दिवस ⚠", soulDay: "आत्मा दिवस ☽",
    powerDayDesc: "आज आपका <strong>जन्म नक्षत्र</strong> सक्रिय है — ऊर्जा आपके अनुकूल है। नए कार्य, महत्वपूर्ण निर्णय और साधना के लिए उत्तम।",
    cautionDayDesc: "आज की ग्रह स्थिति आपकी कुंडली के <strong>संवेदनशील बिंदु</strong> को प्रभावित करती है। सोच-समझकर कार्य करें।",
    soulDayDesc: "आज की तिथि आपकी <strong>जन्म तिथि</strong> है — चिंतन, कृतज्ञता और अपनी जड़ों से जुड़ने का दिन।",
    vikram: "विक्रम संवत", shaka: "शक संवत", fasli: "फसली सन", hijri: "हिजरी", bangla: "बंगाली सन", nepali: "नेपाली संवत",
    season: "वसंत ऋतु", maas1: "फाल्गुन", maas2: "चैत्र", sun: "सूर्य मीन राशि में",
    tithiSchedule: "तिथि सूची",
  },
  gu: {
    appSub: "પ્રાચીન જ્ઞાન · આધુનિક જીવન",
    langName: "ગુજરાતી",
    myDays: "મારા દિવસ",
    today: "આજ",
    weekdays: ["રવિ","સોમ","મંગળ","બુધ","ગુરુ","શુક્ર","શનિ"],
    weekdaysHi: ["રવિ","સોમ","મંગળ","બુધ","ગુરુ","શુક્ર","શનિ"],
    weekdayPlanets: ["સૂર્ય ☉","ચંદ્ર ☽","મંગળ ♂","બુધ ☿","ગુરુ ♃","શુક્ર ♀","શની ♄"],
    months: ["જાન્યુઆરી","ફેબ્રુઆરી","માર્ચ","એપ્રિલ","મે","જૂન","જુલાઈ","ઓગસ્ટ","સપ્ટેમ્બર","ઓક્ટોબર","નવેમ્બર","ડિસેમ્બર"],
    monthsHi: ["જાન્યુ","ફેબ્રુ","માર્ચ","એપ્રિલ","મે","જૂન","જુલાઈ","ઓગ","સપ્ટ","ઓક્ટ","નવે","ડિસે"],
    tithiLabel: "તિથિ", nashtaLabel: "નક્ષત્ર", yogaLabel: "યોગ",
    rahuLabel: "રાહુ કાળ", panchangLabel: "પંચાંગ", chogLabel: "ચોઘડિયા",
    muhLabel: "મુહૂર્ત", festLabel: "તહેવાર", planetLabel: "ગ્રહ", personalLabel: "મારી ઊર્જા",
    onboard: { s1h: "નમસ્તે 🙏", s1b: "<strong>ઓરાપંચાંગ</strong>માં આપનું સ્વાગત છે.",
      s2h: "આપનો પરિચય", s2b: "આપનું નામ આપો.", s3h: "જન્મ નક્ષત્ર", s3b: "જન્મ વિગત આપો.",
      s4h: "આપની જન્મ-કુંડળી", s4b: "આપની વ્યક્તિગત જન્મ પ્રોફાઇલ.",
      namePlh: "આપનું પૂરું નામ", dobLabel: "જન્મ તારીખ", timeLabel: "જન્મ સમય", placeLabel: "જન્મ સ્થળ",
      timePlh: "દા.ત. 10:30 AM", placePlh: "દા.ત. અમદાવાદ",
      btn1: "શરૂ કરો →", btn2: "આગળ →", btn3: "ગણતરી કરો →", btn4: "પંચાંગ ખોલો →", skip: "છોડો" },
    powerDay: "શક્તિ દિન ✦", cautionDay: "સાવધાની ⚠", soulDay: "આત્મ દિન ☽",
    powerDayDesc: "આજ આપનું <strong>જન્મ નક્ષત્ર</strong> સક્રિય છે — ઊર્જા આપને અનુકૂળ છે.",
    cautionDayDesc: "આજ ગ્રહ સ્થિતિ <strong>સંવેદનશીલ</strong> છે — સોચ-સમજીને કાર્ય કરો.",
    soulDayDesc: "આજ આપની <strong>જન્મ તિથિ</strong> — ચિંતન અને કૃતજ્ઞતાનો દિવસ.",
    vikram: "વિક્રમ સંવત", shaka: "શક સંવત", fasli: "ફસળી", hijri: "હિજરી", bangla: "બાંગ્લા", nepali: "નેપાળી",
    season: "વસંત ઋતુ", maas1: "ફાલ્ગુન", maas2: "ચૈત્ર", sun: "સૂર્ય મીન રાશિ",
    tithiSchedule: "તિથિ યાદી",
  },
  mr: {
    appSub: "प्राचीन ज्ञान · आधुनिक जीवन",
    langName: "मराठी",
    myDays: "माझे दिवस",
    today: "आज",
    weekdays: ["रवि","सोम","मंगळ","बुध","गुरु","शुक्र","शनि"],
    weekdaysHi: ["रवि","सोम","मंगळ","बुध","गुरु","शुक्र","शनि"],
    weekdayPlanets: ["सूर्य ☉","चंद्र ☽","मंगळ ♂","बुध ☿","गुरू ♃","शुक्र ♀","शनि ♄"],
    months: ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"],
    monthsHi: ["जाने","फेब्रु","मार्च","एप्रि","मे","जून","जुलै","ऑग","सप्टे","ऑक्ट","नोव्हे","डिसे"],
    tithiLabel: "तिथी", nashtaLabel: "नक्षत्र", yogaLabel: "योग",
    rahuLabel: "राहू काळ", panchangLabel: "पंचांग", chogLabel: "चौघडिया",
    muhLabel: "मुहूर्त", festLabel: "सण", planetLabel: "ग्रह", personalLabel: "माझी ऊर्जा",
    onboard: { s1h: "नमस्ते 🙏", s1b: "<strong>औरापंचांग</strong>मध्ये आपले स्वागत.",
      s2h: "तुमची ओळख", s2b: "तुमचे नाव सांगा.", s3h: "जन्म नक्षत्र", s3b: "जन्म तपशील द्या.",
      s4h: "तुमची जन्म-कुंडली", s4b: "तुमची वैयक्तिक जन्म माहिती.",
      namePlh: "तुमचे पूर्ण नाव", dobLabel: "जन्म तारीख", timeLabel: "जन्म वेळ", placeLabel: "जन्म ठिकाण",
      timePlh: "उदा. 10:30 AM", placePlh: "उदा. पुणे",
      btn1: "सुरुवात करा →", btn2: "पुढे →", btn3: "गणना करा →", btn4: "पंचांग उघडा →", skip: "वगळा" },
    powerDay: "शक्ती दिवस ✦", cautionDay: "सावधानी ⚠", soulDay: "आत्मा दिवस ☽",
    powerDayDesc: "आज तुमचे <strong>जन्म नक्षत्र</strong> सक्रिय आहे — ऊर्जा अनुकूल आहे.",
    cautionDayDesc: "आजची ग्रह स्थिती <strong>संवेदनशील</strong> आहे — विचारपूर्वक कार्य करा.",
    soulDayDesc: "आज तुमची <strong>जन्म तिथी</strong> — चिंतन आणि कृतज्ञतेचा दिवस.",
    vikram: "विक्रम संवत", shaka: "शक संवत", fasli: "फसली", hijri: "हिजरी", bangla: "बंगाली", nepali: "नेपाळी",
    season: "वसंत ऋतू", maas1: "फाल्गुन", maas2: "चैत्र", sun: "सूर्य मीन राशीत",
    tithiSchedule: "तिथी सूची",
  },
  bn: {
    appSub: "প্রাচীন জ্ঞান · আধুনিক জীবন",
    langName: "বাংলা",
    myDays: "আমার দিন",
    today: "আজ",
    weekdays: ["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"],
    weekdaysHi: ["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"],
    weekdayPlanets: ["সূর্য ☉","চন্দ্র ☽","মঙ্গল ♂","বুধ ☿","বৃহস্পতি ♃","শুক্র ♀","শনি ♄"],
    months: ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"],
    monthsHi: ["জানু","ফেব্রু","মার্চ","এপ্রি","মে","জুন","জুলাই","আগ","সেপ্ট","অক্ট","নভে","ডিসে"],
    tithiLabel: "তিথি", nashtaLabel: "নক্ষত্র", yogaLabel: "যোগ",
    rahuLabel: "রাহু কাল", panchangLabel: "পঞ্চাঙ্গ", chogLabel: "চৌঘড়িয়া",
    muhLabel: "মুহূর্ত", festLabel: "উৎসব", planetLabel: "গ্রহ", personalLabel: "আমার শক্তি",
    onboard: { s1h: "নমস্তে 🙏", s1b: "<strong>অরাপঞ্চাঙ্গ</strong>-এ আপনাকে স্বাগত।",
      s2h: "আপনার পরিচয়", s2b: "আপনার নাম বলুন।", s3h: "জন্ম নক্ষত্র", s3b: "জন্মের তথ্য দিন।",
      s4h: "আপনার জন্মচার্ট", s4b: "আপনার ব্যক্তিগত জন্ম প্রোফাইল।",
      namePlh: "আপনার পুরো নাম", dobLabel: "জন্ম তারিখ", timeLabel: "জন্মের সময়", placeLabel: "জন্মস্থান",
      timePlh: "যেমন 10:30 AM", placePlh: "যেমন কলকাতা",
      btn1: "যাত্রা শুরু →", btn2: "এগিয়ে যান →", btn3: "গণনা করুন →", btn4: "পঞ্চাঙ্গ খুলুন →", skip: "এড়িয়ে যান" },
    powerDay: "শক্তি দিন ✦", cautionDay: "সতর্কতা ⚠", soulDay: "আত্মা দিন ☽",
    powerDayDesc: "আজ আপনার <strong>জন্ম নক্ষত্র</strong> সক্রিয় — শক্তি অনুকূল।",
    cautionDayDesc: "আজ গ্রহের অবস্থান <strong>সংবেদনশীল</strong> — সতর্কতার সাথে এগিয়ে যান।",
    soulDayDesc: "আজ আপনার <strong>জন্ম তিথি</strong> — চিন্তা ও কৃতজ্ঞতার দিন।",
    vikram: "বিক্রম সংবৎ", shaka: "শক সংবৎ", fasli: "ফসলি", hijri: "হিজরি", bangla: "বাংলা সন", nepali: "নেপালি",
    season: "বসন্ত ঋতু", maas1: "ফাল্গুন", maas2: "চৈত্র", sun: "সূর্য মীন রাশিতে",
    tithiSchedule: "তিথি তালিকা",
  },
};

// ─── NAKSHATRA / RASHI DATA ───────────────────────────────────────────────────
const NAKSHATRAS = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadra","Uttara Bhadra","Revati"];
const RASHIS = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];
const TAARA_NAMES = ["Janma","Sampat","Vipat","Kshema","Pratyak","Sadhana","Naidhana","Mitra","Parama Mitra"];
const TAARA_QUALITY = ["caution","power","caution","power","caution","power","caution","power","power"];

// ─── PANCHANG ENGINE ──────────────────────────────────────────────────────────
function calcJanmaProfile(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const nashtaIdx = Math.floor(((d.getFullYear() - 1900) * 365 + dayOfYear) * 0.0739) % 27;
  const rashiIdx = Math.floor(nashtaIdx / 2.25) % 12;
  const tithiIdx = Math.floor(d.getDate() * 0.97) % 30;
  const tithiNames = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya"];
  return {
    nakshatra: NAKSHATRAS[nashtaIdx],
    nashtaIdx,
    rashi: RASHIS[rashiIdx],
    tithi: tithiNames[tithiIdx % 30],
    tithiNum: d.getDate() % 15,
    lagna: RASHIS[(rashiIdx + 2) % 12],
    yoga: ["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarman","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Mahendra","Vaidhriti"][d.getDate() % 27],
  };
}

function getDayPersonalType(dayData, profile) {
  if (!profile || !dayData) return null;
  if (dayData.nt === profile.nakshatra) return "power";
  if (dayData.t === profile.tithi) return "soul";
  const taaraDist = (NAKSHATRAS.indexOf(dayData.nt) - profile.nashtaIdx + 27) % 9;
  if (TAARA_QUALITY[taaraDist] === "caution") return "caution";
  if (taaraDist === 3 || taaraDist === 5 || taaraDist === 8) return "power";
  return null;
}

// ─── CALENDAR DATA ────────────────────────────────────────────────────────────
const RAHU = { 0:{s:"4:30 PM",e:"6:00 PM",sp:82,wp:13}, 1:{s:"7:30 AM",e:"9:00 AM",sp:8,wp:13}, 2:{s:"3:00 PM",e:"4:30 PM",sp:70,wp:13}, 3:{s:"12:00 PM",e:"1:30 PM",sp:46,wp:13}, 4:{s:"1:30 PM",e:"3:00 PM",sp:59,wp:13}, 5:{s:"10:30 AM",e:"12:00 PM",sp:33,wp:13}, 6:{s:"9:00 AM",e:"10:30 AM",sp:21,wp:13} };
const CHOG_SEQ = { 0:["Udveg","Char","Labh","Amrit","Kaal","Shubh","Rog","Udveg"], 1:["Amrit","Kaal","Shubh","Rog","Udveg","Char","Labh","Amrit"], 2:["Rog","Udveg","Char","Labh","Amrit","Kaal","Shubh","Rog"], 3:["Labh","Amrit","Kaal","Shubh","Rog","Udveg","Char","Labh"], 4:["Shubh","Rog","Udveg","Char","Labh","Amrit","Kaal","Shubh"], 5:["Char","Labh","Amrit","Kaal","Shubh","Rog","Udveg","Char"], 6:["Kaal","Shubh","Rog","Udveg","Char","Labh","Amrit","Kaal"] };
const CHOG_P = { Amrit:{c:"#18BAB3",bg:"rgba(24,186,179,0.22)"}, Shubh:{c:"#C8902A",bg:"rgba(200,144,42,0.22)"}, Labh:{c:"#7BC47A",bg:"rgba(123,196,122,0.22)"}, Char:{c:"#6888BB",bg:"rgba(104,136,187,0.18)"}, Udveg:{c:"#D07020",bg:"rgba(208,112,32,0.18)"}, Rog:{c:"#C85050",bg:"rgba(200,80,80,0.18)"}, Kaal:{c:"#886699",bg:"rgba(136,102,153,0.18)"} };
const PLANETS = [{sym:"☉",name:"Surya",rashi:"Meena"},{sym:"☽",name:"Chandra",rashi:"Mithuna"},{sym:"♂",name:"Mangala",rashi:"Mithuna"},{sym:"☿",name:"Budha",rashi:"Kumbha"},{sym:"♃",name:"Brihaspati",rashi:"Vrishabha"},{sym:"♀",name:"Shukra",rashi:"Meena"},{sym:"♄",name:"Shani",rashi:"Kumbha"},{sym:"☊",name:"Rahu",rashi:"Meena"},{sym:"☋",name:"Ketu",rashi:"Kanya"}];

// Month data generator
function buildMonthData(year, month) {
  const tithis = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya"];
  const yogas = ["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarman","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Mahendra","Vaidhriti"];
  const nakshatras = NAKSHATRAS;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // March 2026 specific festival data
  const festivalsMap = {};
  if (year === 2026 && month === 2) {
    festivalsMap[3]  = [{n:"Holika Dahan", e:"🔥", c:"#D4622A"}];
    festivalsMap[4]  = [{n:"Holi – Rangwali Holi", e:"🌈", c:"#C45E8A"}];
    festivalsMap[14] = [{n:"Pradosh Vrat", e:"🔱", c:"#9966CC"}];
    festivalsMap[18] = [{n:"Amavasya – Pitru Tarpan", e:"🌑", c:"#446688"}];
    festivalsMap[19] = [{n:"Navratri Day 1 – Ghatasthapana", e:"🌸", c:"#C45E8A"}];
    festivalsMap[20] = [{n:"Gudi Padwa • Ugadi • VS 2083", e:"🪔", c:"#C9922A"}];
    festivalsMap[23] = [{n:"Navratri Day 5", e:"🌸", c:"#C45E8A"}];
    festivalsMap[27] = [{n:"Ram Navami", e:"🏹", c:"#1ABFB8"}];
    festivalsMap[29] = [{n:"Kamada Ekadashi", e:"💫", c:"#7BC67A"}];
    festivalsMap[31] = [{n:"Pradosh Vrat", e:"🔱", c:"#9966CC"}];
  }
  if (year === 2026 && month === 1) {
    festivalsMap[26] = [{n:"Maha Shivratri", e:"🔱", c:"#9966CC"}];
  }
  if (year === 2026 && month === 3) {
    festivalsMap[6]  = [{n:"Ram Navami", e:"🏹", c:"#1ABFB8"}];
    festivalsMap[14] = [{n:"Hanuman Jayanti", e:"🐒", c:"#D4622A"}];
  }

  // Sunrise/sunset for the month (approximate, slowly shifting)
  const baseSR = [6, 48]; const baseSS = [6, 32];
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const w = new Date(year, month, d).getDay();
    const tIdx = (d + 12) % 30;
    const pk = tIdx < 15 ? "SP" : "KP";
    const ntIdx = (d + 8 + month * 3) % 27;
    const yogaIdx = (d + month * 2) % 27;
    const mpRaw = pk === "SP" ? (tIdx / 14) : (1 - (tIdx - 15) / 14);
    const mp = Math.max(0, Math.min(1, mpRaw));
    const minOff = d - 1;
    const sr = `${baseSR[0]}:${String(Math.max(0, baseSR[1] - Math.floor(minOff * 0.5))).padStart(2,"0")} AM`;
    const ss = `${baseSS[0]}:${String(Math.min(59, baseSS[1] + Math.floor(minOff * 0.5))).padStart(2,"0")} PM`;
    const auspicious = [1,4,9,11,12,16,20,23,25,27,29].includes(yogaIdx % 27) || ["Saubhagya","Siddhi","Shubha","Amrit","Labh"].includes(yogas[yogaIdx]);
    days.push({
      d, w, pk,
      t: tithis[tIdx],
      nt: nakshatras[ntIdx],
      y: yogas[yogaIdx],
      f: festivalsMap[d] || [],
      a: auspicious, mp,
      sr, ss,
      mr: `${6 + Math.floor(d * 0.5 % 6)}:${String(Math.floor(d * 7 % 60)).padStart(2,"0")} ${d < 15 ? "AM" : "PM"}`,
      ms: `${7 + Math.floor(d * 0.4 % 5)}:${String(Math.floor(d * 11 % 60)).padStart(2,"0")} ${d < 20 ? "PM" : "AM"}`,
    });
  }
  return { days, firstDay, daysInMonth };
}

function getMoon(mp) {
  if (mp === 0) return "🌑"; if (mp < 0.12) return "🌒"; if (mp < 0.38) return "🌓";
  if (mp < 0.62) return "🌔"; if (mp >= 0.95) return "🌕"; if (mp < 0.85) return "🌖"; return "🌗";
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ lang, onComplete }) {
  const t = T[lang].onboard;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", dob: "", time: "", place: "" });
  const [profile, setProfile] = useState(null);
  const TOTAL = 4;

  function upd(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function next() {
    if (step === 2) {
      setProfile(calcJanmaProfile(form.dob));
    }
    setStep(s => Math.min(s + 1, TOTAL - 1));
  }

  function finish() { onComplete({ ...form, profile: calcJanmaProfile(form.dob) }); }
  function skip() { onComplete(null); }

  return (
    <div className="ob-overlay">
      <div className="ob-card">
        {step > 0 && <button className="ob-btn-back" onClick={() => setStep(s => s - 1)}>← Back</button>}

        <div className="ob-progress">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} className={`ob-dot ${i === step ? "active" : i < step ? "done" : ""}`} />
          ))}
        </div>

        {/* STEP 0 — Welcome */}
        {step === 0 && (
          <div className="ob-step">
            <div className="ob-icon">🕉️</div>
            <div className="ob-heading" dangerouslySetInnerHTML={{ __html: t.s1h }} />
            <div className="ob-sub" dangerouslySetInnerHTML={{ __html: t.s1b }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[
                { icon: "🌙", text: "All 5 Panchang elements — daily" },
                { icon: "✦", text: "Your personal power & caution days" },
                { icon: "🗓️", text: "Festivals, muhurats, Choghadiya" },
                { icon: "🌐", text: "5 languages — Hindi, English & more" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: "var(--ink)", borderRadius: 12, padding: "12px 16px", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <span style={{ fontSize: 14, color: "rgba(234,216,192,0.7)" }}>{f.text}</span>
                </div>
              ))}
            </div>
            <button className="ob-btn-primary" onClick={next}>{t.btn1}</button>
            <span className="ob-btn-skip" onClick={skip}>{t.skip}</span>
          </div>
        )}

        {/* STEP 1 — Name */}
        {step === 1 && (
          <div className="ob-step">
            <div className="ob-icon">✍️</div>
            <div className="ob-heading">{t.s2h}</div>
            <div className="ob-sub" dangerouslySetInnerHTML={{ __html: t.s2b }} />
            <div className="ob-field">
              <label className="ob-label">{T[lang].onboard.namePlh}</label>
              <input className="ob-input" placeholder={t.namePlh} value={form.name} onChange={e => upd("name", e.target.value)} />
            </div>
            <button className="ob-btn-primary" onClick={next} disabled={!form.name.trim()} style={{ opacity: form.name.trim() ? 1 : 0.5 }}>{t.btn2}</button>
          </div>
        )}

        {/* STEP 2 — Birth details */}
        {step === 2 && (
          <div className="ob-step">
            <div className="ob-icon">⭐</div>
            <div className="ob-heading">{t.s3h}</div>
            <div className="ob-sub" dangerouslySetInnerHTML={{ __html: t.s3b }} />
            <div className="ob-field">
              <label className="ob-label">{t.dobLabel}</label>
              <input className="ob-input" type="date" value={form.dob} onChange={e => upd("dob", e.target.value)} />
            </div>
            <div className="ob-row">
              <div className="ob-field">
                <label className="ob-label">{t.timeLabel}</label>
                <input className="ob-input" placeholder={t.timePlh} value={form.time} onChange={e => upd("time", e.target.value)} />
              </div>
              <div className="ob-field">
                <label className="ob-label">{t.placeLabel}</label>
                <input className="ob-input" placeholder={t.placePlh} value={form.place} onChange={e => upd("place", e.target.value)} />
              </div>
            </div>
            <button className="ob-btn-primary" onClick={next} disabled={!form.dob} style={{ opacity: form.dob ? 1 : 0.5 }}>{t.btn3}</button>
          </div>
        )}

        {/* STEP 3 — Result */}
        {step === 3 && profile && (
          <div className="ob-step">
            <div className="ob-icon">🌟</div>
            <div className="ob-heading">{t.s4h}</div>
            <div className="ob-sub" dangerouslySetInnerHTML={{ __html: t.s4b }} />
            <div className="ob-result-card" style={{ marginBottom: 16 }}>
              <div className="orc-label">Namaskara,</div>
              <div className="orc-value">{form.name}</div>
              <div className="orc-sub">Born {form.dob}{form.place ? ` · ${form.place}` : ""}</div>
            </div>
            <div className="orc-grid" style={{ marginBottom: 20 }}>
              <div className="orc-item">
                <div className="orc-item-icon">⭐</div>
                <div className="orc-item-lbl">Janma Nakshatra</div>
                <div className="orc-item-val">{profile.nakshatra}</div>
              </div>
              <div className="orc-item">
                <div className="orc-item-icon">♉</div>
                <div className="orc-item-lbl">Janma Rashi</div>
                <div className="orc-item-val">{profile.rashi}</div>
              </div>
              <div className="orc-item">
                <div className="orc-item-icon">🌙</div>
                <div className="orc-item-lbl">Janma Tithi</div>
                <div className="orc-item-val">{profile.tithi}</div>
              </div>
            </div>
            <div style={{ background: "var(--gold-d)", border: "1px solid rgba(200,144,42,0.2)", borderRadius: 14, padding: 16, marginBottom: 20, fontSize: 13, lineHeight: 1.7, color: "rgba(234,216,192,0.7)" }}>
              Days when the Moon transits <strong style={{ color: "var(--gold-p)" }}>{profile.nakshatra}</strong> are your <span style={{ color: "var(--power)" }}>✦ Power Days</span>. Days matching Taara 3 or 7 from your Nakshatra appear as <span style={{ color: "var(--caution)" }}>⚠ Caution Days</span>. Your birth Tithi each month is your <span style={{ color: "var(--teal)" }}>☽ Soul Day</span>.
            </div>
            <button className="ob-btn-primary" onClick={finish}>{t.btn4}</button>
          </div>
        )}

        {step === 3 && !profile && (
          <div className="ob-step">
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--gold-p)", marginBottom: 8 }}>Calendar Ready!</div>
              <div style={{ fontSize: 13, color: "var(--moon-d)", marginBottom: 24 }}>No birth details provided. You can add them anytime from your profile.</div>
            </div>
            <button className="ob-btn-primary" onClick={finish}>{t.btn4}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DAY CELL ─────────────────────────────────────────────────────────────────
function DayCell({ day, isToday, isSelected, myDaysOn, personalType, onClick, delay }) {
  if (!day) return <div className="dc empty" style={{ animationDelay: `${delay}ms` }} />;
  const rahu = RAHU[day.w];
  const isPurnima = day.t === "Purnima";
  const isAmavasya = day.t === "Amavasya";
  const fest = day.f[0];

  let cls = `dc ${day.pk.toLowerCase()}`;
  if (isToday) cls += " is-today";
  if (isSelected) cls += " is-selected";
  if (isPurnima) cls += " purnima";
  if (isAmavasya) cls += " amavasya";
  if (fest) cls += " has-festival";
  if (personalType === "power") cls += " power-day";
  if (personalType === "caution") cls += " caution-day";
  if (personalType === "soul") cls += " soul-day";
  if (myDaysOn && personalType) cls += " amplified";

  const dotColor = personalType === "power" ? "var(--power)" : personalType === "caution" ? "var(--caution)" : personalType === "soul" ? "var(--teal)" : null;

  return (
    <div className={cls} style={{ animationDelay: `${delay}ms`, borderLeftColor: fest ? fest.c : undefined }} onClick={onClick}>
      <div className="dc-top">
        <div className="dc-date">{day.d}</div>
        <div className="dc-right">
          <div className="dc-moon">{getMoon(day.mp)}</div>
          {dotColor && (
            <div className="dc-personal-dot" style={{ background: dotColor, color: dotColor }} title={personalType} />
          )}
        </div>
      </div>
      <div className="dc-tithi">
        <span className="pk-dot" style={{ background: day.pk === "SP" ? "var(--gold)" : "#6880CC" }} />
        {day.t}
      </div>
      <div className="dc-nakshatra">{day.nt}</div>
      {day.a && <div className="dc-yoga">{day.y}</div>}
      {fest && (
        <div className="dc-festival" style={{ background: fest.c + "1A", color: fest.c, border: `1px solid ${fest.c}33` }}>
          <span>{fest.e}</span><span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{fest.n}</span>
        </div>
      )}
      <div className="dc-rahu">
        <div className="dc-rahu-lbl">Rahu {rahu.s}</div>
        <div className="dc-rahu-bar">
          <div className="dc-rahu-fill" style={{ left: `${rahu.sp}%`, width: `${rahu.wp}%` }} />
        </div>
      </div>
    </div>
  );
}

// ─── DAY DETAIL PANEL ─────────────────────────────────────────────────────────
function DayPanel({ day, lang, profile, myDaysOn, personalType, yearNum, monthNum, onClose }) {
  const [tab, setTab] = useState("panchang");
  const t = T[lang];
  const rahu = RAHU[day.w];
  const weekName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day.w];
  const chogSegs = CHOG_SEQ[day.w].map((name, i) => {
    const [h, m] = (day.sr || "6:30 AM").replace(" AM","").split(":").map(Number);
    const startMin = h * 60 + m;
    const segLen = 90;
    const s = startMin + i * segLen;
    const toT = (mn) => { const hh = Math.floor(mn/60); const mm = String(mn%60).padStart(2,"0"); const ap = hh >= 12 ? "PM" : "AM"; const h12 = hh > 12 ? hh-12 : hh || 12; return `${h12}:${mm}${ap}`; };
    return { name, start: toT(s), ...CHOG_P[name] };
  });

  const tabs = [
    { id:"panchang", label: t.panchangLabel },
    { id:"chog", label: t.chogLabel },
    { id:"muhurat", label: t.muhLabel },
    ...(day.f.length > 0 ? [{ id:"fest", label: t.festLabel }] : []),
    { id:"planets", label: t.planetLabel },
    ...(profile && personalType ? [{ id:"personal", label: t.personalLabel }] : []),
  ];

  useEffect(() => {
    setTab(day.f.length > 0 ? "fest" : profile && personalType ? "personal" : "panchang");
  }, [day.d]);

  const monthName = t.months[monthNum];

  return (
    <>
      <div className="dp-overlay" onClick={onClose} />
      <div className="dp-panel">
        <div className="dp-handle" />
        <div className="dp-inner">
          <button className="dp-close" onClick={onClose}>×</button>

          {/* Header */}
          <div className="dp-date-row">
            <div className="dp-big-date">{day.d}</div>
            <div style={{ flex: 1, paddingLeft: 4 }}>
              <div className="dp-day-name">{weekName}</div>
              <div className="dp-gregorian">{monthName} {yearNum}</div>
              <div className="dp-samvat-line">{day.pk === "SP" ? "शुक्ल" : "कृष्ण"} पक्ष · {day.t} · {day.nt}</div>
              {personalType && (
                <div style={{ marginTop: 5, display: "inline-flex", alignItems: "center", gap: 5,
                  background: personalType === "power" ? "rgba(255,215,0,0.12)" : personalType === "caution" ? "rgba(255,107,107,0.1)" : "var(--teal-d)",
                  border: `1px solid ${personalType === "power" ? "rgba(255,215,0,0.3)" : personalType === "caution" ? "rgba(255,107,107,0.25)" : "rgba(24,186,179,0.25)"}`,
                  borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                  color: personalType === "power" ? "var(--power)" : personalType === "caution" ? "var(--caution)" : "var(--teal)",
                }}>
                  {personalType === "power" ? t.powerDay : personalType === "caution" ? t.cautionDay : t.soulDay}
                </div>
              )}
            </div>
            <div className="dp-pills">
              <div className="dp-pill">🌅 <span className="t">{day.sr}</span> <span className="l">RISE</span></div>
              <div className="dp-pill">🌇 <span className="t">{day.ss}</span> <span className="l">SET</span></div>
              <div className="dp-pill">{getMoon(day.mp)} <span className="t">{day.mr}</span> <span className="l">MOON</span></div>
            </div>
          </div>

          {/* Tabs */}
          <div className="dp-tabs">
            {tabs.map(tb => <button key={tb.id} className={`dp-tab ${tab === tb.id ? "on" : ""}`} onClick={() => setTab(tb.id)}>{tb.label}</button>)}
          </div>

          {/* ── PANCHANG ── */}
          {tab === "panchang" && (
            <>
              <div className="dp-sec-title">{t.panchangLabel} · Pancha Anga</div>
              <div className="pancha-grid">
                {[
                  { lbl: t.tithiLabel, val: day.t, dev: day.pk === "SP" ? "शुक्ल पक्ष" : "कृष्ण पक्ष", det: day.pk === "SP" ? "Waxing Moon" : "Waning Moon", ends: "9:42 PM", full: true },
                  { lbl: "Vara", val: weekName, dev: t.weekdaysHi[day.w], det: t.weekdayPlanets[day.w], ends: "All day" },
                  { lbl: t.nashtaLabel, val: day.nt, dev: "नक्षत्र", det: "Lunar mansion", ends: "11:18 PM" },
                  { lbl: t.yogaLabel, val: day.y, dev: "योग", det: "Sun–Moon combination", ends: "8:55 PM" },
                  { lbl: "Karana", val: "Balava", dev: "करण", det: "Half-Tithi period", ends: "10:15 AM" },
                ].map((r, i) => (
                  <div key={i} className={`pancha-card ${r.full ? "span2" : ""}`}>
                    <div className="pc-lbl">{r.lbl}</div>
                    <div className="pc-val">{r.val}</div>
                    <div className="pc-dev">{r.dev}</div>
                    <div className="pc-det">{r.det}</div>
                    <div className="pc-ends">ends {r.ends}</div>
                  </div>
                ))}
              </div>
              <div className="rahu-box">
                <div><div className="rahu-lbl">⛔ {t.rahuLabel}</div><div className="rahu-warn">Avoid new beginnings</div></div>
                <div style={{ textAlign: "right" }}><div className="rahu-time">{rahu.s}</div><div className="rahu-time" style={{ fontSize: 12, opacity: 0.6 }}>to {rahu.e}</div></div>
              </div>
            </>
          )}

          {/* ── CHOGHADIYA ── */}
          {tab === "chog" && (
            <>
              <div className="dp-sec-title">{t.chogLabel} · Day Periods</div>
              <div className="chog-bar">
                {chogSegs.map((s, i) => (
                  <div key={i} className="chog-seg" style={{ background: s.bg, borderRight: i < 7 ? "1px solid rgba(0,0,0,0.2)" : "none" }}>
                    <span className="cs-name" style={{ color: s.c }}>{s.name}</span>
                    <span className="cs-time" style={{ color: s.c }}>{s.start}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {Object.entries(CHOG_P).map(([n, p]) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(234,216,192,0.45)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.c }} />
                    {n}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── MUHURAT ── */}
          {tab === "muhurat" && (
            <>
              <div className="dp-sec-title">{t.muhLabel} · Auspicious Windows</div>
              <div className="muh-list">
                {[
                  { name:"Brahma Muhurat", time:"5:00–6:30 AM", q:"best", c:"#7BC47A", b:"Meditation" },
                  { name:"Abhijit Muhurat", time:"11:45 AM–12:30 PM", q:"best", c:"#18BAB3", b:"Best" },
                  { name:"Vijaya Muhurat", time:"2:15–3:00 PM", q:"good", c:"#C8902A", b:"Victory" },
                  { name:"Godhuli", time:`${day.ss}–7:10 PM`, q:"good", c:"#E5B04A", b:"Twilight" },
                  { name:`${t.rahuLabel}`, time:`${rahu.s}–${rahu.e}`, q:"avoid", c:"#CC4444", b:"Avoid" },
                  { name:"Gulika Kalam", time:"3:00–4:30 PM", q:"avoid", c:"#996699", b:"Caution" },
                ].map((m, i) => (
                  <div key={i} className="muh-item">
                    <div className="muh-dot" style={{ background: m.c }} />
                    <div className="muh-name">{m.name}</div>
                    <div className="muh-time">{m.time}</div>
                    <div className="muh-badge" style={{ background: m.c + "22", color: m.c, border: `1px solid ${m.c}44` }}>{m.b}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── FESTIVAL ── */}
          {tab === "fest" && day.f.map((f, fi) => (
            <div key={fi}>
              <div className="personal-day-card" style={{ background: f.c + "18", border: `1px solid ${f.c}33` }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{f.e}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: "var(--moon)", marginBottom: 6 }}>{f.n}</div>
                <div style={{ fontSize: 12, color: "rgba(234,216,192,0.4)", marginBottom: 10 }}>{day.t} · {day.pk === "SP" ? "Shukla" : "Krishna"} Paksha · {day.nt} Nakshatra</div>
                <div style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(234,216,192,0.7)" }}>
                  A sacred day according to the <strong style={{ color: "var(--gold-p)" }}>Hindu Panchang</strong>. Observe fast, light diyas, and recite relevant mantras.
                </div>
              </div>
            </div>
          ))}

          {/* ── PLANETS ── */}
          {tab === "planets" && (
            <>
              <div className="dp-sec-title">{t.planetLabel} · Planetary Positions</div>
              <div className="planet-row">
                {PLANETS.map(p => (
                  <div key={p.name} className="planet-card">
                    <div className="planet-sym">{p.sym}</div>
                    <div className="planet-name">{p.name}</div>
                    <div className="planet-rashi">{p.rashi}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── PERSONAL ── */}
          {tab === "personal" && profile && personalType && (
            <>
              <div className="dp-sec-title">{t.personalLabel}</div>
              <div className="personal-day-card" style={{
                background: personalType === "power" ? "var(--power-d)" : personalType === "caution" ? "var(--caution-d)" : "var(--teal-d)",
                border: `1px solid ${personalType === "power" ? "rgba(255,215,0,0.25)" : personalType === "caution" ? "rgba(255,107,107,0.2)" : "rgba(24,186,179,0.2)"}`,
              }}>
                <div className="pdc-type" style={{ background: personalType === "power" ? "rgba(255,215,0,0.15)" : personalType === "caution" ? "rgba(255,107,107,0.12)" : "rgba(24,186,179,0.1)", color: personalType === "power" ? "var(--power)" : personalType === "caution" ? "var(--caution)" : "var(--teal)" }}>
                  {personalType === "power" ? t.powerDay : personalType === "caution" ? t.cautionDay : t.soulDay}
                </div>
                <div className="pdc-title">
                  {personalType === "power" ? `${profile.nakshatra} Active` : personalType === "caution" ? "Sensitive Transit" : `${profile.tithi} Returns`}
                </div>
                <div className="pdc-body" dangerouslySetInnerHTML={{ __html: personalType === "power" ? t.powerDayDesc : personalType === "caution" ? t.cautionDayDesc : t.soulDayDesc }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  { l: "Your Nakshatra", v: profile.nakshatra, i: "⭐" },
                  { l: "Your Rashi", v: profile.rashi, i: "♉" },
                  { l: "Your Tithi", v: profile.tithi, i: "🌙" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "var(--ink)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{item.i}</div>
                    <div style={{ fontSize: 8, letterSpacing: 1, color: "rgba(234,216,192,0.3)", textTransform: "uppercase", fontFamily: "'Cormorant',serif", marginBottom: 3 }}>{item.l}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, fontWeight: 700, color: "var(--gold-p)" }}>{item.v}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AuraPanchangFull() {
  const [lang, setLang] = useState("en");
  const [myDaysOn, setMyDaysOn] = useState(false);
  const [showOnboard, setShowOnboard] = useState(true);
  const [user, setUser] = useState(null);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(2); // March = 2
  const [selectedDay, setSelectedDay] = useState(16);
  const [showPanel, setShowPanel] = useState(false);

  const t = T[lang];
  const TODAY_YEAR = 2026, TODAY_MONTH = 2, TODAY_DAY = 16;
  const monthData = buildMonthData(viewYear, viewMonth);
  const { days, firstDay, daysInMonth } = monthData;

  const profile = user?.profile || null;

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  // Build grid cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  days.forEach(d => cells.push(d));
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedDayData = days[selectedDay - 1];
  const personalType = selectedDayData ? getDayPersonalType(selectedDayData, profile) : null;

  // Count personal days this month
  const powerCount = profile ? days.filter(d => getDayPersonalType(d, profile) === "power").length : 0;
  const cautionCount = profile ? days.filter(d => getDayPersonalType(d, profile) === "caution").length : 0;

  // Samvat values by month
  const vikram = viewYear - 57 + (viewMonth >= 3 ? 1 : 0) + 2082 - 1969;
  const svValues = { vikram: `${viewYear - 57 + 2081}`, shaka: `${viewYear - 78}`, fasli: "1432-33", hijri: "1447", bangla: "1432", nepali: "1145" };

  // Month hi names
  const hiMonths = ["पौष","माघ","फाल्गुन","चैत्र","वैशाख","ज्येष्ठ","आषाढ","श्रावण","भाद्रपद","आश्विन","कार्तिक","मार्गशीर्ष"];

  return (
    <>
      <style>{STYLE}</style>
      <div className="ap-bg" /><div className="ap-noise" />

      {showOnboard && (
        <Onboarding lang={lang} onComplete={(userData) => {
          setUser(userData);
          setShowOnboard(false);
          if (userData?.profile) setMyDaysOn(true);
        }} />
      )}

      <div className="ap-root">

        {/* ── TOP BAR ── */}
        <div className="ap-topbar">
          <div className="ap-logo-wrap">
            <div className="ap-logo-icon">🕉️</div>
            <div>
              <div className="ap-logo-text">AuraPanchang</div>
              <div className="ap-logo-sub" style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari'" : "inherit" }}>
                {t.appSub}
              </div>
            </div>
          </div>
          <div className="ap-topbar-right">
            <div className="lang-switcher">
              {["en","hi","gu","mr","bn"].map(l => (
                <button key={l} className={`lang-btn ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>
                  {T[l].langName}
                </button>
              ))}
            </div>
            <div className={`mydays-toggle ${myDaysOn ? "on" : ""}`} onClick={() => setMyDaysOn(v => !v)}>
              <span className="mydays-toggle-label">{t.myDays}</span>
              <div className="toggle-pill"><div className="toggle-thumb" /></div>
            </div>
            <div className={`profile-btn ${profile ? "has-profile" : ""}`} onClick={() => setShowOnboard(true)} title="Edit profile">
              {profile ? "👤" : "➕"}
            </div>
          </div>
        </div>

        {/* ── SAMVAT STRIP ── */}
        <div className="samvat-strip">
          {[
            { lbl: t.vikram, val: svValues.vikram },
            { lbl: t.shaka, val: svValues.shaka },
            { lbl: t.fasli, val: svValues.fasli },
            { lbl: t.hijri, val: svValues.hijri },
            { lbl: t.bangla, val: svValues.bangla },
            { lbl: t.nepali, val: svValues.nepali },
          ].map(s => (
            <div key={s.lbl} className="sv-item">
              <span className="sv-label">{s.lbl}</span>
              <span className="sv-value">{s.val}</span>
            </div>
          ))}
        </div>

        {/* ── PERSONAL ENERGY STRIP ── */}
        {profile && myDaysOn && (
          <div className="energy-strip" style={{ marginTop: 14 }}>
            <div className="energy-strip-avatar">🌟</div>
            <div>
              <div className="energy-strip-name">{user?.name || "You"}</div>
              <div className="energy-strip-sub">⭐ {profile.nakshatra} · {profile.rashi} · {profile.tithi}</div>
            </div>
            <div className="energy-pills">
              <span className="energy-pill ep-power">✦ {powerCount} Power Days</span>
              <span className="energy-pill ep-caution">⚠ {cautionCount} Caution Days</span>
            </div>
          </div>
        )}

        {/* ── MONTH NAV ── */}
        <div className="month-nav">
          <button className="mnav-btn" onClick={prevMonth}>‹</button>
          <div className="month-center">
            <div className="month-en">{t.months[viewMonth]}</div>
            <span className="month-hi" style={{ fontFamily: lang === "gu" ? "'Noto Sans Gujarati'" : lang === "bn" ? "'Noto Sans Bengali'" : "'Noto Sans Devanagari'" }}>
              {lang === "en" ? hiMonths[viewMonth] : t.monthsHi[viewMonth]}
            </span>
            <div>
              <span className="month-badge">🕉️ {T.en.vikram} {svValues.vikram} · {t.season}</span>
            </div>
          </div>
          <button className="mnav-btn" onClick={nextMonth}>›</button>
        </div>
        <div className="month-season">
          <em>{t.maas1}</em> · <span>{viewYear}</span> · <em>{t.maas2}</em> · <span>{t.sun}</span>
        </div>

        {/* ── WEEKDAY HEADERS ── */}
        <div className="wday-row">
          {RAHU && [0,1,2,3,4,5,6].map(i => (
            <div key={i} className="wday-cell">
              <span className="wday-hi" style={{ fontFamily: lang === "gu" ? "'Noto Sans Gujarati'" : lang === "bn" ? "'Noto Sans Bengali'" : "'Noto Sans Devanagari'" }}>
                {t.weekdays[i]}
              </span>
              <span className="wday-en">{T.en.weekdays[i]}</span>
              <span className="wday-pl">{T.en.weekdayPlanets[i]}</span>
            </div>
          ))}
        </div>

        {/* ── CALENDAR GRID ── */}
        <div className="cal-grid">
          {cells.map((day, i) => (
            <DayCell
              key={i}
              day={day}
              isToday={day?.d === TODAY_DAY && viewYear === TODAY_YEAR && viewMonth === TODAY_MONTH}
              isSelected={day?.d === selectedDay}
              myDaysOn={myDaysOn}
              personalType={profile ? getDayPersonalType(day, profile) : null}
              delay={i * 10}
              onClick={() => { if (day) { setSelectedDay(day.d); setShowPanel(true); } }}
            />
          ))}
        </div>

        {/* ── LEGEND ── */}
        <div className="cal-legend">
          <div className="leg-item"><div className="leg-swatch" style={{ background: "rgba(200,144,42,0.2)", border: "1px solid rgba(200,144,42,0.35)" }} /><span>Shukla Paksha</span></div>
          <div className="leg-item"><div className="leg-swatch" style={{ background: "rgba(70,90,200,0.15)", border: "1px solid rgba(70,90,200,0.3)" }} /><span>Krishna Paksha</span></div>
          <div className="leg-item"><div className="leg-swatch" style={{ borderLeft: "3px solid var(--gold-l)", background: "var(--ink)" }} /><span>Festival</span></div>
          <div className="leg-item"><div className="leg-swatch" style={{ background: "var(--teal-d)", border: "1px solid rgba(24,186,179,0.3)" }} /><span>Auspicious Yoga</span></div>
          <div className="leg-item"><div className="leg-line" style={{ background: "linear-gradient(90deg, rgba(200,50,50,0.7), transparent)" }} /><span>Rahu Kalam</span></div>
          {profile && <>
            <div className="leg-item"><div className="leg-swatch" style={{ background: "var(--power-d)", border: "1px solid rgba(255,215,0,0.4)" }} /><span>✦ Power Day</span></div>
            <div className="leg-item"><div className="leg-swatch" style={{ background: "var(--caution-d)", border: "1px solid rgba(255,107,107,0.35)" }} /><span>⚠ Caution Day</span></div>
            <div className="leg-item"><div className="leg-swatch" style={{ background: "var(--teal-d)", border: "1px solid rgba(24,186,179,0.4)" }} /><span>☽ Soul Day</span></div>
          </>}
        </div>

        {/* ── TITHI SCHEDULE ── */}
        <div className="tithi-summary">
          <div className="ts-title">{t.tithiSchedule} — {t.months[viewMonth]} {viewYear}</div>
          <div className="ts-grid">
            {days.filter(d => d.f.length > 0 || ["Purnima","Amavasya","Ekadashi","Chaturdashi"].includes(d.t)).map(d => (
              <div key={d.d} className="ts-item" onClick={() => { setSelectedDay(d.d); setShowPanel(true); }}>
                <div className="ts-day" style={{ borderLeft: `3px solid ${d.pk === "SP" ? "rgba(200,144,42,0.5)" : "rgba(70,90,200,0.5)"}`, paddingLeft: 8, borderRadius: 2 }}>{d.d}</div>
                <div>
                  <div className="ts-name">{d.t}</div>
                  <div className="ts-note">{d.f[0]?.n || (d.t === "Purnima" ? "🌕 Full Moon" : d.t === "Amavasya" ? "🌑 New Moon" : "")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── DAY PANEL ── */}
      {showPanel && selectedDayData && (
        <DayPanel
          day={selectedDayData}
          lang={lang}
          profile={profile}
          myDaysOn={myDaysOn}
          personalType={personalType}
          yearNum={viewYear}
          monthNum={viewMonth}
          onClose={() => setShowPanel(false)}
        />
      )}
    </>
  );
}
