/**
 * JobInterviewSymbol
 *
 * An ink clipboard angled slightly off-axis, with a cream notch at the top
 * (the clip), two short cream lines suggesting form fields, and a single
 * gold dot in the corner — the "tick" of an evaluation in progress.
 */
export default function JobInterviewSymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--job-interview ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(-5 32 32)">
        {/* Clipboard body — ink */}
        <rect x="14" y="12" width="36" height="44" rx="2" fill="#1A1A1A" />

        {/* Clip at top — plum */}
        <rect x="26" y="8" width="12" height="6" rx="1.5" fill="#6B3A55" />

        {/* Form field lines — cream */}
        <rect
          x="20"
          y="24"
          width="20"
          height="2"
          rx="1"
          fill="#F5F3EE"
          opacity="0.8"
        />
        <rect
          x="20"
          y="32"
          width="24"
          height="2"
          rx="1"
          fill="#F5F3EE"
          opacity="0.6"
        />
        <rect
          x="20"
          y="40"
          width="16"
          height="2"
          rx="1"
          fill="#F5F3EE"
          opacity="0.6"
        />
      </g>

      {/* Gold checkmark dot — the evaluation in progress */}
      <circle
        className="job-interview-tick"
        cx="48"
        cy="46"
        r="2.8"
        fill="#6B3A55"
      />
    </svg>
  );
}
