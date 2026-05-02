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

const ROUND_OPTIONS = [4, 6, 8, 10, 12, 16, 20, 30, 50, 100, 200];

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
    <section className="topic-picker">
      <div className="container">
        <div className="topic-picker__heading">
          <p className="topic-picker__intro">
            Two instances of Claude talk to each other about whatever you pick.
            You watch.
          </p>
        </div>

        <div className="mode-grid">
          {MODES.map((mode) => {
            const isSelected = topic === mode.topic && !customTopic;
            const Symbol = MODE_SYMBOLS[mode.id];
            return (
              <button
                key={mode.id}
                type="button"
                className={`mode-card${isSelected ? " is-selected" : ""}`}
                onClick={() => {
                  setTopic(mode.topic);
                  setCustomTopic("");
                }}
              >
                {Symbol ? (
                  <div className="mode-card__symbol" aria-hidden="true">
                    <Symbol />
                  </div>
                ) : (
                  <div className="mode-card__emoji" aria-hidden="true">
                    {mode.emoji}
                  </div>
                )}
                <div className="mode-card__title">{mode.title}</div>
                <div className="mode-card__desc">{mode.desc}</div>
              </button>
            );
          })}
        </div>

        <div className="divider" role="presentation">
          <span className="divider__rule" aria-hidden="true" />
          <span className="divider__label">Or</span>
          <span className="divider__rule" aria-hidden="true" />
        </div>

        <div className="topic-form">
          <input
            type="text"
            className="topic-input"
            placeholder="Type any topic"
            aria-label="Custom debate topic"
            value={customTopic}
            onChange={(event) => {
              setCustomTopic(event.target.value);
              setTopic("");
            }}
          />

          <div className="picker-controls">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!topic && !customTopic}
              onClick={onStart}
            >
              Start
            </button>
            <button type="button" className="btn btn-ghost" onClick={onRandom}>
              Random
            </button>
            <label className="rounds-label">
              Rounds
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
      </div>
    </section>
  );
}
