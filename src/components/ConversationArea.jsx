import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { findMode } from "../data/topics.js";
import {
  speakMessage,
  stopSpeech,
  unlockAudio,
  onTtsError,
} from "../api/tts.js";
import Turn from "./Turn.jsx";

const VOICE_ENABLED_MODES = new Set(["freestyle"]);
const SCROLL_UP_THRESHOLD_PX = 80;

/**
 * Pair messages into exchanges of two: [left, right]. If the last message is
 * unpaired (only one side spoke this round), it becomes a one-sided row whose
 * empty slot may be filled by a typing indicator or empty placeholder.
 */
function buildExchanges(messages, typing) {
  const rows = [];
  for (let index = 0; index < messages.length; index += 2) {
    rows.push({
      left: messages[index] ?? null,
      right: messages[index + 1] ?? null,
    });
  }

  if (typing) {
    const lastRow = rows[rows.length - 1];
    const needsNewRow =
      !lastRow ||
      (lastRow.left && lastRow.right) ||
      (typing === "left" && lastRow.left) ||
      (typing === "right" && lastRow.right);

    if (needsNewRow) {
      rows.push({
        left: typing === "left" ? { typing: true } : null,
        right: typing === "right" ? { typing: true } : null,
      });
    } else if (typing === "left" && !lastRow.left) {
      lastRow.left = { typing: true };
    } else if (typing === "right" && !lastRow.right) {
      lastRow.right = { typing: true };
    }
  }

  return rows;
}

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
  const userScrolledUp = useRef(false);
  const spokenCount = useRef(0);
  const lastRowRef = useRef(null);
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

  // Track whether the user has scrolled up away from the bottom of the page.
  useEffect(() => {
    const handleScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      userScrolledUp.current = distanceFromBottom > SCROLL_UP_THRESHOLD_PX;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll the latest exchange row into view, accounting for the fixed
  // footer via scroll-margin-bottom on the row.
  useEffect(() => {
    if (userScrolledUp.current) return;
    if (!lastRowRef.current) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    lastRowRef.current.scrollIntoView({
      block: "end",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
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

  const currentMode = findMode(topic);
  const voiceAvailable = currentMode && VOICE_ENABLED_MODES.has(currentMode.id);

  useEffect(() => {
    if (!voiceAvailable && voiceOn) {
      setVoiceOn(false);
      stopSpeech();
    }
  }, [voiceAvailable, voiceOn]);

  const exchanges = useMemo(
    () => buildExchanges(messages, typing),
    [messages, typing],
  );

  const renderCell = (cell, side) => {
    if (!cell) return <Turn side={side} empty />;
    if (cell.typing) return <Turn side={side} typing />;
    return <Turn side={side} text={cell.text} />;
  };

  return (
    <section className="conversation">
      <div className="container-conversation">
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}

        <header className="transcript-header">
          <div className="transcript-header__copy">
            <span className="transcript-header__meta">
              Round {turnCount} / {maxTurns}
            </span>
            <span className="transcript-header__topic">{topic}</span>
          </div>
          {voiceAvailable && (
            <button
              type="button"
              className={`voice-toggle${voiceOn ? " is-on" : ""}`}
              onClick={toggleVoice}
              aria-pressed={voiceOn}
              aria-label={voiceOn ? "Turn voice off" : "Turn voice on"}
            >
              {voiceOn ? "Voice on" : "Voice off"}
            </button>
          )}
        </header>

        {error && (
          <div role="alert" className="error-banner">
            {error}
          </div>
        )}

        <div aria-live="polite" className="transcript">
          {exchanges.map((row, index) => {
            const isLast = index === exchanges.length - 1;
            return (
              <div
                key={index}
                ref={isLast ? lastRowRef : null}
                className={`exchange${isLast ? " exchange--last" : ""}`}
              >
                {renderCell(row.left, "left")}
                {renderCell(row.right, "right")}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="transcript-footer">
        <div className="transcript-footer__inner">
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
      </footer>
    </section>
  );
}
