export default function MooSymbol({ className = "" }) {
  return (
    <svg
      className={`mode-symbol mode-symbol--moo ${className}`.trim()}
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      {/* Left horn */}
      <path
        d="M 22 18 Q 14 10 12 14 Q 16 18 20 22 Z"
        fill="#F5F3EE"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right horn */}
      <path
        d="M 42 18 Q 50 10 52 14 Q 48 18 44 22 Z"
        fill="#F5F3EE"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Left ear */}
      <ellipse
        cx="17"
        cy="30"
        rx="6"
        ry="4"
        fill="#1A1A1A"
        transform="rotate(-30 17 30)"
      />
      {/* Right ear */}
      <ellipse
        cx="47"
        cy="30"
        rx="6"
        ry="4"
        fill="#1A1A1A"
        transform="rotate(30 47 30)"
      />

      {/* Head — bell-shape: narrow top, wide muzzle */}
      <path
        d="M 26 18
           Q 32 14 38 18
           L 41 32
           Q 44 38 44 44
           Q 44 52 38 54
           L 26 54
           Q 20 52 20 44
           Q 20 38 23 32 Z"
        fill="#1A1A1A"
      />

      {/* Cream muzzle patch — wide oval at the bottom of head */}
      <ellipse cx="32" cy="46" rx="11" ry="6" fill="#F5F3EE" />

      {/* Two cream spots inside the ink head */}
      <ellipse
        cx="38"
        cy="26"
        rx="3.5"
        ry="2.5"
        fill="#F5F3EE"
        transform="rotate(-15 38 26)"
      />
      <ellipse cx="25" cy="36" rx="2.8" ry="2" fill="#F5F3EE" />

      {/* Plum bell strap */}
      <rect x="30.5" y="54" width="3" height="3" fill="#6B3A55" />

      {/* Gold bell — the family signature dot, here as the cowbell */}
      <circle className="moo-bell" cx="32" cy="59" r="3" fill="#6B3A55" />
    </svg>
  );
}
