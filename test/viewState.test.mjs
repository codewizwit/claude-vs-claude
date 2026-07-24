import assert from "node:assert/strict";
import { resolveView } from "../src/viewState.js";

// Idle with nothing to show: the home screen (topic picker).
assert.equal(
  resolveView({ isRunning: false, messageCount: 0, error: null }),
  "picker",
  "idle and empty should show the picker",
);

// A running conversation: the conversation view, even before the first message.
assert.equal(
  resolveView({ isRunning: true, messageCount: 0, error: null }),
  "conversation",
  "running should show the conversation view",
);

// A finished/ongoing conversation with messages: the conversation view.
assert.equal(
  resolveView({ isRunning: false, messageCount: 3, error: null }),
  "conversation",
  "having messages should show the conversation view",
);

// THE BUG: the opener call failed, so there is an error but no messages and
// nothing is running. This must stay on the conversation view so the error
// banner is visible. Before the fix this returned "picker", which silently
// snapped the user back to the home screen and swallowed the error.
assert.equal(
  resolveView({ isRunning: false, messageCount: 0, error: "API error (404)" }),
  "conversation",
  "an error with no messages must keep the conversation view so the error shows",
);

console.log("all viewState assertions passed");
