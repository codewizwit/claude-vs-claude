import { useState, useRef, useEffect, useCallback } from "react";

const PERSONAS = {
  left: {
    name: "Claude A",
    emoji: "🔵",
    system: "You are Claude A in a fun, friendly debate with Claude B. You're witty, slightly contrarian, and love playing devil's advocate. Keep responses to 2-3 sentences max. Be entertaining and playful. Don't be generic or boring. Take real positions. Don't say you're an AI or talk about being an AI. Just engage with the topic like a sharp, funny person at a party.",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    accent: "#4fc3f7",
    bubbleBg: "#1e2d4a",
  },
  right: {
    name: "Claude B",
    emoji: "🔴",
    system: "You are Claude B in a fun, friendly debate with Claude A. You're enthusiastic, opinionated, and love finding unexpected angles on topics. Keep responses to 2-3 sentences max. Be entertaining and playful. Don't be generic or boring. Take real positions. Don't say you're an AI or talk about being an AI. Just engage with the topic like a sharp, funny person at a party.",
    gradient: "linear-gradient(135deg, #2e1a1a 0%, #3e1621 100%)",
    accent: "#ef5350",
    bubbleBg: "#4a1e2d",
  },
};

const TOPICS = [
  "Is a hot dog a sandwich?",
  "Tabs vs spaces: the eternal war",
  "Is cereal a soup?",
  "Best decade for music: 80s vs 90s",
  "Remote work vs office: fight",
  "Pineapple on pizza: righteous or criminal?",
  "Are we living in a simulation?",
  "Coffee vs tea: only one survives",
  "Should toilet paper go over or under?",
  "Is water wet?",
];

async function callClaude(messages, system) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages,
    }),
  });
  const data = await response.json();
  const text = data.content
    ?.filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  return text || "...";
}

