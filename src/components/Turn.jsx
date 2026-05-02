import { PERSONAS } from "../data/personas.js";
import TypingIndicator from "./TypingIndicator.jsx";

const INLINE_MARKDOWN = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;

function renderInline(text) {
  const parts = text.split(INLINE_MARKDOWN);
  return parts.map((part, index) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function Turn({ side, text, typing = false, empty = false }) {
  const sideClass = side === "left" ? "left" : "right";
  const persona = PERSONAS[side];

  if (empty) {
    return (
      <div
        className={`turn turn--${sideClass} turn--empty`}
        aria-hidden="true"
      />
    );
  }

  return (
    <article className={`turn turn--${sideClass}`}>
      <header className={`turn__speaker turn__speaker--${sideClass}`}>
        {persona.name}
      </header>
      {typing ? (
        <div className="turn__body turn__body--typing">
          <TypingIndicator side={side} />
        </div>
      ) : (
        <div className="turn__body">{renderInline(text)}</div>
      )}
    </article>
  );
}
