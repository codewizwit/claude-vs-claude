export default function DadJokesSymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--dad-jokes ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <g className="dad-jokes-tie" transform-origin="32 12">
        {/* Plum knot at top */}
        <path d="M 26 6 L 38 6 L 36 14 L 28 14 Z" fill="#6B3A55" />

        {/* Gold tie body — long pentagon widening to a point */}
        <path
          d="M 28 14
             L 36 14
             L 40 36
             L 32 56
             L 24 36 Z"
          fill="#C8973E"
        />

        {/* Cream diagonal stripe across the tie */}
        <path
          d="M 26 28 L 38 24 L 39 30 L 27 34 Z"
          fill="#F5F3EE"
          opacity="0.85"
        />

        {/* Ink shadow line down the center for dimension */}
        <path
          d="M 32 14 L 32 56"
          stroke="#1A1A1A"
          strokeWidth="0.6"
          opacity="0.25"
        />
      </g>

      {/* Gold dot — the joke landing */}
      <circle
        className="dad-jokes-wink"
        cx="48"
        cy="50"
        r="2.6"
        fill="#C8973E"
      />
    </svg>
  );
}
