import { PERSONAS } from "../data/personas.js";

export default function MessageBubble({ side, text }) {
  const persona = PERSONAS[side];
  const isLeft = side === "left";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isLeft ? "flex-start" : "flex-end",
        marginBottom: 16,
        animation: "slideIn 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          padding: "14px 18px",
          borderRadius: isLeft ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          background: persona.bubbleBg,
          border: `1px solid ${persona.accent}22`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: persona.accent,
            fontWeight: 600,
            marginBottom: 6,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {persona.emoji} {persona.name}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: "#d4d4d4" }}>{text}</div>
      </div>
    </div>
  );
}
