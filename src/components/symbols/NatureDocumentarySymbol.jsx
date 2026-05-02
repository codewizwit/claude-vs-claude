/**
 * NatureDocumentarySymbol
 *
 * An ink clapperboard with the angled top hinged open, plus three cream
 * stripes on the slate. Off-axis, a touch hand-drawn. The gold dot is the
 * record indicator — "we're rolling on this rare specimen."
 */
export default function NatureDocumentarySymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--nature-documentary ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(-4 32 36)">
        {/* Slate body — ink */}
        <rect x="8" y="26" width="48" height="28" rx="2" fill="#1A1A1A" />

        {/* Hinged top arm — teal, angled up */}
        <g transform="rotate(-12 12 22)">
          <rect x="6" y="18" width="48" height="8" rx="1.5" fill="#1F6B6B" />
          {/* Cream stripes on the arm */}
          <rect
            x="14"
            y="19"
            width="6"
            height="6"
            fill="#F5F3EE"
            opacity="0.85"
          />
          <rect
            x="28"
            y="19"
            width="6"
            height="6"
            fill="#F5F3EE"
            opacity="0.85"
          />
          <rect
            x="42"
            y="19"
            width="6"
            height="6"
            fill="#F5F3EE"
            opacity="0.85"
          />
        </g>

        {/* Lines on the slate */}
        <rect
          x="16"
          y="36"
          width="28"
          height="2"
          rx="1"
          fill="#F5F3EE"
          opacity="0.55"
        />
        <rect
          x="16"
          y="42"
          width="22"
          height="2"
          rx="1"
          fill="#F5F3EE"
          opacity="0.4"
        />
      </g>

      {/* Gold record-light dot */}
      <circle
        className="nature-doc-rec"
        cx="52"
        cy="14"
        r="2.8"
        fill="#6B3A55"
      />
    </svg>
  );
}
