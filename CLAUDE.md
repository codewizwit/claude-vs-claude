# Claude Code Instructions

## Security

- NEVER read, open, display, or reference `.env` files or any file containing secrets/API keys
- NEVER include API keys, tokens, or credentials in responses

## Architecture

- **Frontend**: Vite + React SPA
- **Local dev proxy**: Express server (`server/index.js`) forwards `/api/chat` to the Anthropic API, keeping the key server-side
- **Production**: Vercel serverless function (`api/chat.js`) handles the same route in prod

## Key Files

| Path | Purpose |
|------|---------|
| `src/components/ClaudeVsClaude.jsx` | Main debate UI component |
| `src/data/personas.js` | Persona definitions (name, style, system prompt) |
| `src/data/topics.js` | Debate topic list |
| `server/index.js` | Express dev proxy for Anthropic API |
| `api/chat.js` | Vercel serverless function (prod API route) |

## Conventions

- Inline styles — no CSS modules or external stylesheets
- JSX functional components (no class components)
- ES modules throughout (`"type": "module"` in `package.json`)
- Monospace **JetBrains Mono** font theme

## Dev Workflow

- `npm run dev` — starts Vite + Express proxy for local development
- `npx vercel --prod` — deploy to Vercel
