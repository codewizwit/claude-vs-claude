import { useRef, useEffect } from "react";
import { PERSONAS } from "../data/personas.js";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

export default function ConversationArea({
  messages,
  typing,
  topic,
  turnCount,
  maxTurns,
  isRunning,
  onStop,
  onNewTopic,
  onRematch,
  error,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
      {/* Topic banner */}
      <div
        style={{
          textAlign: "center",
          padding: "10px 20px",
          marginBottom: 20,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>
          Topic:
        </span>{" "}
        <span style={{ color: "#ccc", fontSize: 14 }}>{topic}</span>
        <span style={{ color: "#444", fontSize: 12, marginLeft: 12 }}>
          Round {turnCount}/{maxTurns}
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div role="alert" className="error-banner">
          {error}
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        aria-live="polite"
        style={{
          maxHeight: "55vh",
          overflowY: "auto",
          paddingRight: 8,
          scrollBehavior: "smooth",
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} side={msg.side} text={msg.text} />
        ))}

        {/* Typing indicator */}
        {typing && (
          <div
            style={{
              display: "flex",
              justifyContent: typing === "left" ? "flex-start" : "flex-end",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderRadius: typing === "left" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                background: PERSONAS[typing].bubbleBg,
                border: `1px solid ${PERSONAS[typing].accent}22`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: PERSONAS[typing].accent,
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {PERSONAS[typing].emoji} {PERSONAS[typing].name}
              </div>
              <TypingIndicator color={PERSONAS[typing].accent} />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "20px 0" }}>
        {isRunning ? (
          <button className="stop-btn" onClick={onStop}>
            ■ Stop
          </button>
        ) : (
          <>
            <button className="go-btn" onClick={onNewTopic}>
              ↻ New Topic
            </button>
            <button
              className="go-btn"
              onClick={onRematch}
              style={{ background: "linear-gradient(135deg, #ef5350, #ff9800)" }}
            >
              ⚡ Rematch
            </button>
          </>
        )}
      </div>
    </section>
  );
}
