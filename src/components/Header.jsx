export default function Header({ isRunning }) {
  return (
    <header style={{ textAlign: "center", padding: "32px 20px 20px", position: "relative" }}>
      <h1
        style={{
          margin: 0,
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 800,
          background: "linear-gradient(90deg, #4fc3f7, #fff, #ef5350)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "2px",
          animation: "glitch 4s infinite",
        }}
      >
        CLAUDE vs CLAUDE
      </h1>
      <div
        style={{
          fontSize: 13,
          color: "#555",
          marginTop: 6,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        spectator mode
      </div>
      {isRunning && (
        <div
          role="status"
          aria-label="Debate in progress"
          style={{
            position: "absolute",
            top: 12,
            right: 20,
            fontSize: 11,
            color: "#ef5350",
            animation: "pulse 1.5s infinite",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef5350" }} />
          LIVE
        </div>
      )}
    </header>
  );
}
