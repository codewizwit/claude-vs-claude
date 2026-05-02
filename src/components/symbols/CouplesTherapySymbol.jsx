/**
 * CouplesTherapySymbol
 *
 * Two plum half-shapes that almost form a heart but leave a visible gap down
 * the middle. The fracture is the point — relationship in pieces. A single
 * gold dot floats in the gap like the thing they keep failing to say.
 */
export default function CouplesTherapySymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--couples-therapy ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      {/* Left half — plum, tilted away */}
      <g transform="rotate(-6 22 32)">
        <path
          d="M 28 18
             a 10 10 0 0 0 -18 6
             c 0 10 8 18 18 26
             z"
          fill="#6B3A55"
        />
      </g>

      {/* Right half — plum at lower opacity, tilted away the other direction */}
      <g transform="rotate(8 42 32)">
        <path
          d="M 36 18
             a 10 10 0 0 1 18 6
             c 0 10 -8 18 -18 26
             z"
          fill="#6B3A55"
          opacity="0.7"
        />
      </g>

      {/* Gold dot in the gap — the unsaid thing */}
      <circle
        className="couples-therapy-gap"
        cx="32"
        cy="34"
        r="2.6"
        fill="#6B3A55"
      />
    </svg>
  );
}
