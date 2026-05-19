// Minimal dark icon set for NOCTURNE_OS desktop
// Each icon: 44×44 SVG — dark tinted rect, subtle accent border, white symbol

export function GlassProfile() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-profile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1A1205"/>
          <stop offset="100%" stopColor="#110D03"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-profile)" stroke="rgba(245,166,35,0.25)" strokeWidth="1"/>
      {/* Document outline */}
      <path d="M12 9H25L32 16V35H12V9Z" stroke="rgba(255,255,255,0.80)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M25 9V16H32" stroke="rgba(255,255,255,0.80)" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Profile circle */}
      <circle cx="22" cy="21" r="4" stroke="rgba(245,166,35,0.88)" strokeWidth="1.3"/>
      {/* Name lines */}
      <line x1="16" y1="29" x2="28" y2="29" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="18" y1="32" x2="26" y2="32" stroke="rgba(255,255,255,0.28)" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

export function GlassReadme() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-readme" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D2A2E"/>
          <stop offset="100%" stopColor="#091A1D"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-readme)" stroke="rgba(62,207,207,0.22)" strokeWidth="1"/>
      <path d="M14 11H24L31 18V33H14V11Z" stroke="rgba(255,255,255,0.82)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M24 11V18H31" stroke="rgba(255,255,255,0.82)" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="17" y1="22" x2="28" y2="22" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="17" y1="26" x2="28" y2="26" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="17" y1="30" x2="23" y2="30" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

export function GlassArchive() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-archive" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1A0E36"/>
          <stop offset="100%" stopColor="#110921"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-archive)" stroke="rgba(167,139,250,0.22)" strokeWidth="1"/>
      <rect x="12" y="11" width="20" height="6" rx="2" fill="rgba(255,255,255,0.80)"/>
      <rect x="12" y="19" width="20" height="6" rx="2" fill="rgba(255,255,255,0.50)"/>
      <rect x="12" y="27" width="20" height="6" rx="2" fill="rgba(255,255,255,0.28)"/>
    </svg>
  );
}

export function GlassTerminal() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-terminal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A2218"/>
          <stop offset="100%" stopColor="#061510"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-terminal)" stroke="rgba(52,211,153,0.22)" strokeWidth="1"/>
      <polyline points="12,16 20,22 12,28" stroke="rgba(255,255,255,0.88)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="23" y1="29" x2="33" y2="29" stroke="rgba(255,255,255,0.70)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function GlassBlackbox() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-blackbox" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#140830"/>
          <stop offset="100%" stopColor="#0C051E"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-blackbox)" stroke="rgba(124,58,237,0.22)" strokeWidth="1"/>
      <rect x="11" y="11" width="22" height="22" rx="3" stroke="rgba(255,255,255,0.78)" strokeWidth="1.5"/>
      <rect x="15" y="15" width="14" height="14" rx="2" stroke="rgba(255,255,255,0.32)" strokeWidth="1" strokeDasharray="2.5 2"/>
      <circle cx="31" cy="13" r="3" fill="#FF3B30" opacity="0.85"/>
    </svg>
  );
}

export function GlassVoid() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-void" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A1835"/>
          <stop offset="100%" stopColor="#060F22"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-void)" stroke="rgba(96,165,250,0.22)" strokeWidth="1"/>
      <circle cx="22" cy="22" r="10" stroke="rgba(255,255,255,0.78)" strokeWidth="1.5"/>
      <circle cx="22" cy="22" r="6"  stroke="rgba(255,255,255,0.42)" strokeWidth="1.2"/>
      <circle cx="22" cy="22" r="2"  fill="rgba(255,255,255,0.88)"/>
    </svg>
  );
}

export function GlassSignal() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-signal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#261A05"/>
          <stop offset="100%" stopColor="#191104"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-signal)" stroke="rgba(251,191,36,0.22)" strokeWidth="1"/>
      <circle cx="22" cy="32" r="2.5" fill="rgba(255,255,255,0.88)"/>
      <path d="M15 26 A9 9 0 0 1 29 26" stroke="rgba(255,255,255,0.72)" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M10 21 A15 15 0 0 1 34 21" stroke="rgba(255,255,255,0.42)" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M5 16 A21 21 0 0 1 39 16" stroke="rgba(255,255,255,0.20)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function GlassArena() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-arena" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#280A1A"/>
          <stop offset="100%" stopColor="#180611"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-arena)" stroke="rgba(244,114,182,0.22)" strokeWidth="1"/>
      <path
        d="M22 11 L24.5 18.5 L32.5 18.5 L26.5 23.5 L28.5 31 L22 26.5 L15.5 31 L17.5 23.5 L11.5 18.5 L19.5 18.5 Z"
        fill="rgba(255,255,255,0.82)"
      />
    </svg>
  );
}

export function GlassDoom() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-doom" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1A0303"/>
          <stop offset="100%" stopColor="#0D0101"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-doom)" stroke="rgba(255,59,48,0.35)" strokeWidth="1"/>
      {/* Skull face */}
      <ellipse cx="22" cy="20" rx="9" ry="10" stroke="rgba(255,59,48,0.90)" strokeWidth="1.4"/>
      {/* Eye sockets */}
      <ellipse cx="18.5" cy="19" rx="2.5" ry="2.8" fill="rgba(255,59,48,0.85)"/>
      <ellipse cx="25.5" cy="19" rx="2.5" ry="2.8" fill="rgba(255,59,48,0.85)"/>
      {/* Nose */}
      <path d="M21 23.5 L22 25 L23 23.5" stroke="rgba(255,59,48,0.65)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Teeth */}
      <path d="M17 30 L17 27 M20 30 L20 27 M23 30 L23 27 M26 30 L26 27" stroke="rgba(255,255,255,0.70)" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M15 27 L28 27" stroke="rgba(255,255,255,0.30)" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

export function GlassStudio() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="g-studio" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1C0A35"/>
          <stop offset="100%" stopColor="#110621"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="11" fill="url(#g-studio)" stroke="rgba(192,132,252,0.22)" strokeWidth="1"/>
      <rect x="10" y="20" width="4" height="12" rx="2" fill="rgba(255,255,255,0.80)"/>
      <rect x="16" y="15" width="4" height="17" rx="2" fill="rgba(255,255,255,0.80)"/>
      <rect x="22" y="11" width="4" height="21" rx="2" fill="rgba(255,255,255,0.80)"/>
      <rect x="28" y="17" width="4" height="15" rx="2" fill="rgba(255,255,255,0.80)"/>
      <rect x="34" y="23" width="4" height="9"  rx="2" fill="rgba(255,255,255,0.80)"/>
    </svg>
  );
}
