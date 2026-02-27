import { TOPICS } from "../data/topics.js";

export default function TopicPicker({
  topic,
  setTopic,
  customTopic,
  setCustomTopic,
  maxTurns,
  setMaxTurns,
  onStart,
  onRandom,
}) {
  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px 20px", animation: "slideIn 0.4s ease" }}>
      <div
        style={{
          fontSize: 11,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: 12,
        }}
      >
        Pick a topic or write your own
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {TOPICS.map((t) => (
          <button
            key={t}
            className={`topic-btn ${topic === t && !customTopic ? "selected" : ""}`}
            onClick={() => {
              setTopic(t);
              setCustomTopic("");
            }}
          >
            {t}
          </button>
        ))}
        <button className="topic-btn" onClick={onRandom}>
          🎲 Random
        </button>
      </div>

      <input
        type="text"
        placeholder="Or type a custom topic..."
        aria-label="Custom debate topic"
        value={customTopic}
        onChange={(e) => {
          setCustomTopic(e.target.value);
          setTopic("");
        }}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          color: "#e0e0e0",
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          outline: "none",
          marginBottom: 16,
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.25)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button className="go-btn" disabled={!topic && !customTopic} onClick={onStart}>
          ⚡ Start the debate
        </button>
        <div style={{ fontSize: 12, color: "#555" }}>
          <label>
            Rounds:{" "}
            <select
              value={maxTurns}
              onChange={(e) => setMaxTurns(Number(e.target.value))}
              aria-label="Number of debate rounds"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#aaa",
                padding: "4px 8px",
                borderRadius: 4,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
              }}
            >
              {[4, 6, 8, 10, 12].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
