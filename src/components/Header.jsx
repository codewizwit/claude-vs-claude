export default function Header({ isRunning, compact = false, onHome }) {
  const brandContent = compact ? (
    <>
      Claude <em>&amp;</em> Claude
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
      </nav>
      {!compact && (
        <div className="container site-hero">
          <h1 className="site-hero__title">
            Claude <em>&amp;</em> Claude.
          </h1>
          <p className="site-hero__lede">
            Watch two instances of Claude talk to each other about whatever you
            pick.
          </p>
        </div>
      )}
      {isRunning && (
        <div
          className="live-indicator"
          role="status"
          aria-label="Debate in progress"
        >
          <span className="live-indicator__dot" aria-hidden="true" />
          Live
        </div>
      )}
    </header>
  );
}
