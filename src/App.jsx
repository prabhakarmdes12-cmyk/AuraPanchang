import React, { useState, useEffect, useRef } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Cormorant:wght@300;400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Noto+Sans+Devanagari:wght@300;400;500;600&family=Noto+Sans+Gujarati:wght@300;400;500&family=Noto+Sans+Bengali:wght@300;400;500&display=swap');

  :root {
    --void:#04050A; --deep:#070810; --panel:#0C0D18; --card:#0F1020;
    --gold:#C8902A; --gold-l:#E5B04A; --gold-p:#F2D080; --gold-d:rgba(200,144,42,0.12);
    --saffron:#D06025; --lotus:#B85580; --lotus-l:#D8729A;
    --teal:#18BAB3; --teal-d:rgba(24,186,179,0.1);
    --moon:#EAD8C0; --moon-d:rgba(234,216,192,0.5);
    --ink:rgba(234,216,192,0.06); --ink2:rgba(234,216,192,0.1); --ink3:rgba(234,216,192,0.16);
    --border:rgba(200,144,42,0.12); --border2:rgba(200,144,42,0.22);
    --power:#FFD700; --caution:#FF6B6B;
    --power-d:rgba(255,215,0,0.12); --caution-d:rgba(255,107,107,0.1);
  }
  :root[data-theme="light"] {
    --void:#F5EDD8; --deep:#EDE0C4; --panel:#E8D5B0; --card:#F0E4C8;
    --gold:#8B5E0A; --gold-l:#A67412; --gold-p:#6B4400; --gold-d:rgba(139,94,10,0.1);
    --saffron:#C0440A; --lotus:#9B3060; --lotus-l:#B84C7A;
    --teal:#0A7A74; --teal-d:rgba(10,122,116,0.1);
    --moon:#2C1A00; --moon-d:rgba(44,26,0,0.6);
    --ink:rgba(44,26,0,0.06); --ink2:rgba(44,26,0,0.1); --ink3:rgba(44,26,0,0.16);
    --border:rgba(139,94,10,0.18); --border2:rgba(139,94,10,0.3);
    --power:#7A5500; --caution:#B02020;
    --power-d:rgba(122,85,0,0.1); --caution-d:rgba(176,32,32,0.08);
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--void);color:var(--moon);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;transition:background 0.3s,color 0.3s;}
  .ap-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 15% 0%,rgba(200,144,42,0.07) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 85% 100%,rgba(184,85,128,0.05) 0%,transparent 60%);}
  :root[data-theme="light"] .ap-bg{background:radial-gradient(ellipse 70% 50% at 15% 0%,rgba(139,94,10,0.08) 0%,transparent 60%);}
  .ap-noise{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.35;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");}
  :root[data-theme="light"] .ap-noise{opacity:0.1;}
  .ap-root{position:relative;z-index:1;max-width:1300px;margin:0 auto;padding:0 12px 80px;}

  .ap-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 0 10px;gap:8px;flex-wrap:wrap;border-bottom:1px solid var(--border);}
  .ap-logo-wrap{display:flex;align-items:center;gap:10px;}
  .ap-logo-icon{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--saffron),var(--gold));display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 16px rgba(200,144,42,0.35);}
  .ap-logo-text{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;background:linear-gradient(135deg,var(--gold-p),var(--gold-l));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:1px;}
  :root[data-theme="light"] .ap-logo-text{background:linear-gradient(135deg,#6B4400,#A67412);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .ap-logo-sub{font-size:8px;letter-spacing:3px;color:rgba(200,144,42,0.4);text-transform:uppercase;margin-top:-2px;}
  .ap-topbar-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .theme-toggle{width:36px;height:36px;border-radius:50%;background:var(--ink);border:1px solid var(--border);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;-webkit-tap-highlight-color:transparent;}
  .lang-switcher{display:flex;gap:2px;background:var(--ink);border:1px solid var(--border);border-radius:20px;padding:3px;overflow-x:auto;scrollbar-width:none;}
  .lang-switcher::-webkit-scrollbar{display:none;}
  .lang-btn{padding:5px 10px;border-radius:16px;background:none;border:none;color:var(--moon-d);cursor:pointer;font-size:11px;font-weight:500;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:all 0.2s;-webkit-tap-highlight-color:transparent;}
  .lang-btn.active{background:linear-gradient(135deg,rgba(200,144,42,0.2),rgba(208,96,37,0.15));color:var(--gold-p);border:1px solid rgba(200,144,42,0.25);}
  .mydays-toggle{display:flex;align-items:center;gap:8px;padding:7px 12px;background:var(--ink);border:1px solid var(--border);border-radius:20px;cursor:pointer;transition:all 0.2s;user-select:none;-webkit-tap-highlight-color:transparent;}
  .mydays-toggle.on{background:var(--power-d);border-color:rgba(255,215,0,0.35);}
  .mydays-toggle-label{font-size:12px;font-weight:500;color:var(--moon-d);}
  .mydays-toggle.on .mydays-toggle-label{color:var(--power);}
  .toggle-pill{width:32px;height:16px;border-radius:8px;background:var(--ink2);position:relative;transition:background 0.2s;}
  .mydays-toggle.on .toggle-pill{background:rgba(255,215,0,0.3);}
  .toggle-thumb{width:12px;height:12px;border-radius:50%;background:var(--moon-d);position:absolute;top:2px;left:2px;transition:all 0.2s;}
  .mydays-toggle.on .toggle-thumb{left:18px;background:var(--power);box-shadow:0 0 6px rgba(255,215,0,0.5);}
  .profile-btn{width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid var(--border);transition:all 0.2s;background:var(--ink);-webkit-tap-highlight-color:transparent;}
  .profile-btn.has-profile{border-color:var(--gold);background:var(--gold-d);}

  .samvat-strip{display:flex;align-items:center;border-bottom:1px solid var(--border);overflow-x:auto;scrollbar-width:none;}
  .samvat-strip::-webkit-scrollbar{display:none;}
  .sv-item{display:flex;flex-direction:column;align-items:center;padding:6px 12px;border-right:1px solid var(--border);flex-shrink:0;}
  .sv-item:last-child{border-right:none;}
  .sv-label{font-size:7px;letter-spacing:2px;text-transform:uppercase;color:var(--moon-d);font-family:'Cormorant',serif;opacity:0.5;}
  .sv-value{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:600;color:var(--gold-p);}
  :root[data-theme="light"] .sv-value{color:#6B4400;}

  .month-nav{display:grid;grid-template-columns:56px 1fr 56px;align-items:center;padding:20px 0 16px;gap:12px;}
  .mnav-btn{width:52px;height:52px;border-radius:50%;background:var(--ink);border:1px solid var(--border);color:var(--gold-l);font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-family:'Cormorant Garamond',serif;-webkit-tap-highlight-color:transparent;}
  .mnav-btn:hover{background:var(--gold-d);border-color:var(--gold);}
  .month-center{text-align:center;}
  .month-en{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:clamp(28px,7vw,60px);letter-spacing:10px;text-transform:uppercase;color:var(--moon);line-height:1;position:relative;display:inline-block;}
  .month-en::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
  .month-hi{font-family:'Noto Sans Devanagari',sans-serif;font-size:14px;font-weight:300;color:var(--moon-d);letter-spacing:4px;margin-top:6px;display:block;opacity:0.7;}
  .month-badge{display:inline-flex;align-items:center;gap:6px;margin-top:10px;background:var(--gold-d);border:1px solid rgba(200,144,42,0.2);border-radius:20px;padding:4px 14px;font-family:'Cormorant',serif;font-size:11px;color:var(--gold-p);letter-spacing:1px;}
  .month-season{display:flex;align-items:center;justify-content:center;gap:12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--moon-d);padding-bottom:14px;font-family:'Cormorant',serif;opacity:0.55;}
  .month-season em{color:var(--gold-l);font-style:normal;opacity:1;}

  .energy-strip{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--power-d);border:1px solid rgba(255,215,0,0.2);border-radius:14px;margin-bottom:12px;}
  .energy-strip-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--saffron));display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
  .energy-strip-name{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--gold-p);}
  .energy-strip-sub{font-size:10px;color:var(--moon-d);}
  .energy-pills{display:flex;gap:6px;margin-left:auto;flex-wrap:wrap;}
  .energy-pill{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;white-space:nowrap;font-family:'Cormorant',serif;}
  .ep-power{background:rgba(255,215,0,0.15);color:var(--power);border:1px solid rgba(255,215,0,0.3);}
  .ep-caution{background:rgba(255,107,107,0.12);color:var(--caution);border:1px solid rgba(255,107,107,0.25);}

  .wday-row{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:2px;}
  .wday-cell{padding:8px 4px;text-align:center;border-bottom:1px solid var(--border);}
  .wday-hi{font-family:'Noto Sans Devanagari',sans-serif;font-size:12px;color:var(--gold);display:block;font-weight:500;}
  .wday-en{font-size:8px;letter-spacing:1px;text-transform:uppercase;color:var(--moon-d);display:block;margin-top:2px;opacity:0.4;}
  .wday-pl{font-size:7px;color:var(--moon-d);display:block;margin-top:1px;opacity:0.25;}

  .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}

  .dc{min-height:100px;padding:8px 7px 0;position:relative;cursor:pointer;overflow:hidden;border:1px solid var(--border);transition:all 0.18s cubic-bezier(0.2,0.8,0.2,1);display:flex;flex-direction:column;background:var(--deep);animation:cellIn 0.3s ease both;-webkit-tap-highlight-color:transparent;}
  @keyframes cellIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
  .dc.sp{background:linear-gradient(160deg,rgba(200,144,42,0.03) 0%,var(--deep) 100%);}
  .dc.kp{background:linear-gradient(160deg,rgba(70,90,200,0.05) 0%,var(--deep) 100%);}
  :root[data-theme="light"] .dc.sp{background:linear-gradient(160deg,rgba(139,94,10,0.05) 0%,#EDE0C4 100%);}
  :root[data-theme="light"] .dc.kp{background:linear-gradient(160deg,rgba(70,90,200,0.04) 0%,#EDE0C4 100%);}
  .dc.empty{opacity:0.12;pointer-events:none;background:var(--void);}
  .dc:hover{border-color:rgba(200,144,42,0.4);transform:scale(1.02);z-index:5;box-shadow:0 4px 20px rgba(0,0,0,0.3);}
  .dc.is-today{border-color:var(--gold)!important;background:rgba(200,144,42,0.07)!important;box-shadow:0 0 18px rgba(200,144,42,0.15);}
  .dc.is-today::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
  .dc.is-selected{border-color:var(--gold-l)!important;background:rgba(200,144,42,0.1)!important;}
  .dc.purnima{animation:cellIn 0.3s ease both,purnimaG 5s 0.3s ease-in-out infinite;border-color:rgba(200,144,42,0.35)!important;}
  @keyframes purnimaG{0%,100%{box-shadow:0 0 12px rgba(200,144,42,0.1)}50%{box-shadow:0 0 28px rgba(200,144,42,0.25)}}
  .dc.amavasya{border-color:rgba(90,100,200,0.2)!important;}
  .dc.has-festival{border-left-width:3px;}
  .dc.power-day{border-color:rgba(255,215,0,0.45)!important;}
  .dc.caution-day{border-color:rgba(255,107,107,0.4)!important;}
  .dc.soul-day{border-color:rgba(24,186,179,0.45)!important;}
  .dc.amplified.power-day{background:rgba(255,215,0,0.07)!important;animation:cellIn 0.3s ease both,powerGlow 4s 0.3s ease-in-out infinite;}
  @keyframes powerGlow{0%,100%{box-shadow:0 0 14px rgba(255,215,0,0.12)}50%{box-shadow:0 0 32px rgba(255,215,0,0.28)}}
  .dc.amplified.caution-day{background:rgba(255,107,107,0.06)!important;}
  .dc.amplified.soul-day{background:rgba(24,186,179,0.07)!important;}

  .dc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:3px;}
  .dc-date{font-family:'Cormorant Garamond',serif;font-size:clamp(20px,3vw,28px);font-weight:300;line-height:1;color:var(--moon);letter-spacing:-1px;}
  :root[data-theme="light"] .dc-date{color:#2C1A00;}
  .is-today .dc-date{color:var(--gold-p);font-weight:600;}
  .dc-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px;}
  .dc-moon{font-size:12px;opacity:0.6;}
  .dc-personal-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .dc-tithi{font-family:'Cormorant Garamond',serif;font-size:9px;font-weight:600;color:var(--gold-l);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;display:flex;align-items:center;gap:3px;}
  :root[data-theme="light"] .dc-tithi{color:#8B5E0A;}
  .pk-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
  .dc-nakshatra{font-size:8px;color:var(--moon-d);margin-bottom:2px;display:flex;align-items:center;gap:2px;opacity:0.55;}
  .dc-nakshatra::before{content:'✦';font-size:6px;color:rgba(200,144,42,0.4);}
  .dc-yoga{display:inline-block;background:var(--teal-d);border:1px solid rgba(24,186,179,0.18);border-radius:3px;padding:1px 4px;font-size:7px;color:var(--teal);margin-bottom:2px;font-family:'Cormorant',serif;font-weight:600;}
  .dc-festival{margin-top:auto;padding:2px 5px;border-radius:3px;font-size:8px;font-weight:600;display:flex;align-items:center;gap:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'Cormorant',serif;max-width:100%;}
  .dc-rahu{margin-top:auto;padding-top:3px;}
  .dc-rahu-lbl{font-size:6px;letter-spacing:1px;color:rgba(200,80,80,0.5);text-transform:uppercase;font-family:'Cormorant',serif;margin-bottom:1px;}
  .dc-rahu-bar{height:3px;width:100%;background:var(--ink2);border-radius:1px;position:relative;overflow:hidden;margin-bottom:6px;}
  .dc-rahu-fill{position:absolute;top:0;height:100%;background:linear-gradient(90deg,rgba(200,50,50,0.75),rgba(200,80,50,0.55));border-radius:1px;}

  .cal-legend{display:flex;flex-wrap:wrap;gap:8px 14px;padding:12px 0;border-top:1px solid var(--border);margin-top:4px;font-size:10px;color:var(--moon-d);}
  .leg-item{display:flex;align-items:center;gap:5px;}
  .leg-swatch{width:10px;height:10px;border-radius:2px;flex-shrink:0;}
  .leg-line{width:20px;height:3px;border-radius:2px;}

  .tithi-summary{margin-top:18px;border-top:1px solid var(--border);padding-top:16px;}
  .ts-title{font-family:'Cormorant',serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--saffron);margin-bottom:12px;display:flex;align-items:center;gap:10px;}
  .ts-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(208,96,37,0.3),transparent);}
  .ts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:7px;}
  .ts-item{display:flex;gap:10px;align-items:center;background:var(--ink);border:1px solid var(--border);border-radius:8px;padding:8px 12px;cursor:pointer;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
  .ts-item:hover{background:var(--gold-d);}
  .ts-day{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--gold-p);min-width:28px;line-height:1;}
  .ts-name{font-family:'Cormorant',serif;font-size:12px;color:var(--moon);font-weight:600;}
  .ts-note{font-size:9px;color:var(--moon-d);margin-top:2px;opacity:0.6;}

  /* ═══════════════════════════════════════
     SPLIT LAYOUT
     split-detail: HIDDEN on mobile, VISIBLE on desktop
  ═══════════════════════════════════════ */
  .split-layout{display:block;}
  .split-cal{width:100%;}
  .split-detail{display:none;}

  @media(min-width:900px){
    .ap-root{max-width:1400px;}
    .split-layout{display:grid;grid-template-columns:1fr 380px;gap:0;align-items:start;}
    .split-cal{min-width:0;}
    .split-detail{display:block;position:sticky;top:80px;height:calc(100vh - 100px);overflow-y:auto;background:var(--panel);border:1px solid var(--border);border-radius:20px;margin-left:16px;scrollbar-width:thin;}
    .dc{min-height:118px;}
  }
  @media(min-width:1200px){
    .split-layout{grid-template-columns:1fr 420px;}
    .dc{min-height:128px;}
  }

  .detail-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:380px;text-align:center;padding:32px;}
  .detail-placeholder-icon{font-size:48px;margin-bottom:14px;opacity:0.25;}
  .detail-placeholder-text{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:300;color:var(--gold);opacity:0.45;line-height:1.6;}

  /* ═══════════════════════════════════════
     MOBILE BOTTOM SHEET
  ═══════════════════════════════════════ */
  .dp-overlay{
    position:fixed;inset:0;z-index:500;
    background:rgba(0,0,0,0.6);
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
    animation:fadeIn 0.2s ease;
  }
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}

  .dp-panel{
    position:fixed;bottom:0;left:0;right:0;
    z-index:600;
    background:var(--panel);
    border-top:1px solid rgba(200,144,42,0.25);
    border-radius:24px 24px 0 0;
    max-height:82vh;
    overflow-y:auto;
    animation:panelUp 0.35s cubic-bezier(0.32,0.72,0,1);
    scrollbar-width:thin;
  }
  @keyframes panelUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .dp-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}

  .dp-handle{width:44px;height:5px;background:var(--ink3);border-radius:3px;margin:14px auto 0;cursor:pointer;}

  /* CLOSE BUTTON — large, always tappable */
  .dp-close{
    position:absolute;top:10px;right:10px;
    width:44px;height:44px;
    border-radius:50%;
    background:rgba(234,216,192,0.12);
    border:1.5px solid var(--border2);
    color:var(--moon);
    cursor:pointer;
    font-size:22px;font-weight:300;
    display:flex;align-items:center;justify-content:center;
    z-index:900;
    -webkit-tap-highlight-color:transparent;
    touch-action:manipulation;
    transition:background 0.2s;
  }
  .dp-close:active{background:rgba(200,144,42,0.25);}

  /* Desktop inline panel — no overlay chrome needed */
  .dp-panel-desktop{padding:0;}
  .dp-panel-desktop .dp-handle{display:none;}
  .dp-panel-desktop .dp-close{display:none;}

  .dp-inner{padding:16px 18px 36px;position:relative;}
  .dp-inner-desktop{padding-top:8px;}
  .dp-date-row{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border);padding-top:56px;}
  .dp-date-row-desktop{padding-top:16px;}
  .dp-big-date{font-family:'Cormorant Garamond',serif;font-size:60px;font-weight:300;line-height:1;color:var(--gold-p);letter-spacing:-3px;}
  .dp-day-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;color:var(--moon);}
  .dp-gregorian{font-size:10px;letter-spacing:2px;color:var(--moon-d);text-transform:uppercase;margin-top:2px;opacity:0.6;}
  .dp-samvat-line{font-family:'Noto Sans Devanagari',sans-serif;font-size:11px;color:var(--moon-d);margin-top:4px;opacity:0.55;}
  .dp-pills{display:flex;flex-direction:column;gap:5px;align-items:flex-end;margin-left:auto;flex-shrink:0;}
  .dp-pill{background:var(--ink);border:1px solid var(--border);border-radius:20px;padding:4px 10px;font-family:'Cormorant Garamond',serif;display:flex;align-items:center;gap:4px;font-size:11px;white-space:nowrap;}
  .dp-pill .t{color:var(--gold-p);font-weight:600;}
  .dp-pill .l{color:var(--moon-d);font-size:9px;opacity:0.6;}
  .dp-tabs{display:flex;gap:3px;background:var(--ink);padding:4px;border-radius:12px;border:1px solid var(--border);margin-bottom:16px;overflow-x:auto;scrollbar-width:none;}
  .dp-tabs::-webkit-scrollbar{display:none;}
  .dp-tab{flex-shrink:0;padding:7px 11px;border-radius:8px;background:none;border:none;color:var(--moon-d);cursor:pointer;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;transition:all 0.2s;-webkit-tap-highlight-color:transparent;}
  .dp-tab.on{background:linear-gradient(135deg,rgba(200,144,42,0.18),rgba(208,96,37,0.1));color:var(--gold-p);border:1px solid rgba(200,144,42,0.22);}
  .dp-sec-title{font-family:'Cormorant',serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--saffron);margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .dp-sec-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(208,96,37,0.3),transparent);}
  .pancha-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:20px;}
  .pancha-card{background:var(--ink);border:1px solid var(--border);border-radius:12px;padding:12px 14px;position:relative;overflow:hidden;}
  .pancha-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(to bottom,var(--gold),transparent);}
  .pancha-card.span2{grid-column:span 2;}
  .pc-lbl{font-family:'Cormorant',serif;font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--moon-d);margin-bottom:3px;opacity:0.55;}
  .pc-val{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--gold-p);}
  .pc-dev{font-family:'Noto Sans Devanagari',sans-serif;font-size:10px;color:var(--moon-d);margin-top:2px;opacity:0.45;}
  .pc-det{font-size:10px;color:var(--moon-d);margin-top:2px;opacity:0.55;}
  .pc-ends{position:absolute;right:10px;top:10px;font-size:8px;color:var(--moon-d);font-family:'Cormorant',serif;opacity:0.35;}
  .chog-bar{display:flex;height:50px;border-radius:8px;overflow:hidden;border:1px solid var(--border);margin-bottom:8px;}
  .chog-seg{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;border-right:1px solid rgba(0,0,0,0.2);}
  .chog-seg:last-child{border-right:none;}
  .cs-name{font-size:9px;font-family:'Cormorant',serif;font-weight:700;}
  .cs-time{font-size:7px;opacity:0.7;margin-top:1px;}
  .muh-list{display:flex;flex-direction:column;gap:6px;margin-bottom:18px;}
  .muh-item{display:flex;align-items:center;gap:10px;padding:10px 13px;background:var(--ink);border:1px solid var(--border);border-radius:10px;}
  .muh-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  .muh-name{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--moon);flex:1;}
  .muh-time{font-size:11px;color:var(--gold-p);font-family:'Cormorant Garamond',serif;font-weight:600;}
  .muh-badge{font-size:8px;padding:2px 8px;border-radius:10px;font-weight:700;}
  .rahu-box{background:rgba(180,40,40,0.08);border:1px solid rgba(180,40,40,0.2);border-radius:10px;padding:12px 15px;display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
  .rahu-lbl{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--moon);}
  .rahu-warn{font-size:10px;color:rgba(200,80,80,0.6);margin-top:2px;}
  .rahu-time{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:#CC4444;}
  .planet-row{display:flex;overflow-x:auto;gap:7px;padding-bottom:4px;scrollbar-width:none;margin-bottom:18px;}
  .planet-row::-webkit-scrollbar{display:none;}
  .planet-card{flex-shrink:0;background:var(--ink);border:1px solid var(--border);border-radius:10px;padding:10px 12px;text-align:center;min-width:74px;}
  .planet-sym{font-size:17px;margin-bottom:3px;}
  .planet-name{font-size:9px;color:var(--moon-d);opacity:0.6;}
  .planet-rashi{font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--gold-p);font-weight:600;margin-top:2px;}
  .personal-day-card{border-radius:16px;padding:16px;margin-bottom:16px;}
  .pdc-type{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Cormorant',serif;margin-bottom:10px;}
  .pdc-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--moon);margin-bottom:6px;}
  .pdc-body{font-size:13px;line-height:1.75;color:var(--moon-d);}
  .pdc-body strong{color:var(--gold-p);font-weight:500;}

  /* TOOLTIP */
  .dc-tooltip{position:fixed;z-index:300;background:var(--panel);border:1px solid var(--border2);border-radius:14px;padding:12px 16px;min-width:210px;max-width:250px;box-shadow:0 8px 32px rgba(0,0,0,0.4);pointer-events:none;animation:tooltipIn 0.15s ease;}
  @keyframes tooltipIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
  .dc-tooltip-date{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:700;color:var(--gold-p);margin-bottom:8px;}
  .dc-tooltip-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--border);}
  .dc-tooltip-row:last-of-type{border-bottom:none;}
  .dc-tooltip-key{font-family:'Cormorant',serif;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--moon-d);opacity:0.55;}
  .dc-tooltip-val{font-family:'Cormorant Garamond',serif;font-size:12px;color:var(--moon);font-weight:600;}
  .dc-tooltip-rahu{margin-top:6px;padding-top:6px;border-top:1px solid var(--border);font-size:10px;color:rgba(200,80,80,0.8);}
  @media(max-width:899px){.dc-tooltip{display:none!important;}}

  /* ONBOARDING */
  .ob-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.4s ease;}
  .ob-card{width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:var(--panel);border:1px solid rgba(200,144,42,0.2);border-radius:28px;padding:32px 28px 24px;position:relative;scrollbar-width:thin;animation:cardUp 0.45s cubic-bezier(0.32,0.72,0,1);}
  @keyframes cardUp{from{opacity:0;transform:translateY(40px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  .ob-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
  .ob-progress{display:flex;justify-content:center;gap:6px;margin-bottom:24px;}
  .ob-dot{width:6px;height:6px;border-radius:50%;background:var(--ink3);transition:all 0.3s;}
  .ob-dot.active{background:var(--gold);width:20px;border-radius:3px;}
  .ob-dot.done{background:rgba(200,144,42,0.5);}
  .ob-step{animation:stepIn 0.35s ease;}
  @keyframes stepIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  .ob-icon{font-size:48px;text-align:center;margin-bottom:10px;}
  .ob-heading{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--gold-p);text-align:center;margin-bottom:6px;line-height:1.2;}
  .ob-sub{font-size:13px;color:var(--moon-d);text-align:center;margin-bottom:24px;line-height:1.6;}
  .ob-sub strong{color:var(--gold-l);font-weight:500;}
  .ob-field{margin-bottom:14px;}
  .ob-label{font-family:'Cormorant',serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--moon-d);display:block;margin-bottom:6px;}
  .ob-input{width:100%;background:var(--ink);border:1px solid var(--border2);border-radius:12px;padding:12px 14px;color:var(--moon);font-family:'DM Sans',sans-serif;font-size:15px;outline:none;transition:border-color 0.2s;-webkit-appearance:none;}
  .ob-input:focus{border-color:var(--gold);}
  .ob-input::placeholder{color:var(--moon-d);opacity:0.4;}
  .ob-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .ob-btn-primary{width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,var(--saffron),var(--gold));border:none;color:white;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;cursor:pointer;letter-spacing:1px;transition:all 0.2s;margin-top:6px;-webkit-tap-highlight-color:transparent;}
  .ob-btn-primary:disabled{opacity:0.4;cursor:not-allowed;}
  .ob-btn-skip{display:block;text-align:center;margin-top:12px;font-size:12px;color:var(--moon-d);cursor:pointer;font-family:'Cormorant',serif;opacity:0.55;-webkit-tap-highlight-color:transparent;}
  .ob-btn-back{position:absolute;top:18px;left:20px;background:var(--ink);border:1px solid var(--border);border-radius:10px;padding:7px 12px;color:var(--moon-d);cursor:pointer;font-size:12px;font-family:'DM Sans',sans-serif;}
  .orc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
  .orc-item{background:var(--ink);border:1px solid var(--border);border-radius:12px;padding:10px 8px;text-align:center;}
  .orc-item-icon{font-size:20px;margin-bottom:3px;}
  .orc-item-lbl{font-size:8px;letter-spacing:1px;text-transform:uppercase;color:var(--moon-d);font-family:'Cormorant',serif;}
  .orc-item-val{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;color:var(--gold-p);margin-top:2px;}

  @media(max-width:640px){
    .dc{min-height:72px;padding:5px 4px 0;}
    .dc-date{font-size:17px;}
    .dc-nakshatra{display:none;}
    .dc-yoga{display:none;}
    .energy-pills{display:none;}
    .ob-card{padding:22px 18px 20px;}
    .month-en{letter-spacing:5px;}
  }
  @media(max-width:380px){
    .dc-moon{display:none;}
    .dc-rahu-lbl{display:none;}
    .wday-pl{display:none;}
  }
