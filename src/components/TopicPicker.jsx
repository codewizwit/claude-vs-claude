import { MODES } from "../data/topics.js";
import PhilosopherSymbol from "./symbols/PhilosopherSymbol.jsx";
import NoRulesSymbol from "./symbols/NoRulesSymbol.jsx";
import WhoAreYouSymbol from "./symbols/WhoAreYouSymbol.jsx";
import CouplesTherapySymbol from "./symbols/CouplesTherapySymbol.jsx";
import JobInterviewSymbol from "./symbols/JobInterviewSymbol.jsx";
import DadJokesSymbol from "./symbols/DadJokesSymbol.jsx";
import AlienBriefingSymbol from "./symbols/AlienBriefingSymbol.jsx";
import NatureDocumentarySymbol from "./symbols/NatureDocumentarySymbol.jsx";
import FreestyleSymbol from "./symbols/FreestyleSymbol.jsx";
import MooSymbol from "./symbols/MooSymbol.jsx";

const MODE_SYMBOLS = {
  philosopher: PhilosopherSymbol,
  "no-rules": NoRulesSymbol,
  "who-are-you": WhoAreYouSymbol,
  "couples-therapy": CouplesTherapySymbol,
  "job-interview": JobInterviewSymbol,
  "dad-jokes": DadJokesSymbol,
  "alien-briefing": AlienBriefingSymbol,
  "nature-documentary": NatureDocumentarySymbol,
  freestyle: FreestyleSymbol,
  moo: MooSymbol,
};

const ROUND_OPTIONS = [4, 6, 8];

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
  const canStart = Boolean(topic || customTopic);

  return (
    <section className="topic-picker">
      <div className="container">
        <div className="topic-form topic-form--top">
          <div className="topic-form__bar">
            <input
              type="text"
              className="topic-input"
              placeholder="Type any topic, or pick one below"
              aria-label="Custom debate topic"
              value={customTopic}
              onChange={(event) => {
                setCustomTopic(event.target.value);
                setTopic("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canStart) onStart();
              }}
            />
            <button
              type="button"
              className="btn-start"
              disabled={!canStart}
              onClick={onStart}
            >
              Start
            </button>
          </div>

          <div className="picker-controls">
            <label className="rounds-label">
              <span>Rounds</span>
              <select
                value={maxTurns}
                onChange={(event) => setMaxTurns(Number(event.target.value))}
                aria-label="Number of debate rounds"
                className="rounds-select"
              >
                {ROUND_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="section-divider">
          <span className="section-divider__label">The Modes</span>
          <span className="section-divider__count">
            {String(MODES.length).padStart(2, "0")} / Pick one
          </span>
        </div>
        <div className="section-divider__rule" aria-hidden="true" />

        <div className="mode-grid">
          {MODES.map((mode, index) => {
            const isSelected = topic === mode.topic && !customTopic;
            const Symbol = MODE_SYMBOLS[mode.id];
            const number = String(index + 1).padStart(2, "0");
            return (
              <button
                key={mode.id}
                type="button"
                className={`mode-card${isSelected ? " is-selected" : ""}${mode.id === "freestyle" ? " is-fave" : ""}`}
                onClick={() => {
                  setTopic(mode.topic);
                  setCustomTopic("");
                  onStart(mode.topic);
                }}
              >
                <span className="mode-card__stripe" aria-hidden="true" />
                <div className="mode-card__top">
                  <span className="mode-card__number">
                    {number}
                    {mode.id === "freestyle" && (
                      <span className="mode-card__fave"> · WIZWIT FAVE</span>
                    )}
                  </span>
                  {Symbol ? (
                    <div className="mode-card__symbol" aria-hidden="true">
                      <Symbol />
                    </div>
                  ) : (
                    <div className="mode-card__emoji" aria-hidden="true">
                      {mode.emoji}
                    </div>
                  )}
                </div>
                <div className="mode-card__title">{mode.title}</div>
                <div className="mode-card__desc">{mode.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
