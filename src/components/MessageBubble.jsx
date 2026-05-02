import { PERSONAS } from "../data/personas.js";

export default function MessageBubble({ side, text }) {
  const persona = PERSONAS[side];
  const sideClass = side === "left" ? "left" : "right";

  return (
    <div className={`message-row message-row--${sideClass}`}>
      <div className={`message-bubble message-bubble--${sideClass}`}>
        <div
          className={`message-bubble__name message-bubble__name--${sideClass}`}
        >
          {persona.name}
        </div>
        <div className="message-bubble__body">{text}</div>
      </div>
    </div>
  );
}
