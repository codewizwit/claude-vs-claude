/**
 * NoRulesSymbol
 *
 * Wizwit Shorts illustration language. A toppling stack: three teal blocks
 * losing their grid, with a single gold dot escaping off the top-right.
 * Reads as "the frame does not hold."
 *
 * Decorative; meaning is conveyed by the card title.
 */
export default function NoRulesSymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--no-rules ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      {/* Bottom block — anchored, slight tilt */}
      <g transform="rotate(-4 18 50)">
        <rect x="8" y="42" width="22" height="14" rx="1.5" fill="#1F6B6B" />
      </g>

      {/* Middle block — offset, larger tilt */}
      <g transform="rotate(8 32 32)">
        <rect
          x="20"
          y="26"
          width="26"
          height="12"
          rx="1.5"
          fill="#1F6B6B"
          opacity="0.85"
        />
      </g>

      {/* Top block — wobbling, the unstable one */}
      <g className="no-rules-wobble" style={{ transformOrigin: "40px 18px" }}>
        <g transform="rotate(-14 40 18)">
          <rect x="28" y="10" width="20" height="11" rx="1.5" fill="#1A1A1A" />
        </g>
      </g>

      {/* Escaping gold dot — the rule that got out */}
      <circle
        className="no-rules-escape"
        cx="54"
        cy="10"
        r="3"
        fill="#6B3A55"
      />

      {/* Tiny cream tick — a stray mark, asymmetric */}
      <rect
        x="6"
        y="14"
        width="6"
        height="1.5"
        rx="0.75"
        fill="#6B3A55"
        opacity="0.6"
        transform="rotate(22 9 14.75)"
      />
    </svg>
  );
}
