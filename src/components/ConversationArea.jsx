import { useRef, useEffect, useState, useCallback } from "react";
import { PERSONAS } from "../data/personas.js";
import {
  speakMessage,
  stopSpeech,
  unlockAudio,
  onTtsError,
} from "../api/tts.js";
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
  onDownload,
  error,
}) {
  const scrollRef = useRef(null);
  const userScrolledUp = useRef(false);
  const spokenCount = useRef(0);
  const [voiceOn, setVoiceOn] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    onTtsError((message) => {
      showToast(message);
      setVoiceOn(false);
      stopSpeech();
    });
    return () => onTtsError(null);
  }, [showToast]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const handleScroll = () => {
      userScrolledUp.current =
        element.scrollHeight - element.scrollTop - element.clientHeight > 80;
    };
    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current && !userScrolledUp.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (messages.length === 0) {
      spokenCount.current = 0;
    }
  }, [messages]);

  useEffect(() => {
    if (!voiceOn) return;
    if (messages.length <= spokenCount.current) return;
    const fresh = messages.slice(spokenCount.current);
    spokenCount.current = messages.length;
    fresh.forEach((message) => speakMessage(message.text, message.side));
  }, [messages, voiceOn]);

  const toggleVoice = useCallback(() => {
    setVoiceOn((previous) => {
      if (previous) {
        stopSpeech();
        return false;
      }
      unlockAudio();
      spokenCount.current = messages.length;
      return true;
    });
  }, [messages.length]);

  useEffect(() => {
    window.addEventListener("beforeunload", stopSpeech);
    return () => {
      stopSpeech();
      window.removeEventListener("beforeunload", stopSpeech);
    };
  }, []);

  const typingSideClass = typing === "left" ? "left" : "right";

  return (
    <section className="conversation">
      <div className="container-conversation">
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}

        <div className="topic-banner">
          <div className="topic-banner__copy">
            <span className="topic-banner__meta">
              Topic &middot; Round {turnCount} / {maxTurns}
            </span>
            <span className="topic-banner__topic">{topic}</span>
          </div>
          <button
            type="button"
            className={`voice-toggle${voiceOn ? " is-on" : ""}`}
            onClick={toggleVoice}
            aria-pressed={voiceOn}
            aria-label={voiceOn ? "Turn voice off" : "Turn voice on"}
          >
            {voiceOn ? "Voice on" : "Voice off"}
          </button>
        </div>

        {error && (
          <div role="alert" className="error-banner">
            {error}
          </div>
        )}

        <div ref={scrollRef} aria-live="polite" className="messages-scroll">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              side={message.side}
              text={message.text}
            />
          ))}

          {typing && (
            <div className={`message-row message-row--${typingSideClass}`}>
              <div
                className={`message-bubble message-bubble--${typingSideClass}`}
              >
                <div
                  className={`message-bubble__name message-bubble__name--${typingSideClass}`}
                >
                  {PERSONAS[typing].name}
                </div>
                <TypingIndicator side={typing} />
              </div>
            </div>
          )}
        </div>

        <div className="conversation-controls">
          {isRunning ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onStop}
            >
              Stop
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onNewTopic}
              >
                New topic
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onRematch}
              >
                Rematch
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onDownload}
              >
                Download
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
