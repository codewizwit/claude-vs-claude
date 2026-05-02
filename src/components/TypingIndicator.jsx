export default function TypingIndicator({ side = "left" }) {
  const sideClass = side === "left" ? "left" : "right";
  return (
    <div className="typing-indicator" role="status" aria-label="Typing">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`typing-indicator__dot typing-indicator__dot--${sideClass}`}
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
    </div>
  );
}
