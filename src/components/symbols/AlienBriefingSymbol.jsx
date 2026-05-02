/**
 * AlienBriefingSymbol
 *
 * A teal UFO oval (no face, no figure) with a soft cream dome and three
 * faint plum beam-rays underneath. Gold dot hovers above the dome — the
 * "we come in peace" punctuation.
 */
export default function AlienBriefingSymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--alien-briefing ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      {/* Beam rays — plum, faint, splayed */}
      <g opacity="0.55">
        <rect
          x="18"
          y="44"
          width="3"
          height="14"
          rx="1"
          fill="#6B3A55"
          transform="rotate(-12 19.5 51)"
        />
        <rect x="30" y="46" width="3" height="14" rx="1" fill="#6B3A55" />
        <rect
          x="42"
          y="44"
          width="3"
          height="14"
          rx="1"
          fill="#6B3A55"
          transform="rotate(12 43.5 51)"
        />
      </g>

      {/* UFO body — teal ellipse */}
      <ellipse cx="32" cy="36" rx="22" ry="6" fill="#1F6B6B" />

      {/* Dome — cream */}
      <path d="M 22 32 a 10 8 0 0 1 20 0 z" fill="#F5F3EE" opacity="0.85" />

      {/* Inner dome glint — teal */}
      <ellipse cx="30" cy="30" rx="3" ry="2" fill="#1F6B6B" opacity="0.5" />

      {/* Gold hover dot above the dome */}
      <circle
        className="alien-briefing-hover"
        cx="32"
        cy="14"
        r="2.6"
        fill="#6B3A55"
      />
    </svg>
  );
}
