# Claude Code Instructions

## Security

- NEVER read, open, display, or reference `.env` files or any file containing secrets/API keys
- NEVER include API keys, tokens, or credentials in responses

## Architecture

- **Frontend**: Vite + React SPA
- **Local dev proxy**: Express server (`server/index.js`) forwards `/api/chat` and `/api/tts` to external APIs, keeping keys server-side
- **Production**: Vercel serverless functions (`api/chat.js`, `api/tts.js`) handle the same routes in prod
- **Shared logic**: `lib/anthropic.js` and `lib/elevenlabs.js` contain the fetch logic used by both dev server and prod functions

## Key Files

| Path                                | Purpose                                                  |
| ----------------------------------- | -------------------------------------------------------- |
| `src/components/ClaudeVsClaude.jsx` | Main conversation UI component                           |
| `src/components/GrainOverlay.jsx`   | 3% opacity SVG noise overlay (felt, not seen)            |
| `src/styles/global.css`             | Design tokens, reset, focus, selection, grain, keyframes |
| `src/styles/typography.css`         | Self-hosted font faces, heading scale, label/link        |
| `src/styles/utilities.css`          | Container, section, flex, spacing, reveal helpers        |
| `src/styles/components.css`         | Buttons, mode cards, message bubbles, topic banner       |
| `src/data/personas.js`              | Persona definitions (name, style, system prompt)         |
| `src/data/topics.js`                | Mode definitions with system prompts and opener prompts  |
| `src/api/claude.js`                 | Frontend fetch wrapper for `/api/chat`                   |
| `src/api/tts.js`                    | Client-side TTS queue and audio playback                 |
| `lib/anthropic.js`                  | Shared Anthropic API fetch logic                         |
| `lib/elevenlabs.js`                 | Shared ElevenLabs TTS fetch logic                        |
| `server/index.js`                   | Express dev proxy (uses lib/)                            |
| `api/chat.js`                       | Vercel serverless function for chat (uses lib/)          |
| `api/tts.js`                        | Vercel serverless function for TTS (uses lib/)           |

## Conventions

- Class-based styles in `src/styles/` (global, typography, utilities, components). Components are structural JSX only. No inline visual styles.
- JSX functional components (no class components)
- ES modules throughout (`"type": "module"` in `package.json`)
- Brand system: codewizwit cream + black + gold baseline, with plum (`#6B3A55`) for Claude A and teal (`#1F6B6B`) for Claude B as per-piece pop accents
- Self-hosted fonts in `public/fonts/`: Lora (heading), Inter (body), JetBrains Mono (code)
- Topics are data-driven: add new modes to `MODES` array in `topics.js` with a `system` function and `openerPrompt`
- Voice: no em dashes anywhere in code or copy. Use periods or commas. Sentence case for UI labels.

## Dev Workflow

- `npm run dev` -- starts Vite + Express proxy for local development
- `npx vercel --prod` -- deploy to Vercel
