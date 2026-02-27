import { useState, useRef, useCallback } from "react";
import { PERSONAS } from "../data/personas.js";
import { TOPICS } from "../data/topics.js";
import { callClaude } from "../api/claude.js";
import Header from "./Header.jsx";
import TopicPicker from "./TopicPicker.jsx";
import ConversationArea from "./ConversationArea.jsx";
import Footer from "./Footer.jsx";

export default function ClaudeVsClaude() {
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const [typing, setTyping] = useState(null);
  const [maxTurns, setMaxTurns] = useState(8);
  const [error, setError] = useState(null);
  const stopRef = useRef(false);

  const runConversation = useCallback(
    async (selectedTopic) => {
      stopRef.current = false;
      setIsRunning(true);
      setMessages([]);
      setTurnCount(0);
      setError(null);

      const history = [];

      try {
        // First message: Claude A kicks it off
        setTyping("left");
        const opener = await callClaude(
          [
            {
              role: "user",
              content: `The topic is: "${selectedTopic}". Give your hot take to start the debate. Remember, keep it to 2-3 sentences.`,
            },
          ],
          PERSONAS.left.system
        );

        if (stopRef.current) return;

        const firstMsg = { side: "left", text: opener };
        history.push(firstMsg);
        setMessages([firstMsg]);
        setTurnCount(1);
        setTyping(null);

        let currentSide = "right";

        for (let turn = 1; turn < maxTurns; turn++) {
          if (stopRef.current) break;

          await new Promise((r) => setTimeout(r, 800));
          if (stopRef.current) break;

          setTyping(currentSide);

          const persona = PERSONAS[currentSide];

          // Build message history for this Claude's perspective
          const apiMessages = [];
          for (const msg of history) {
            if (msg.side === currentSide) {
              apiMessages.push({ role: "assistant", content: msg.text });
            } else {
              apiMessages.push({ role: "user", content: msg.text });
            }
          }

          // If the last message is from "assistant" perspective, add a user prompt
          if (apiMessages.length > 0 && apiMessages[apiMessages.length - 1].role === "assistant") {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setTyping(null);
        setIsRunning(false);
      }
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

  const activeTopic = customTopic || topic;

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
      {/* Scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 100,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      <Header isRunning={isRunning} />

      {!isRunning && messages.length === 0 && (
        <TopicPicker
          topic={topic}
          setTopic={setTopic}
          customTopic={customTopic}
          setCustomTopic={setCustomTopic}
          maxTurns={maxTurns}
          setMaxTurns={setMaxTurns}
          onStart={handleStart}
          onRandom={randomTopic}
        />
      )}

      {(messages.length > 0 || isRunning) && (
        <ConversationArea
          messages={messages}
          typing={typing}
          topic={activeTopic}
          turnCount={turnCount}
          maxTurns={maxTurns}
          isRunning={isRunning}
          onStop={handleStop}
          onNewTopic={() => {
            setMessages([]);
            setTurnCount(0);
            setError(null);
          }}
          onRematch={() => runConversation(activeTopic)}
          error={error}
        />
      )}

      <Footer />
    </div>
  );
}
