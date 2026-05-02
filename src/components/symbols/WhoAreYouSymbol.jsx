/**
 * WhoAreYouSymbol
 *
 * Two interlocking plum discs slightly out of register — a shape and its echo
 * that don't quite line up. The mismatch IS the meaning: the question of self
 * looking at itself and not finding a clean fit. A small gold dot sits in the
 * gap between them.
 */
export default function WhoAreYouSymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--who-are-you ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      {/* Echo disc — plum at lower opacity, offset down-right */}
      <circle cx="38" cy="36" r="18" fill="#6B3A55" opacity="0.55" />

      {/* Primary disc — plum solid, offset up-left */}
      <circle cx="26" cy="28" r="18" fill="#6B3A55" />

      {/* Cream highlight notch on the primary, suggests a glance/gaze */}
      <circle cx="22" cy="22" r="2.4" fill="#F5F3EE" opacity="0.75" />

      {/* Gold dot in the gap between the two — the "?" between selves */}
      <circle
        className="who-are-you-pulse"
        cx="48"
        cy="20"
        r="2.6"
        fill="#6B3A55"
      />
    </svg>
  );
}
