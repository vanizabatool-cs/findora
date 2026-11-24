// Findora hero illustration (inline SVG, no image file needed)
export default function HeroArt() {
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lost belongings illustration">
      <defs>
        <linearGradient id="fd-bag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8cfae" /><stop offset="1" stopColor="#eeb48c" />
        </linearGradient>
        <linearGradient id="fd-bagDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1bd98" /><stop offset="1" stopColor="#e5a57b" />
        </linearGradient>
        <radialGradient id="fd-glass" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#f4f8ff" /><stop offset=".6" stopColor="#cfdcf6" /><stop offset="1" stopColor="#b6c8ee" />
        </radialGradient>
        <linearGradient id="fd-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d7ccf3" /><stop offset="1" stopColor="#b3a3e2" />
        </linearGradient>
        <linearGradient id="fd-handle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9bcee" /><stop offset="1" stopColor="#a999dc" />
        </linearGradient>
        <linearGradient id="fd-hp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8e3c4" /><stop offset="1" stopColor="#73c79c" />
        </linearGradient>
        <linearGradient id="fd-note" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbeaa6" /><stop offset="1" stopColor="#f2d97c" />
        </linearGradient>
        <filter id="fd-sh" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#5a3fb0" floodOpacity=".18" />
        </filter>
        <filter id="fd-sh2" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#5a3fb0" floodOpacity=".16" />
        </filter>
      </defs>

      {/* background blobs */}
      <circle cx="190" cy="125" r="108" fill="#d7ccf7" />
      <circle cx="332" cy="82" r="36" fill="#fcdcc9" />
      <ellipse cx="62" cy="172" rx="48" ry="42" fill="#c5f0da" />

      {/* backpack */}
      <g filter="url(#fd-sh)" transform="rotate(-6 70 70)">
        <rect x="30" y="8" width="62" height="12" rx="6" fill="#e9a97f" />
        <rect x="28" y="14" width="76" height="92" rx="26" fill="url(#fd-bag)" />
        <rect x="40" y="62" width="52" height="38" rx="12" fill="url(#fd-bagDark)" />
        <path d="M44 72h44" stroke="#e0a07a" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="18" y="30" width="14" height="52" rx="7" fill="#eeb48c" />
        <rect x="98" y="30" width="10" height="46" rx="5" fill="#eeb48c" />
        <ellipse cx="52" cy="38" rx="14" ry="9" fill="#fff" opacity=".28" />
      </g>

      {/* headphones */}
      <g filter="url(#fd-sh)" transform="rotate(8 305 150)">
        <path d="M268 138c-4-40 18-62 42-62s46 22 42 62" fill="none" stroke="url(#fd-hp)" strokeWidth="12" strokeLinecap="round" />
        <rect x="258" y="128" width="26" height="44" rx="13" fill="url(#fd-hp)" />
        <rect x="336" y="128" width="26" height="44" rx="13" fill="url(#fd-hp)" />
        <rect x="264" y="136" width="12" height="28" rx="6" fill="#9ad8b8" />
        <rect x="344" y="136" width="12" height="28" rx="6" fill="#9ad8b8" />
        <path d="M272 124c-2-8 0-14 4-18" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      {/* magnifier */}
      <g filter="url(#fd-sh)">
        <rect x="128" y="150" width="20" height="82" rx="10" fill="url(#fd-handle)" transform="rotate(38 138 191)" />
        <circle cx="198" cy="106" r="54" fill="url(#fd-rim)" />
        <circle cx="198" cy="106" r="42" fill="url(#fd-glass)" />
        <path d="M170 88c6-14 20-22 34-20" stroke="#fff" strokeOpacity=".85" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="222" cy="130" r="3" fill="#fff" opacity=".6" />
      </g>

      {/* keys */}
      <g filter="url(#fd-sh2)" transform="rotate(-8 60 180)">
        <circle cx="46" cy="170" r="11" fill="none" stroke="#c9ccd6" strokeWidth="4" />
        <g transform="rotate(18 52 190)">
          <rect x="46" y="176" width="9" height="42" rx="4" fill="#d9b86a" />
          <circle cx="50.5" cy="182" r="5" fill="#f1d58f" />
          <path d="M55 202h6v4h-6zM55 210h8v4h-8z" fill="#d9b86a" />
        </g>
        <g transform="rotate(-8 40 190)">
          <rect x="32" y="176" width="9" height="38" rx="4" fill="#c9a557" />
          <circle cx="36.5" cy="182" r="5" fill="#e8cb83" />
          <path d="M32 200h-6v4h6zM32 208h-8v4h8z" fill="#c9a557" />
        </g>
        <rect x="58" y="162" width="22" height="22" rx="6" fill="#7a5ce0" transform="rotate(24 69 173)" />
        <circle cx="64" cy="168" r="2.2" fill="#fff" opacity=".85" />
      </g>

      {/* lanyard ID */}
      <g filter="url(#fd-sh2)">
        <path d="M232 168c-14-6-18-28-4-36 12-6 24 4 22 18" fill="none" stroke="#a48ae8" strokeWidth="5" strokeLinecap="round" />
        <path d="M250 150l-5 12" stroke="#a48ae8" strokeWidth="5" strokeLinecap="round" />
        <rect x="196" y="168" width="48" height="34" rx="6" fill="#f6f6fb" stroke="#e1def0" strokeWidth="1.5" transform="rotate(-5 220 185)" />
        <rect x="208" y="176" width="24" height="3.5" rx="1.7" fill="#d4d0e6" transform="rotate(-5 220 185)" />
        <rect x="208" y="184" width="16" height="3.5" rx="1.7" fill="#d4d0e6" transform="rotate(-5 220 185)" />
        <rect x="226" y="164" width="9" height="6" rx="2" fill="#cfc9e8" transform="rotate(-5 220 185)" />
      </g>

      {/* notebook */}
      <g filter="url(#fd-sh)" transform="rotate(-22 322 190)">
        <rect x="282" y="140" width="76" height="92" rx="9" fill="url(#fd-note)" />
        <rect x="288" y="146" width="64" height="80" rx="6" fill="#fdf2b8" />
        <g fill="none" stroke="#b9b3c9" strokeWidth="2.6" strokeLinecap="round">
          <path d="M278 152h14M278 164h14M278 176h14M278 188h14M278 200h14M278 212h14M278 224h14" />
        </g>
        <g stroke="#e8d782" strokeWidth="1.4" strokeLinecap="round">
          <path d="M304 162h38M304 176h38M304 190h38M304 204h38" />
        </g>
      </g>

      {/* badge */}
      <g filter="url(#fd-sh2)">
        <rect x="226" y="218" width="104" height="30" rx="15" fill="#fff" />
        <circle cx="243" cy="233" r="8" fill="#d6f3e4" />
        <path d="M239.2 233.2l2.8 2.8 5-5.4" fill="none" stroke="#2f9e6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="257" y="236.5" fontFamily="Plus Jakarta Sans, system-ui, sans-serif" fontSize="8.6" fontWeight="700" fill="#1f1b3a">
          Back where it belongs.
        </text>
      </g>
    </svg>
  );
}