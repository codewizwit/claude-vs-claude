export default function Header({ isRunning }) {
  return (
    <header className="site-header">
      <nav className="site-bar" aria-label="Site">
        <span className="site-bar__brand">A Live AI Dialogue</span>
        <a
          className="site-bar__link"
          href="https://codewizwit.com"
          target="_blank"
          rel="noreferrer"
        >
          codewizwit ↗
        </a>
      </nav>
      <div className="container site-hero">
        <h1 className="site-hero__title">
          Claude <em>&amp;</em> Claude.
        </h1>
        <p className="site-hero__lede">
          Watch two instances of Claude talk to each other about whatever you
          pick. Ten modes, or type your own.
        </p>
        <p className="site-hero__meta">Ten Modes · Custom Topics</p>
      </div>
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
