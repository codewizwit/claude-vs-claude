/**
 * Decide which top-level view to render: the topic picker (home screen) or the
 * conversation view. Exactly one of them is shown at a time.
 *
 * An error counts as a conversation state. A conversation that fails before its
 * first message leaves us not running and with no messages, but with an error
 * to show. The error banner lives inside the conversation view, so an error
 * must keep us there. Otherwise the app silently drops back to the home screen
 * and swallows the error, which looks like a mysterious snap back to home.
 */
export function resolveView({ isRunning, messageCount, error }) {
  if (isRunning || messageCount > 0 || error) return "conversation";
  return "picker";
}