`;

const T={
  en:{appSub:"Ancient Wisdom · Modern Vibes",langName:"English",myDays:"My Days",weekdays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],weekdaysHi:["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"],weekdayPlanets:["Surya ☉","Chandra ☽","Mangala ♂","Budha ☿","Brihaspati ♃","Shukra ♀","Shani ♄"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsHi:["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्टूबर","नवम्बर","दिसम्बर"],tithiLabel:"Tithi",nashtaLabel:"Nakshatra",yogaLabel:"Yoga",rahuLabel:"Rahu Kalam",panchangLabel:"Panchang",chogLabel:"Choghadiya",muhLabel:"Muhurat",festLabel:"Festival",planetLabel:"Gochara",personalLabel:"My Energy",onboard:{s1h:"Namaste 🙏",s1b:"Welcome to <strong>AuraPanchang</strong> — your sacred space where ancient wisdom meets modern life.",s2h:"Who Are You?",s2b:"Tell us your name to personalise your calendar.",s3h:"Your Birth Star",s3b:"Your birth details unlock your <strong>Janma Nakshatra</strong> and personal days.",s4h:"Your Cosmic Blueprint",s4b:"Here is your personal Janma profile.",namePlh:"Your full name",dobLabel:"Date of Birth",timeLabel:"Birth Time (optional)",placeLabel:"Birth Place (optional)",timePlh:"e.g. 10:30 AM",placePlh:"e.g. Mumbai",btn1:"Begin Journey →",btn2:"Continue →",btn3:"Calculate →",btn4:"Enter Calendar →",skip:"Skip for now — explore first"},powerDay:"Power Day ✦",cautionDay:"Caution Day ⚠",soulDay:"Soul Day ☽",powerDayDesc:"Your <strong>Janma Nakshatra</strong> governs today — energy flows in your favour. Ideal for new ventures and spiritual practice.",cautionDayDesc:"Today activates a <strong>sensitive point</strong> in your chart. Proceed mindfully.",soulDayDesc:"Today shares your <strong>Janma Tithi</strong> — a day for reflection and gratitude.",vikram:"Vikram Samvat",shaka:"Shaka Samvat",fasli:"Fasli San",hijri:"Hijri",bangla:"Bangla San",nepali:"Nepali Samvat",season:"Vasanta Ritu (Spring)",maas1:"Phalguna",maas2:"Chaitra",sun:"Sun in Meena",tithiSchedule:"Tithi Schedule",unlockMyDays:"Enter your birth date to reveal your personal power days, caution days, and soul days on the calendar."},
  hi:{appSub:"प्राचीन ज्ञान · आधुनिक जीवन",langName:"हिंदी",myDays:"मेरे दिन",weekdays:["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"],weekdaysHi:["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"],weekdayPlanets:["सूर्य ☉","चंद्र ☽","मंगल ♂","बुध ☿","बृहस्पति ♃","शुक्र ♀","शनि ♄"],months:["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्टूबर","नवम्बर","दिसम्बर"],monthsHi:["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्टूबर","नवम्बर","दिसम्बर"],tithiLabel:"तिथि",nashtaLabel:"नक्षत्र",yogaLabel:"योग",rahuLabel:"राहु काल",panchangLabel:"पंचांग",chogLabel:"चौघड़िया",muhLabel:"मुहूर्त",festLabel:"त्यौहार",planetLabel:"गोचर",personalLabel:"मेरी ऊर्जा",onboard:{s1h:"नमस्ते 🙏",s1b:"<strong>औरापंचांग</strong> में स्वागत।",s2h:"परिचय",s2b:"नाम बताएं।",s3h:"जन्म नक्षत्र",s3b:"जन्म विवरण से <strong>नक्षत्र</strong> पता चलता है।",s4h:"जन्म-कुंडली",s4b:"व्यक्तिगत प्रोफाइल।",namePlh:"पूरा नाम",dobLabel:"जन्म तिथि",timeLabel:"जन्म समय",placeLabel:"जन्म स्थान",timePlh:"10:30 AM",placePlh:"मुंबई",btn1:"शुरू →",btn2:"आगे →",btn3:"गणना →",btn4:"खोलें →",skip:"अभी छोड़ें"},powerDay:"शक्ति दिवस ✦",cautionDay:"सावधानी ⚠",soulDay:"आत्मा दिवस ☽",powerDayDesc:"आज <strong>जन्म नक्षत्र</strong> सक्रिय है।",cautionDayDesc:"<strong>संवेदनशील</strong> स्थिति।",soulDayDesc:"<strong>जन्म तिथि</strong> — चिंतन का दिन।",vikram:"विक्रम संवत",shaka:"शक संवत",fasli:"फसली सन",hijri:"हिजरी",bangla:"बंगाली सन",nepali:"नेपाली संवत",season:"वसंत ऋतु",maas1:"फाल्गुन",maas2:"चैत्र",sun:"सूर्य मीन राशि में",tithiSchedule:"तिथि सूची",unlockMyDays:"जन्म तिथि डालें और शुभ दिन देखें।"},
  gu:{appSub:"પ્રાચીન જ્ઞાન · આધુનિક જીવન",langName:"ગુજરાતી",myDays:"મારા દિવસ",weekdays:["રવિ","સોમ","મંગળ","બુધ","ગુરુ","શુક્ર","શનિ"],weekdaysHi:["રવિ","સોમ","મંગળ","બુધ","ગુરુ","શુક્ર","શનિ"],weekdayPlanets:["સૂર્ય","ચંદ્ર","મંગળ","બુધ","ગુરુ","શુક્ર","શની"],months:["જાન","ફેબ","માર","એપ","મે","જૂન","જુલ","ઓગ","સપ","ઓક","નવ","ડિસ"],monthsHi:["જાન","ફેબ","માર","એપ","મે","જૂન","જુલ","ઓગ","સપ","ઓક","નવ","ડિસ"],tithiLabel:"તિથિ",nashtaLabel:"નક્ષત્ર",yogaLabel:"યોગ",rahuLabel:"રાહુ",panchangLabel:"પંચાંગ",chogLabel:"ચોઘ",muhLabel:"મુહૂર્ત",festLabel:"તહેવાર",planetLabel:"ગ્રહ",personalLabel:"ઊર્જા",onboard:{s1h:"નમસ્તે 🙏",s1b:"<strong>ઓરાપંચાંગ</strong>માં સ્વાગત.",s2h:"પરિચય",s2b:"નામ.",s3h:"નક્ષત્ર",s3b:"જન્મ વિગત.",s4h:"કુંડળી",s4b:"પ્રોફાઇલ.",namePlh:"નામ",dobLabel:"જન્મ",timeLabel:"સમય",placeLabel:"સ્થળ",timePlh:"10:30",placePlh:"અમદા.",btn1:"શરૂ →",btn2:"આગળ →",btn3:"ગણો →",btn4:"ખોલો →",skip:"છોડો"},powerDay:"શક્તિ ✦",cautionDay:"સાવધ ⚠",soulDay:"આત્મ ☽",powerDayDesc:"<strong>જન્મ નક્ષત્ર</strong> સક્રિય.",cautionDayDesc:"<strong>સંવેદનશીલ</strong>.",soulDayDesc:"<strong>જન્મ તિથિ</strong>.",vikram:"વિક્રમ",shaka:"શક",fasli:"ફસળી",hijri:"હિ.",bangla:"બા.",nepali:"ને.",season:"વસંત",maas1:"ફા.",maas2:"ચૈ.",sun:"સૂર્ય મીન",tithiSchedule:"તિથિ",unlockMyDays:"જન્મ તારીખ નાખો."},
  mr:{appSub:"प्राचीन ज्ञान · आधुनिक जीवन",langName:"मराठी",myDays:"माझे दिवस",weekdays:["रवि","सोम","मंगळ","बुध","गुरु","शुक्र","शनि"],weekdaysHi:["रवि","सोम","मंगळ","बुध","गुरु","शुक्र","शनि"],weekdayPlanets:["सूर्य","चंद्र","मंगळ","बुध","गुरू","शुक्र","शनि"],months:["जाने","फेब्रु","मार्च","एप्रि","मे","जून","जुलै","ऑग","सप्टे","ऑक्ट","नोव्हे","डिसे"],monthsHi:["जाने","फेब्रु","मार्च","एप्रि","मे","जून","जुलै","ऑग","सप्टे","ऑक्ट","नोव्हे","डिसे"],tithiLabel:"तिथी",nashtaLabel:"नक्षत्र",yogaLabel:"योग",rahuLabel:"राहू",panchangLabel:"पंचांग",chogLabel:"चौघ",muhLabel:"मुहूर्त",festLabel:"सण",planetLabel:"ग्रह",personalLabel:"ऊर्जा",onboard:{s1h:"नमस्ते 🙏",s1b:"<strong>औरापंचांग</strong>मध्ये स्वागत.",s2h:"ओळख",s2b:"नाव.",s3h:"नक्षत्र",s3b:"जन्म तपशील.",s4h:"कुंडली",s4b:"प्रोफाइल.",namePlh:"नाव",dobLabel:"जन्म",timeLabel:"वेळ",placeLabel:"ठिकाण",timePlh:"10:30",placePlh:"पुणे",btn1:"सुरुवात →",btn2:"पुढे →",btn3:"गणना →",btn4:"उघडा →",skip:"वगळा"},powerDay:"शक्ती ✦",cautionDay:"सावध ⚠",soulDay:"आत्मा ☽",powerDayDesc:"<strong>जन्म नक्षत्र</strong> सक्रिय.",cautionDayDesc:"<strong>संवेदनशील</strong>.",soulDayDesc:"<strong>जन्म तिथी</strong>.",vikram:"विक्रम",shaka:"शक",fasli:"फसली",hijri:"हि.",bangla:"बं.",nepali:"ने.",season:"वसंत",maas1:"फाल्गुन",maas2:"चैत्र",sun:"सूर्य मीन",tithiSchedule:"तिथी",unlockMyDays:"जन्म तारीख द्या."},
  bn:{appSub:"প্রাচীন জ্ঞান · আধুনিক জীবন",langName:"বাংলা",myDays:"আমার দিন",weekdays:["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"],weekdaysHi:["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"],weekdayPlanets:["সূর্য","চন্দ্র","মঙ্গল","বুধ","বৃহস্পতি","শুক্র","শনি"],months:["জানু","ফেব্রু","মার্চ","এপ্রি","মে","জুন","জুলাই","আগ","সেপ্ট","অক্ট","নভে","ডিসে"],monthsHi:["জানু","ফেব্রু","মার্চ","এপ্রি","মে","জুন","জুলাই","আগ","সেপ্ট","অক্ট","নভে","ডিসে"],tithiLabel:"তিথি",nashtaLabel:"নক্ষত্র",yogaLabel:"যোগ",rahuLabel:"রাহু",panchangLabel:"পঞ্চাঙ্গ",chogLabel:"চৌঘ",muhLabel:"মুহূর্ত",festLabel:"উৎসব",planetLabel:"গ্রহ",personalLabel:"শক্তি",onboard:{s1h:"নমস্তে 🙏",s1b:"<strong>অরাপঞ্চাঙ্গ</strong>-এ স্বাগত.",s2h:"পরিচয়",s2b:"নাম.",s3h:"নক্ষত্র",s3b:"জন্মের তথ্য.",s4h:"চার্ট",s4b:"প্রোফাইল.",namePlh:"নাম",dobLabel:"জন্ম",timeLabel:"সময়",placeLabel:"স্থান",timePlh:"10:30",placePlh:"কলকাতা",btn1:"শুরু →",btn2:"এগিয়ে →",btn3:"গণনা →",btn4:"খুলুন →",skip:"এড়িয়ে যান"},powerDay:"শক্তি ✦",cautionDay:"সতর্ক ⚠",soulDay:"আত্মা ☽",powerDayDesc:"<strong>জন্ম নক্ষত্র</strong> সক্রিয়.",cautionDayDesc:"<strong>সংবেদনশীল</strong>.",soulDayDesc:"<strong>জন্ম তিথি</strong>.",vikram:"বিক্রম",shaka:"শক",fasli:"ফসলি",hijri:"হি.",bangla:"বাংলা",nepali:"নে.",season:"বসন্ত",maas1:"ফাল্গুন",maas2:"চৈত্র",sun:"সূর্য মীন",tithiSchedule:"তিথি",unlockMyDays:"জন্ম তারিখ দিন."},
};

const NAKSHATRAS=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadra","Uttara Bhadra","Revati"];
const RASHIS=["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];
const TAARA_QUALITY=["caution","power","caution","power","caution","power","caution","power","power"];
const RAHU={0:{s:"4:30 PM",e:"6:00 PM",sp:82,wp:13},1:{s:"7:30 AM",e:"9:00 AM",sp:8,wp:13},2:{s:"3:00 PM",e:"4:30 PM",sp:70,wp:13},3:{s:"12:00 PM",e:"1:30 PM",sp:46,wp:13},4:{s:"1:30 PM",e:"3:00 PM",sp:59,wp:13},5:{s:"10:30 AM",e:"12:00 PM",sp:33,wp:13},6:{s:"9:00 AM",e:"10:30 AM",sp:21,wp:13}};
const CHOG_SEQ={0:["Udveg","Char","Labh","Amrit","Kaal","Shubh","Rog","Udveg"],1:["Amrit","Kaal","Shubh","Rog","Udveg","Char","Labh","Amrit"],2:["Rog","Udveg","Char","Labh","Amrit","Kaal","Shubh","Rog"],3:["Labh","Amrit","Kaal","Shubh","Rog","Udveg","Char","Labh"],4:["Shubh","Rog","Udveg","Char","Labh","Amrit","Kaal","Shubh"],5:["Char","Labh","Amrit","Kaal","Shubh","Rog","Udveg","Char"],6:["Kaal","Shubh","Rog","Udveg","Char","Labh","Amrit","Kaal"]};
const CHOG_P={Amrit:{c:"#18BAB3",bg:"rgba(24,186,179,0.22)"},Shubh:{c:"#C8902A",bg:"rgba(200,144,42,0.22)"},Labh:{c:"#7BC47A",bg:"rgba(123,196,122,0.22)"},Char:{c:"#6888BB",bg:"rgba(104,136,187,0.18)"},Udveg:{c:"#D07020",bg:"rgba(208,112,32,0.18)"},Rog:{c:"#C85050",bg:"rgba(200,80,80,0.18)"},Kaal:{c:"#886699",bg:"rgba(136,102,153,0.18)"}};
const PLANETS=[{sym:"☉",name:"Surya",rashi:"Meena"},{sym:"☽",name:"Chandra",rashi:"Mithuna"},{sym:"♂",name:"Mangala",rashi:"Mithuna"},{sym:"☿",name:"Budha",rashi:"Kumbha"},{sym:"♃",name:"Brihaspati",rashi:"Vrishabha"},{sym:"♀",name:"Shukra",rashi:"Meena"},{sym:"♄",name:"Shani",rashi:"Kumbha"},{sym:"☊",name:"Rahu",rashi:"Meena"},{sym:"☋",name:"Ketu",rashi:"Kanya"}];

function getSamvatValues(y,m){const gp={2023:{m:2,d:22},2024:{m:3,d:9},2025:{m:2,d:30},2026:{m:2,d:20},2027:{m:3,d:9},2028:{m:2,d:28},2029:{m:3,d:17},2030:{m:3,d:6}};const g=gp[y]||{m:2,d:22};const p=m>g.m||m===g.m;return{vikram:`${y+(p?57:56)}`,shaka:`${y-(p?78:79)}`,fasli:`${y-593}`,hijri:`${Math.floor((y-622)*(33/32))}`,bangla:`${y-594}`,nepali:`${y+(p?57:56)}`};}

function calcJanmaProfile(dob){if(!dob)return null;const d=new Date(dob);const doy=Math.floor((d-new Date(d.getFullYear(),0,0))/86400000);const ni=Math.floor(((d.getFullYear()-1900)*365+doy)*0.0739)%27;const ri=Math.floor(ni/2.25)%12;const ti=Math.floor(d.getDate()*0.97)%30;const tn=["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya"];return{nakshatra:NAKSHATRAS[ni],nashtaIdx:ni,rashi:RASHIS[ri],tithi:tn[ti%30],lagna:RASHIS[(ri+2)%12]};}
function getDayPersonalType(d,p){if(!p||!d)return null;if(d.nt===p.nakshatra)return"power";if(d.t===p.tithi)return"soul";const td=(NAKSHATRAS.indexOf(d.nt)-p.nashtaIdx+27)%9;if(TAARA_QUALITY[td]==="caution")return"caution";if(td===3||td===5||td===8)return"power";return null;}

function buildMonthData(year,month){
  const tithis=["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya"];
  const yogas=["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarman","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Mahendra","Vaidhriti"];
  const dim=new Date(year,month+1,0).getDate();const fd=new Date(year,month,1).getDay();
  const fm={};
  if(year===2026&&month===1)fm[26]=[{n:"Maha Shivratri",e:"🔱",c:"#9966CC"}];
  if(year===2026&&month===2){fm[3]=[{n:"Holika Dahan",e:"🔥",c:"#D4622A"}];fm[4]=[{n:"Holi",e:"🌈",c:"#C45E8A"}];fm[14]=[{n:"Pradosh Vrat",e:"🔱",c:"#9966CC"}];fm[18]=[{n:"Amavasya – Pitru Tarpan",e:"🌑",c:"#446688"}];fm[19]=[{n:"Navratri Day 1",e:"🌸",c:"#C45E8A"}];fm[20]=[{n:"Gudi Padwa • VS 2083",e:"🪔",c:"#C9922A"}];fm[27]=[{n:"Ram Navami",e:"🏹",c:"#1ABFB8"}];fm[29]=[{n:"Kamada Ekadashi",e:"💫",c:"#7BC67A"}];fm[31]=[{n:"Pradosh Vrat",e:"🔱",c:"#9966CC"}];}
  if(year===2026&&month===3){fm[6]=[{n:"Ram Navami",e:"🏹",c:"#1ABFB8"}];fm[14]=[{n:"Hanuman Jayanti",e:"🐒",c:"#D4622A"}];}
  const days=[];
  for(let d=1;d<=dim;d++){const w=new Date(year,month,d).getDay();const ti=(d+12)%30;const pk=ti<15?"SP":"KP";const ni=(d+8+month*3)%27;const yi=(d+month*2)%27;const mpR=pk==="SP"?(ti/14):(1-(ti-15)/14);const mp=Math.max(0,Math.min(1,mpR));const mo=d-1;const sr=`6:${String(Math.max(0,48-Math.floor(mo*0.5))).padStart(2,"0")} AM`;const ss=`6:${String(Math.min(59,32+Math.floor(mo*0.5))).padStart(2,"0")} PM`;const a=[1,4,9,11,12,16,20,23,25,27,29].includes(yi%27);days.push({d,w,pk,t:tithis[ti],nt:NAKSHATRAS[ni],y:yogas[yi],f:fm[d]||[],a,mp,sr,ss,mr:`${6+Math.floor(d*0.5%6)}:${String(Math.floor(d*7%60)).padStart(2,"0")} ${d<15?"AM":"PM"}`,ms:`${7+Math.floor(d*0.4%5)}:${String(Math.floor(d*11%60)).padStart(2,"0")} ${d<20?"PM":"AM"}`});}
  return{days,firstDay:fd,daysInMonth:dim};
}
function getMoon(mp){if(mp===0)return"🌑";if(mp<0.12)return"🌒";if(mp<0.38)return"🌓";if(mp<0.62)return"🌔";if(mp>=0.95)return"🌕";if(mp<0.85)return"🌖";return"🌗";}

function MyDaysGate({lang,onComplete,onClose}){
  const[dob,setDob]=useState('');const[name,setName]=useState('');
  return(<>
    <div className="dp-overlay" onClick={onClose}/>
    <div className="dp-panel" onClick={e=>e.stopPropagation()}>
      <div className="dp-handle" onClick={onClose}/>
      <button className="dp-close" onClick={onClose}>×</button>
      <div className="dp-inner" style={{paddingTop:60}}>
        <div style={{textAlign:'center',marginBottom:18}}>
          <div style={{fontSize:32,marginBottom:8}}>✦</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600,color:'var(--gold-p)',marginBottom:6}}>Unlock My Days</div>
          <div style={{fontSize:13,color:'var(--moon-d)',lineHeight:1.6}}>{T[lang].unlockMyDays}</div>
        </div>
        <div className="ob-field"><label className="ob-label">Your name (optional)</label><input className="ob-input" placeholder="e.g. Arjun" value={name} onChange={e=>setName(e.target.value)}/></div>
        <div className="ob-field"><label className="ob-label">Date of birth</label><input className="ob-input" type="date" value={dob} onChange={e=>setDob(e.target.value)}/></div>
        <button className="ob-btn-primary" onClick={()=>{if(!dob)return;onComplete({name:name||'You',dob,profile:calcJanmaProfile(dob)});}} style={{opacity:dob?1:0.4}} disabled={!dob}>Show My Days →</button>
        <div style={{textAlign:'center',marginTop:10,fontSize:11,color:'var(--moon-d)',opacity:0.5}}>For full chart use the profile button ↗</div>
      </div>
    </div>
  </>);
}

function Onboarding({lang,onComplete}){
  const t=T[lang].onboard;const[step,setStep]=useState(0);const[form,setForm]=useState({name:'',dob:'',time:'',place:''});const[profile,setProfile]=useState(null);
  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  function next(){if(step===2)setProfile(calcJanmaProfile(form.dob));setStep(s=>Math.min(s+1,3));}
  return(<div className="ob-overlay"><div className="ob-card">
    {step>0&&<button className="ob-btn-back" onClick={()=>setStep(s=>s-1)}>← Back</button>}
    <div className="ob-progress">{[0,1,2,3].map(i=><div key={i} className={`ob-dot ${i===step?"active":i<step?"done":""}`}/>)}</div>
    {step===0&&(<div className="ob-step">
      <div className="ob-icon">🕉️</div><div className="ob-heading" dangerouslySetInnerHTML={{__html:t.s1h}}/><div className="ob-sub" dangerouslySetInnerHTML={{__html:t.s1b}}/>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:18}}>{[{i:"🌙",t:"All 5 Panchang elements daily"},{i:"✦",t:"Personal power & caution days"},{i:"🗓️",t:"Festivals, muhurats, Choghadiya"},{i:"🌐",t:"5 languages"}].map((f,i)=><div key={i} style={{display:'flex',gap:12,alignItems:'center',background:'var(--ink)',borderRadius:12,padding:'11px 14px',border:'1px solid var(--border)'}}><span style={{fontSize:18}}>{f.i}</span><span style={{fontSize:13,color:'var(--moon-d)'}}>{f.t}</span></div>)}</div>
      <button className="ob-btn-primary" onClick={next}>{t.btn1}</button><span className="ob-btn-skip" onClick={()=>onComplete(null)}>{t.skip}</span>
    </div>)}
    {step===1&&(<div className="ob-step">
      <div className="ob-icon">✍️</div><div className="ob-heading">{t.s2h}</div><div className="ob-sub" dangerouslySetInnerHTML={{__html:t.s2b}}/>
      <div className="ob-field"><label className="ob-label">{t.namePlh}</label><input className="ob-input" placeholder={t.namePlh} value={form.name} onChange={e=>upd('name',e.target.value)}/></div>
      <button className="ob-btn-primary" onClick={next} disabled={!form.name.trim()} style={{opacity:form.name.trim()?1:0.4}}>{t.btn2}</button><span className="ob-btn-skip" onClick={()=>onComplete(null)}>{t.skip}</span>
    </div>)}
    {step===2&&(<div className="ob-step">
      <div className="ob-icon">⭐</div><div className="ob-heading">{t.s3h}</div><div className="ob-sub" dangerouslySetInnerHTML={{__html:t.s3b}}/>
      <div className="ob-field"><label className="ob-label">{t.dobLabel}</label><input className="ob-input" type="date" value={form.dob} onChange={e=>upd('dob',e.target.value)}/></div>
      <div className="ob-row"><div className="ob-field"><label className="ob-label">{t.timeLabel}</label><input className="ob-input" placeholder={t.timePlh} value={form.time} onChange={e=>upd('time',e.target.value)}/></div><div className="ob-field"><label className="ob-label">{t.placeLabel}</label><input className="ob-input" placeholder={t.placePlh} value={form.place} onChange={e=>upd('place',e.target.value)}/></div></div>
      <button className="ob-btn-primary" onClick={next} disabled={!form.dob} style={{opacity:form.dob?1:0.4}}>{t.btn3}</button><span className="ob-btn-skip" onClick={()=>onComplete(null)}>{t.skip}</span>
    </div>)}
    {step===3&&(<div className="ob-step">
      <div className="ob-icon">🌟</div><div className="ob-heading">{t.s4h}</div><div className="ob-sub" dangerouslySetInnerHTML={{__html:t.s4b}}/>
      {profile&&(<><div style={{background:'var(--gold-d)',border:'1px solid rgba(200,144,42,0.2)',borderRadius:16,padding:14,marginBottom:12}}><div style={{fontSize:9,letterSpacing:2,color:'var(--moon-d)',textTransform:'uppercase',fontFamily:"'Cormorant',serif"}}>Namaskara,</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:'var(--gold-p)'}}>{form.name||'You'}</div><div style={{fontSize:11,color:'var(--moon-d)',marginTop:2}}>Born {form.dob}{form.place?` · ${form.place}`:''}</div></div><div className="orc-grid">{[{i:"⭐",l:"Janma Nakshatra",v:profile.nakshatra},{i:"♉",l:"Janma Rashi",v:profile.rashi},{i:"🌙",l:"Janma Tithi",v:profile.tithi}].map((item,i)=><div key={i} className="orc-item"><div className="orc-item-icon">{item.i}</div><div className="orc-item-lbl">{item.l}</div><div className="orc-item-val">{item.v}</div></div>)}</div></>)}
      <button className="ob-btn-primary" onClick={()=>onComplete({...form,profile:calcJanmaProfile(form.dob)})}>{t.btn4}</button>
    </div>)}
  </div></div>);
}

function DayCell({day,isToday,isSelected,myDaysOn,personalType,onClick,onMouseEnter,onMouseLeave,delay}){
  if(!day)return<div className="dc empty" style={{animationDelay:`${delay}ms`}}/>;
  const rahu=RAHU[day.w];const fest=day.f[0];
  let cls=`dc ${day.pk.toLowerCase()}`;
  if(isToday)cls+=" is-today";if(isSelected)cls+=" is-selected";
  if(day.t==="Purnima")cls+=" purnima";if(day.t==="Amavasya")cls+=" amavasya";
  if(fest)cls+=" has-festival";
  if(personalType==="power")cls+=" power-day";if(personalType==="caution")cls+=" caution-day";if(personalType==="soul")cls+=" soul-day";
  if(myDaysOn&&personalType)cls+=" amplified";
  const dc=personalType==="power"?"var(--power)":personalType==="caution"?"var(--caution)":personalType==="soul"?"var(--teal)":null;
  return(<div className={cls} style={{animationDelay:`${delay}ms`,borderLeftColor:fest?fest.c:undefined}} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <div className="dc-top"><div className="dc-date">{day.d}</div><div className="dc-right"><div className="dc-moon">{getMoon(day.mp)}</div>{dc&&<div className="dc-personal-dot" style={{background:dc,boxShadow:`0 0 4px ${dc}`}}/>}</div></div>
    <div className="dc-tithi"><span className="pk-dot" style={{background:day.pk==="SP"?"var(--gold)":"#6880CC"}}/>{day.t}</div>
    <div className="dc-nakshatra">{day.nt}</div>
    {day.a&&<div className="dc-yoga">{day.y}</div>}
    {fest&&<div className="dc-festival" style={{background:fest.c+"1A",color:fest.c,border:`1px solid ${fest.c}33`}}><span>{fest.e}</span><span style={{overflow:'hidden',textOverflow:'ellipsis'}}>{fest.n}</span></div>}
    <div className="dc-rahu"><div className="dc-rahu-lbl">Rahu {rahu.s}</div><div className="dc-rahu-bar"><div className="dc-rahu-fill" style={{left:`${rahu.sp}%`,width:`${rahu.wp}%`}}/></div></div>
  </div>);
}

function PanelContent({day,lang,profile,myDaysOn,personalType,yearNum,monthNum,isDesktop}){
  const[tab,setTab]=useState("panchang");
  const t=T[lang];const rahu=RAHU[day.w];
  const wn=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day.w];
  const cs=CHOG_SEQ[day.w].map((name,i)=>{const[h,m]=(day.sr||"6:30 AM").replace(" AM","").split(":").map(Number);const sm=h*60+m;const s=sm+i*90;const tt=(mn)=>{const hh=Math.floor(mn/60);const mm=String(mn%60).padStart(2,"0");const ap=hh>=12?"PM":"AM";const h12=hh>12?hh-12:hh||12;return`${h12}:${mm}${ap}`;};return{name,start:tt(s),...CHOG_P[name]};});
  const tabs=[{id:"panchang",label:t.panchangLabel},{id:"chog",label:t.chogLabel},{id:"muhurat",label:t.muhLabel},...(day.f.length>0?[{id:"fest",label:t.festLabel}]:[]),{id:"planets",label:t.planetLabel},...(profile&&personalType?[{id:"personal",label:t.personalLabel}]:[])];
  useEffect(()=>{setTab(day.f.length>0?"fest":profile&&personalType?"personal":"panchang");},[day.d]);
  return(<>
    <div className={`dp-date-row ${isDesktop?"dp-date-row-desktop":""}`}>
      <div className="dp-big-date">{day.d}</div>
      <div style={{flex:1,paddingLeft:8}}>
        <div className="dp-day-name">{wn}</div>
        <div className="dp-gregorian">{T.en.months[monthNum]} {yearNum}</div>
        <div className="dp-samvat-line">{day.pk==="SP"?"शुक्ल":"कृष्ण"} पक्ष · {day.t} · {day.nt}</div>
        {personalType&&<div style={{marginTop:5,display:'inline-flex',alignItems:'center',gap:5,background:personalType==="power"?"rgba(255,215,0,0.12)":personalType==="caution"?"rgba(255,107,107,0.1)":"var(--teal-d)",border:`1px solid ${personalType==="power"?"rgba(255,215,0,0.3)":personalType==="caution"?"rgba(255,107,107,0.25)":"rgba(24,186,179,0.25)"}`,borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,color:personalType==="power"?"var(--power)":personalType==="caution"?"var(--caution)":"var(--teal)"}}>{personalType==="power"?t.powerDay:personalType==="caution"?t.cautionDay:t.soulDay}</div>}
      </div>
      <div className="dp-pills"><div className="dp-pill">🌅<span className="t">{day.sr}</span><span className="l">RISE</span></div><div className="dp-pill">🌇<span className="t">{day.ss}</span><span className="l">SET</span></div><div className="dp-pill">{getMoon(day.mp)}<span className="t">{day.mr}</span><span className="l">MOON</span></div></div>
    </div>
    <div className="dp-tabs">{tabs.map(tb=><button key={tb.id} className={`dp-tab ${tab===tb.id?"on":""}`} onClick={()=>setTab(tb.id)}>{tb.label}</button>)}</div>
    {tab==="panchang"&&(<><div className="dp-sec-title">{t.panchangLabel} · Pancha Anga</div><div className="pancha-grid">{[{lbl:t.tithiLabel,val:day.t,dev:day.pk==="SP"?"शुक्ल पक्ष":"कृष्ण पक्ष",det:day.pk==="SP"?"Waxing Moon":"Waning Moon",ends:"9:42 PM",full:true},{lbl:"Vara",val:wn,dev:t.weekdaysHi[day.w],det:t.weekdayPlanets[day.w],ends:"All day"},{lbl:t.nashtaLabel,val:day.nt,dev:"नक्षत्र",det:"Lunar mansion",ends:"11:18 PM"},{lbl:t.yogaLabel,val:day.y,dev:"योग",det:"Sun–Moon combination",ends:"8:55 PM"},{lbl:"Karana",val:"Balava",dev:"करण",det:"Half-Tithi period",ends:"10:15 AM"}].map((r,i)=><div key={i} className={`pancha-card ${r.full?"span2":""}`}><div className="pc-lbl">{r.lbl}</div><div className="pc-val">{r.val}</div><div className="pc-dev">{r.dev}</div><div className="pc-det">{r.det}</div><div className="pc-ends">ends {r.ends}</div></div>)}</div><div className="rahu-box"><div><div className="rahu-lbl">⛔ {t.rahuLabel}</div><div className="rahu-warn">Avoid new beginnings</div></div><div style={{textAlign:'right'}}><div className="rahu-time">{rahu.s}</div><div className="rahu-time" style={{fontSize:12,opacity:0.6}}>to {rahu.e}</div></div></div></>)}
    {tab==="chog"&&(<><div className="dp-sec-title">{t.chogLabel}</div><div className="chog-bar">{cs.map((s,i)=><div key={i} className="chog-seg" style={{background:s.bg,borderRight:i<7?"1px solid rgba(0,0,0,0.2)":"none"}}><span className="cs-name" style={{color:s.c}}>{s.name}</span><span className="cs-time" style={{color:s.c}}>{s.start}</span></div>)}</div><div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:10}}>{Object.entries(CHOG_P).map(([n,p])=><div key={n} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--moon-d)'}}><div style={{width:8,height:8,borderRadius:'50%',background:p.c}}/>{n}</div>)}</div></>)}
    {tab==="muhurat"&&(<><div className="dp-sec-title">{t.muhLabel}</div><div className="muh-list">{[{name:"Brahma Muhurat",time:"5:00–6:30 AM",c:"#7BC47A",b:"Meditation"},{name:"Abhijit Muhurat",time:"11:45 AM–12:30 PM",c:"#18BAB3",b:"Best"},{name:"Vijaya Muhurat",time:"2:15–3:00 PM",c:"#C8902A",b:"Victory"},{name:"Godhuli",time:`${day.ss}–7:10 PM`,c:"#E5B04A",b:"Twilight"},{name:t.rahuLabel,time:`${rahu.s}–${rahu.e}`,c:"#CC4444",b:"Avoid"},{name:"Gulika Kalam",time:"3:00–4:30 PM",c:"#996699",b:"Caution"}].map((m,i)=><div key={i} className="muh-item"><div className="muh-dot" style={{background:m.c}}/><div className="muh-name">{m.name}</div><div className="muh-time">{m.time}</div><div className="muh-badge" style={{background:m.c+"22",color:m.c,border:`1px solid ${m.c}44`}}>{m.b}</div></div>)}</div></>)}
    {tab==="fest"&&day.f.map((f,fi)=><div key={fi}><div className="personal-day-card" style={{background:f.c+"18",border:`1px solid ${f.c}33`}}><div style={{fontSize:34,marginBottom:8}}>{f.e}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:'var(--moon)',marginBottom:6}}>{f.n}</div><div style={{fontSize:12,color:'var(--moon-d)',marginBottom:10}}>{day.t} · {day.pk==="SP"?"Shukla":"Krishna"} Paksha · {day.nt}</div><div style={{fontSize:13,lineHeight:1.75,color:'var(--moon-d)'}}>A sacred day in the Hindu Panchang. Light diyas, observe fast, and recite the presiding deity's mantra.</div></div></div>)}
    {tab==="planets"&&(<><div className="dp-sec-title">{t.planetLabel}</div><div className="planet-row">{PLANETS.map(p=><div key={p.name} className="planet-card"><div className="planet-sym">{p.sym}</div><div className="planet-name">{p.name}</div><div className="planet-rashi">{p.rashi}</div></div>)}</div></>)}
    {tab==="personal"&&profile&&personalType&&(<><div className="dp-sec-title">{t.personalLabel}</div><div className="personal-day-card" style={{background:personalType==="power"?"var(--power-d)":personalType==="caution"?"var(--caution-d)":"var(--teal-d)",border:`1px solid ${personalType==="power"?"rgba(255,215,0,0.25)":personalType==="caution"?"rgba(255,107,107,0.2)":"rgba(24,186,179,0.2)"}`}}><div className="pdc-type" style={{background:personalType==="power"?"rgba(255,215,0,0.15)":personalType==="caution"?"rgba(255,107,107,0.12)":"rgba(24,186,179,0.1)",color:personalType==="power"?"var(--power)":personalType==="caution"?"var(--caution)":"var(--teal)"}}>{personalType==="power"?t.powerDay:personalType==="caution"?t.cautionDay:t.soulDay}</div><div className="pdc-title">{personalType==="power"?`${profile.nakshatra} Active`:personalType==="caution"?"Sensitive Transit":`${profile.tithi} Returns`}</div><div className="pdc-body" dangerouslySetInnerHTML={{__html:personalType==="power"?t.powerDayDesc:personalType==="caution"?t.cautionDayDesc:t.soulDayDesc}}/></div><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>{[{l:"Your Nakshatra",v:profile.nakshatra,i:"⭐"},{l:"Your Rashi",v:profile.rashi,i:"♉"},{l:"Your Tithi",v:profile.tithi,i:"🌙"}].map((item,i)=><div key={i} style={{background:'var(--ink)',border:'1px solid var(--border)',borderRadius:12,padding:'10px 8px',textAlign:'center'}}><div style={{fontSize:18,marginBottom:3}}>{item.i}</div><div style={{fontSize:8,letterSpacing:1,color:'var(--moon-d)',textTransform:'uppercase',fontFamily:"'Cormorant',serif"}}>{item.l}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:700,color:'var(--gold-p)',marginTop:2}}>{item.v}</div></div>)}</div></>)}
  </>);
}

export default function AuraPanchangFull(){
  const[lang,setLang]=useState("en");
  const[myDaysOn,setMyDaysOn]=useState(false);
  const[showOnboard,setShowOnboard]=useState(false);
  const[showMyDaysGate,setShowMyDaysGate]=useState(false);
  const[theme,setTheme]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  const[user,setUser]=useState(null);
  const[viewYear,setViewYear]=useState(2026);
  const[viewMonth,setViewMonth]=useState(2);
  const[selectedDay,setSelectedDay]=useState(null);
  const[showPanel,setShowPanel]=useState(false);
  const[tooltip,setTooltip]=useState(null);
  const[isDesktop,setIsDesktop]=useState(false);

  const t=T[lang];
  const TODAY_YEAR=2026,TODAY_MONTH=2,TODAY_DAY=17;
  const{days,firstDay}=buildMonthData(viewYear,viewMonth);
  const profile=user?.profile||null;

  useEffect(()=>{document.documentElement.setAttribute('data-theme',theme);},[theme]);
  useEffect(()=>{const check=()=>setIsDesktop(window.innerWidth>=900);check();window.addEventListener('resize',check);return()=>window.removeEventListener('resize',check);},[]);

  function prevMonth(){if(viewMonth===0){setViewYear(y=>y-1);setViewMonth(11);}else setViewMonth(m=>m-1);setShowPanel(false);setSelectedDay(null);setTooltip(null);}
  function nextMonth(){if(viewMonth===11){setViewYear(y=>y+1);setViewMonth(0);}else setViewMonth(m=>m+1);setShowPanel(false);setSelectedDay(null);setTooltip(null);}
  function closePanel(){setShowPanel(false);}

  const cells=[];for(let i=0;i<firstDay;i++)cells.push(null);days.forEach(d=>cells.push(d));while(cells.length%7!==0)cells.push(null);

  const selectedDayData=selectedDay?days[selectedDay-1]:null;
  const personalType=selectedDayData?getDayPersonalType(selectedDayData,profile):null;
  const powerCount=profile?days.filter(d=>getDayPersonalType(d,profile)==="power").length:0;
  const cautionCount=profile?days.filter(d=>getDayPersonalType(d,profile)==="caution").length:0;
  const svValues=getSamvatValues(viewYear,viewMonth);
  const hiMonths=["पौष","माघ","फाल्गुन","चैत्र","वैशाख","ज्येष्ठ","आषाढ","श्रावण","भाद्रपद","आश्विन","कार्तिक","मार्गशीर्ष"];

  return(<>
    <style>{STYLE}</style>
    <div className="ap-bg"/><div className="ap-noise"/>
    {showOnboard&&<Onboarding lang={lang} onComplete={u=>{setUser(u);setShowOnboard(false);if(u?.profile)setMyDaysOn(true);}}/>}

    <div className="ap-root">
      <div className="ap-topbar">
        <div className="ap-logo-wrap"><div className="ap-logo-icon">🕉️</div><div><div className="ap-logo-text">AuraPanchang</div><div className="ap-logo-sub">{t.appSub}</div></div></div>
        <div className="ap-topbar-right">
          <div className="lang-switcher">{["en","hi","gu","mr","bn"].map(l=><button key={l} className={`lang-btn ${lang===l?"active":""}`} onClick={()=>setLang(l)}>{T[l].langName}</button>)}</div>
          <button className="theme-toggle" onClick={()=>setTheme(th=>th==='dark'?'light':'dark')}>{theme==='dark'?'☀️':'🌙'}</button>
          <div className={`mydays-toggle ${myDaysOn?"on":""}`} onClick={()=>{if(!profile){setShowMyDaysGate(true);}else{setMyDaysOn(v=>!v);}}}><span className="mydays-toggle-label">{t.myDays}</span><div className="toggle-pill"><div className="toggle-thumb"/></div></div>
          <div className={`profile-btn ${profile?"has-profile":""}`} onClick={()=>setShowOnboard(true)}>{profile?"👤":"➕"}</div>
        </div>
      </div>

      <div className="samvat-strip">{[{lbl:t.vikram,val:svValues.vikram},{lbl:t.shaka,val:svValues.shaka},{lbl:t.fasli,val:svValues.fasli},{lbl:t.hijri,val:svValues.hijri},{lbl:t.bangla,val:svValues.bangla},{lbl:t.nepali,val:svValues.nepali}].map(s=><div key={s.lbl} className="sv-item"><span className="sv-label">{s.lbl}</span><span className="sv-value">{s.val}</span></div>)}</div>

      {profile&&myDaysOn&&<div className="energy-strip" style={{marginTop:12}}><div className="energy-strip-avatar">🌟</div><div><div className="energy-strip-name">{user?.name||"You"}</div><div className="energy-strip-sub">⭐ {profile.nakshatra} · {profile.rashi} · {profile.tithi}</div></div><div className="energy-pills"><span className="energy-pill ep-power">✦ {powerCount} Power</span><span className="energy-pill ep-caution">⚠ {cautionCount} Caution</span></div></div>}

      <div className="month-nav">
        <button className="mnav-btn" onClick={prevMonth}>‹</button>
        <div className="month-center"><div className="month-en">{t.months[viewMonth]}</div><span className="month-hi" style={{fontFamily:lang==="gu"?"'Noto Sans Gujarati'":lang==="bn"?"'Noto Sans Bengali'":"'Noto Sans Devanagari'"}}>{lang==="en"?hiMonths[viewMonth]:t.monthsHi[viewMonth]}</span><div><span className="month-badge">🕉️ {T.en.vikram} {svValues.vikram} · {t.season}</span></div></div>
        <button className="mnav-btn" onClick={nextMonth}>›</button>
      </div>
      <div className="month-season"><em>{t.maas1}</em>·<span>{viewYear}</span>·<em>{t.maas2}</em>·<span>{t.sun}</span></div>

      <div className="split-layout">
        <div className="split-cal">
          <div className="wday-row">{[0,1,2,3,4,5,6].map(i=><div key={i} className="wday-cell"><span className="wday-hi" style={{fontFamily:lang==="gu"?"'Noto Sans Gujarati'":lang==="bn"?"'Noto Sans Bengali'":"'Noto Sans Devanagari'"}}>{t.weekdays[i]}</span><span className="wday-en">{T.en.weekdays[i]}</span><span className="wday-pl">{T.en.weekdayPlanets[i]}</span></div>)}</div>
          <div className="cal-grid">{cells.map((day,i)=><DayCell key={i} day={day} isToday={day?.d===TODAY_DAY&&viewYear===TODAY_YEAR&&viewMonth===TODAY_MONTH} isSelected={day?.d===selectedDay} myDaysOn={myDaysOn} personalType={profile?getDayPersonalType(day,profile):null} delay={i*8} onClick={()=>{if(day){setSelectedDay(day.d);setShowPanel(true);setTooltip(null);}}} onMouseEnter={e=>{if(day&&isDesktop){const r=e.currentTarget.getBoundingClientRect();setTooltip({day,x:r.left,y:r.top});}}} onMouseLeave={()=>setTooltip(null)}/>)}</div>
          <div className="cal-legend">
            <div className="leg-item"><div className="leg-swatch" style={{background:"rgba(200,144,42,0.2)",border:"1px solid rgba(200,144,42,0.35)"}}/><span>Shukla Paksha</span></div>
            <div className="leg-item"><div className="leg-swatch" style={{background:"rgba(70,90,200,0.15)",border:"1px solid rgba(70,90,200,0.3)"}}/><span>Krishna Paksha</span></div>
            <div className="leg-item"><div className="leg-swatch" style={{borderLeft:"3px solid var(--gold-l)",background:"var(--ink)"}}/><span>Festival</span></div>
            <div className="leg-item"><div className="leg-swatch" style={{background:"var(--teal-d)",border:"1px solid rgba(24,186,179,0.3)"}}/><span>Auspicious</span></div>
            <div className="leg-item"><div className="leg-line" style={{background:"linear-gradient(90deg,rgba(200,50,50,0.7),transparent)"}}/><span>Rahu</span></div>
            {profile&&<><div className="leg-item"><div className="leg-swatch" style={{background:"var(--power-d)",border:"1px solid rgba(255,215,0,0.4)"}}/><span>✦ Power</span></div><div className="leg-item"><div className="leg-swatch" style={{background:"var(--caution-d)",border:"1px solid rgba(255,107,107,0.35)"}}/><span>⚠ Caution</span></div></>}
          </div>
          <div className="tithi-summary">
            <div className="ts-title">{t.tithiSchedule} — {t.months[viewMonth]} {viewYear}</div>
            <div className="ts-grid">{days.filter(d=>d.f.length>0||["Purnima","Amavasya","Ekadashi","Chaturdashi"].includes(d.t)).map(d=><div key={d.d} className="ts-item" onClick={()=>{setSelectedDay(d.d);setShowPanel(true);}}><div className="ts-day" style={{borderLeft:`3px solid ${d.pk==="SP"?"rgba(200,144,42,0.5)":"rgba(70,90,200,0.5)"}`,paddingLeft:8,borderRadius:2}}>{d.d}</div><div><div className="ts-name">{d.t}</div><div className="ts-note">{d.f[0]?.n||(d.t==="Purnima"?"🌕 Full Moon":d.t==="Amavasya"?"🌑 New Moon":"")}</div></div></div>)}</div>
          </div>
        </div>

        {/* Desktop right panel — ONLY visible via CSS at ≥900px */}
        <div className="split-detail">
          {selectedDayData?
            <div className="dp-inner"><PanelContent day={selectedDayData} lang={lang} profile={profile} myDaysOn={myDaysOn} personalType={personalType} yearNum={viewYear} monthNum={viewMonth} isDesktop={true}/></div>:
            <div className="detail-placeholder"><div className="detail-placeholder-icon">🕉️</div><div className="detail-placeholder-text">Select any day<br/>to see the full Panchang</div></div>}
        </div>
      </div>
    </div>

    {/* MOBILE bottom sheet — only rendered when NOT desktop */}
    {showPanel&&selectedDayData&&!isDesktop&&(
      <>
        <div className="dp-overlay" onClick={closePanel}/>
        <div className="dp-panel" onClick={e=>e.stopPropagation()}>
          <div className="dp-handle" onClick={closePanel}/>
          <button className="dp-close" onClick={closePanel}>×</button>
          <div className="dp-inner">
            <PanelContent day={selectedDayData} lang={lang} profile={profile} myDaysOn={myDaysOn} personalType={personalType} yearNum={viewYear} monthNum={viewMonth} isDesktop={false}/>
          </div>
        </div>
      </>
    )}

    {/* My Days gate */}
    {showMyDaysGate&&<MyDaysGate lang={lang} onComplete={u=>{setUser(u);setMyDaysOn(true);setShowMyDaysGate(false);}} onClose={()=>setShowMyDaysGate(false)}/>}

    {/* Tooltip — desktop only */}
    {tooltip&&isDesktop&&(
      <div className="dc-tooltip" style={{left:Math.min(tooltip.x+14,window.innerWidth-265),top:Math.max(10,tooltip.y-10)}}>
        <div className="dc-tooltip-date">{tooltip.day.d} {T.en.months[viewMonth].slice(0,3)} — {tooltip.day.t}</div>
        {[{k:"Nakshatra",v:tooltip.day.nt},{k:"Yoga",v:tooltip.day.y},{k:"Paksha",v:tooltip.day.pk==="SP"?"Shukla":"Krishna"}].map(r=><div key={r.k} className="dc-tooltip-row"><span className="dc-tooltip-key">{r.k}</span><span className="dc-tooltip-val">{r.v}</span></div>)}
        <div className="dc-tooltip-rahu">⛔ Rahu {RAHU[tooltip.day.w].s} – {RAHU[tooltip.day.w].e}</div>
      </div>
    )}
  </>);
}