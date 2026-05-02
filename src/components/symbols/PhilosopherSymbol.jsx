/**
 * PhilosopherSymbol
 *
 * Wizwit Shorts illustration language. Plum crescent (the introspective moon)
 * with a small gold dot tracing a slow orbit around it, and a cream highlight
 * notch on the crescent's inner edge. Reads as "thought looping back on itself."
 *
 * Decorative; meaning is conveyed by the card title.
 */
export default function PhilosopherSymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--philosopher ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      {/* Faint orbit guide */}
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke="#6B3A55"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.28"
      />

      {/* Plum crescent — the moon of thought.
          Built as a filled plum disc with a cream disc subtracted via even-odd. */}
      <path
        d="M 14 30
           a 18 18 0 1 0 30 -10
           a 14 14 0 1 1 -22 14
           a 18 18 0 0 0 -8 -4 z"
        fill="#6B3A55"
      />

      {/* Cream highlight notch on the crescent's inner curve */}
      <circle cx="34" cy="22" r="2.2" fill="#F5F3EE" opacity="0.7" />

      {/* Orbiting gold dot, animated */}
      <g className="philosopher-orbit" style={{ transformOrigin: "32px 32px" }}>
        <circle cx="58" cy="32" r="3" fill="#C8973E" />
      </g>
    </svg>
  );
}
