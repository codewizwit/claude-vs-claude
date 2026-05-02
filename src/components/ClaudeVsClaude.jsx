import { useState, useRef, useCallback } from "react";
import { PERSONAS } from "../data/personas.js";
import { TOPIC_TEXTS, findMode } from "../data/topics.js";
import { callClaude } from "../api/claude.js";
import { exportHtml } from "../utils/exportHtml.js";
import { stopSpeech } from "../api/tts.js";
import Header from "./Header.jsx";
import TopicPicker from "./TopicPicker.jsx";
import ConversationArea from "./ConversationArea.jsx";
import Footer from "./Footer.jsx";
import GrainOverlay from "./GrainOverlay.jsx";

export default function ClaudeVsClaude() {
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const [typing, setTyping] = useState(null);
  const [maxTurns, setMaxTurns] = useState(8);
  const [error, setError] = useState(null);
  const genRef = useRef(0);

  const runConversation = useCallback(
    async (selectedTopic) => {
      genRef.current++;
      const myGen = genRef.current;
      setIsRunning(true);
      setMessages([]);
      setTurnCount(0);
      setError(null);

      const mode = findMode(selectedTopic);
      const history = [];

      const lengthCap =
        "IMPORTANT: Keep your response concise. Aim for about 4 short paragraphs or stanzas maximum, roughly 100-150 words. Land your point and stop.";

      const getSystem = (side) => {
        const base = mode ? mode.system(side) : PERSONAS[side].system;
        return `${base}\n\n${lengthCap}`;
      };

      const openerPrompt = mode
        ? mode.openerPrompt
        : `The topic is: "${selectedTopic}". Give your hot take to start the debate. Remember, keep it to 2-3 sentences.`;

      try {
        setTyping("left");
        const opener = await callClaude(
          [{ role: "user", content: openerPrompt }],
          getSystem("left"),
        );

        if (myGen !== genRef.current) return;

        const firstMsg = { side: "left", text: opener };
        history.push(firstMsg);
        setMessages([firstMsg]);
        setTurnCount(1);
        setTyping(null);

        let currentSide = "right";

        for (let turn = 1; turn < maxTurns; turn++) {
          if (myGen !== genRef.current) break;

          await new Promise((r) => setTimeout(r, 800));
          if (myGen !== genRef.current) break;

          setTyping(currentSide);

          const apiMessages = [];
          for (const msg of history) {
            if (msg.side === currentSide) {
              apiMessages.push({ role: "assistant", content: msg.text });
            } else {
              apiMessages.push({ role: "user", content: msg.text });
            }
          }

          if (
            apiMessages.length > 0 &&
            apiMessages[apiMessages.length - 1].role === "assistant"
          ) {
            apiMessages.push({ role: "user", content: "Continue." });
          }

          if (apiMessages.length > 0 && apiMessages[0].role === "assistant") {
            apiMessages.unshift({
              role: "user",
              content: `The topic is: "${selectedTopic}". You're in a fun debate. Here's what's been said so far. Respond to the latest point.`,
            });
          }

          const reply = await callClaude(apiMessages, getSystem(currentSide));
          if (myGen !== genRef.current) break;

          const newMsg = { side: currentSide, text: reply };
          history.push(newMsg);
          setMessages((prev) => [...prev, newMsg]);
          setTurnCount(turn + 1);
          setTyping(null);

          currentSide = currentSide === "left" ? "right" : "left";
        }
      } catch (err) {
        if (myGen === genRef.current) setError(err.message);
      } finally {
        if (myGen === genRef.current) {
          setTyping(null);
          setIsRunning(false);
        }
      }
    },
    [maxTurns],
  );

  const handleStart = () => {
    const t = customTopic || topic;
    if (!t) return;
    runConversation(t);
  };

  const handleStop = () => {
    genRef.current++;
    setIsRunning(false);
    setTyping(null);
    stopSpeech();
  };

  const goHome = () => {
    genRef.current++;
    stopSpeech();
    setMessages([]);
    setTurnCount(0);
    setError(null);
    setIsRunning(false);
    setTyping(null);
  };

  const randomTopic = () => {
    const t = TOPIC_TEXTS[Math.floor(Math.random() * TOPIC_TEXTS.length)];
    setTopic(t);
    setCustomTopic("");
  };

  const handleDownload = () => {
    const html = exportHtml({
      messages,
      topic: customTopic || topic,
      turnCount,
      maxTurns,
    });
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "claude-vs-claude-debate.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeTopic = customTopic || topic;

  return (
    <div className="app-shell">
      <GrainOverlay />

      <Header
        isRunning={isRunning}
        compact={messages.length > 0 || isRunning}
        onHome={goHome}
      />

      <main className="app-main">
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
            onNewTopic={goHome}
            onRematch={() => {
              stopSpeech();
              runConversation(activeTopic);
            }}
            onDownload={handleDownload}
            error={error}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
