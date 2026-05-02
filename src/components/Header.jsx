export default function Header({ isRunning, compact = false, onHome }) {
  const brandContent = compact ? (
    <>
      Claude <span className="amp">&amp;</span> Claude
    </>
  ) : (
    "A Live AI Dialogue"
  );
  return (
    <header className={`site-header${compact ? " site-header--compact" : ""}`}>
      <nav className="site-bar" aria-label="Site">
        {compact && onHome ? (
          <button
            type="button"
            className="site-bar__brand site-bar__brand--button"
            onClick={onHome}
          >
            {brandContent}
          </button>
        ) : (
          <span className="site-bar__brand">{brandContent}</span>
        )}
        {isRunning ? (
          <span
            className="site-bar__tag site-bar__tag--live"
            role="status"
            aria-label="Debate in progress"
          >
            <span className="live-indicator__dot" aria-hidden="true" />
            Live
          </span>
        ) : (
          <span className="site-bar__tag">A Wizwit Jawn</span>
        )}
      </nav>
      {!compact && (
        <div className="container site-hero">
          <h1 className="site-hero__title">
            Claude <span className="amp">&amp;</span> Claude.
          </h1>
          <p className="site-hero__lede">
            2 instances of Claude talking to one another: wayward topics, hot
            takes, and the occasional rap battle. Rap Battle is the fave. It's
            the one with voice.
          </p>
        </div>
      )}
    </header>
  );
}