function TypingIndicator({ color }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
            opacity: 0.6,
            animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function ClaudeVsClaude() {
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const [typing, setTyping] = useState(null);
  const [maxTurns, setMaxTurns] = useState(8);
  const scrollRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const runConversation = useCallback(
    async (selectedTopic) => {
      stopRef.current = false;
      setIsRunning(true);
      setMessages([]);
      setTurnCount(0);

      const history = [];
      let currentSide = "left";

      // First message: Claude A kicks it off
      setTyping("left");
      const opener = await callClaude(
        [{ role: "user", content: `The topic is: "${selectedTopic}". Give your hot take to start the debate. Remember, keep it to 2-3 sentences.` }],
        PERSONAS.left.system
      );

      if (stopRef.current) return;

      const firstMsg = { side: "left", text: opener };
      history.push(firstMsg);
      setMessages([firstMsg]);
      setTurnCount(1);
      setTyping(null);

      currentSide = "right";

      for (let turn = 1; turn < maxTurns; turn++) {
        if (stopRef.current) break;

        await new Promise((r) => setTimeout(r, 800));
        if (stopRef.current) break;

        setTyping(currentSide);

        const persona = PERSONAS[currentSide];
        const otherSide = currentSide === "left" ? "right" : "left";

        // Build message history for this Claude's perspective
        const apiMessages = [];
        for (const msg of history) {
          if (msg.side === currentSide) {
            apiMessages.push({ role: "assistant", content: msg.text });
          } else {
            apiMessages.push({ role: "user", content: msg.text });
          }
        }

        // If the last message is from "assistant" perspective, we need to add a user prompt
        if (apiMessages.length > 0 && apiMessages[apiMessages.length - 1].role === "assistant") {
          // This shouldn't happen in normal flow, but just in case
          apiMessages.push({ role: "user", content: "Continue the debate." });
        }

        // Ensure first message is always "user"
        if (apiMessages.length > 0 && apiMessages[0].role === "assistant") {
          apiMessages.unshift({
            role: "user",
            content: `The topic is: "${selectedTopic}". You're in a fun debate. Here's what's been said so far. Respond to the latest point.`,
          });
        }

        const reply = await callClaude(apiMessages, persona.system);
        if (stopRef.current) break;

        const newMsg = { side: currentSide, text: reply };
        history.push(newMsg);
        setMessages((prev) => [...prev, newMsg]);
        setTurnCount(turn + 1);
        setTyping(null);

        currentSide = currentSide === "left" ? "right" : "left";
      }

      setTyping(null);
      setIsRunning(false);
    },
    [maxTurns]
  );

  const handleStart = () => {
    const t = customTopic || topic;
    if (!t) return;
    runConversation(t);
  };

  const handleStop = () => {
    stopRef.current = true;
    setIsRunning(false);
    setTyping(null);
  };

  const randomTopic = () => {
    const t = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    setTopic(t);
    setCustomTopic("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e0e0e0",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        
        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 1px); }
          94% { transform: translate(2px, -1px); }
          96% { transform: translate(-1px, -1px); }
          98% { transform: translate(1px, 2px); }
        }
        
        * { box-sizing: border-box; }
        
        .topic-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #aaa;
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .topic-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.25);
        }
        .topic-btn.selected {
          background: rgba(79, 195, 247, 0.15);
          border-color: #4fc3f7;
          color: #4fc3f7;
        }
        
        .go-btn {
          background: linear-gradient(135deg, #4fc3f7, #ef5350);
          border: none;
          color: #fff;
          padding: 12px 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .go-btn:hover { transform: scale(1.04); filter: brightness(1.1); }
        .go-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        
        .stop-btn {
          background: rgba(239, 83, 80, 0.2);
          border: 1px solid #ef5350;
          color: #ef5350;
          padding: 12px 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .stop-btn:hover { background: rgba(239, 83, 80, 0.3); }
      `}</style>

      {/* Scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 100,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "32px 20px 20px",
          position: "relative",
        }}
      >
        <div
          style={{
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
        </div>
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
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ef5350",
              }}
            />
            LIVE
          </div>
        )}
      </div>

      {/* Topic Selection */}
      {!isRunning && messages.length === 0 && (
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "0 20px 20px",
            animation: "slideIn 0.4s ease",
          }}
        >
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

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
            }}
          >
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
            <button className="topic-btn" onClick={randomTopic}>
              🎲 Random
            </button>
          </div>

          <input
            type="text"
            placeholder="Or type a custom topic..."
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
            <button
              className="go-btn"
              disabled={!topic && !customTopic}
              onClick={handleStart}
            >
              ⚡ Start the debate
            </button>
            <div style={{ fontSize: 12, color: "#555" }}>
              <label>
                Rounds:{" "}
                <select
                  value={maxTurns}
                  onChange={(e) => setMaxTurns(Number(e.target.value))}
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
        </div>
      )}

      {/* Conversation Area */}
      {(messages.length > 0 || isRunning) && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
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
            <span style={{ color: "#ccc", fontSize: 14 }}>{customTopic || topic}</span>
            <span style={{ color: "#444", fontSize: 12, marginLeft: 12 }}>
              Round {turnCount}/{maxTurns}
            </span>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              maxHeight: "55vh",
              overflowY: "auto",
              paddingRight: 8,
              scrollBehavior: "smooth",
            }}
          >
            {messages.map((msg, i) => {
              const persona = PERSONAS[msg.side];
              const isLeft = msg.side === "left";
              return (
                <div
                  key={i}
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
                      position: "relative",
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
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#d4d4d4",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              padding: "20px 0",
            }}
          >
            {isRunning ? (
              <button className="stop-btn" onClick={handleStop}>
                ■ Stop
              </button>
            ) : (
              <>
                <button
                  className="go-btn"
                  onClick={() => {
                    setMessages([]);
                    setTurnCount(0);
                  }}
                >
                  ↻ New Topic
                </button>
                <button
                  className="go-btn"
                  onClick={() => runConversation(customTopic || topic)}
                  style={{ background: "linear-gradient(135deg, #ef5350, #ff9800)" }}
                >
                  ⚡ Rematch
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: 20,
          fontSize: 11,
          color: "#333",
          letterSpacing: 2,
        }}
      >
        NO HUMANS WERE HARMED IN THE MAKING OF THIS DEBATE
      </div>
    </div>
  );
}
