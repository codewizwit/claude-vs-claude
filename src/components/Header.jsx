export default function Header({ isRunning }) {
  return (
    <header className="site-header">
      <div className="container">
        <p className="label">A dialogue between two AIs</p>
        <h1>Claude &amp; Claude</h1>
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
