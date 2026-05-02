/**
 * FreestyleSymbol
 *
 * Teal microphone — a stacked oval head and a stubby base, no stand or cable.
 * A single cream highlight on the head suggests the grille. Gold dot is the
 * mic's "live" indicator.
 */
export default function FreestyleSymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--freestyle ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(-8 32 32)">
        {/* Mic head — teal */}
        <rect x="22" y="8" width="20" height="30" rx="10" fill="#1F6B6B" />

        {/* Cream grille line */}
        <rect
          x="26"
          y="16"
          width="12"
          height="2"
          rx="1"
          fill="#F5F3EE"
          opacity="0.7"
        />
        <rect
          x="26"
          y="22"
          width="12"
          height="2"
          rx="1"
          fill="#F5F3EE"
          opacity="0.55"
        />
        <rect
          x="26"
          y="28"
          width="12"
          height="2"
          rx="1"
          fill="#F5F3EE"
          opacity="0.4"
        />

        {/* Mic neck — ink */}
        <rect x="29" y="38" width="6" height="10" rx="1.5" fill="#1A1A1A" />

        {/* Mic base — ink */}
        <rect x="20" y="48" width="24" height="6" rx="2" fill="#1A1A1A" />
      </g>

      {/* Gold "live" dot */}
      <circle
        className="freestyle-live"
        cx="48"
        cy="14"
        r="2.8"
        fill="#6B3A55"
      />
    </svg>
  );
}
