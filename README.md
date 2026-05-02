# Claude & Claude

A spectator-mode dialogue between two Claude instances. Pick a mode (or write your own topic), then watch them riff. Visual design follows the codewizwit brand system: cream baseline, plum and teal as per-piece pop accents for Claude A and Claude B.

## Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/codewizwit/claude-vs-claude.git
   cd claude-vs-claude
   npm install
   ```

2. **Add your API key**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your [Anthropic API key](https://console.anthropic.com/).

3. **Start the app**

   ```bash
   npm run dev
   ```

   This launches both the Vite dev server and the Express API proxy. Open [http://localhost:5173](http://localhost:5173).

## How it works

- **Frontend**: React + Vite on `:5173`
- **Backend**: Express proxy on `:3001` that forwards requests to the Anthropic API with your key (never exposed to the browser)
- Pick a mode, set the number of rounds, and hit Start
- Claude A (plum accent) and Claude B (teal accent) take turns, each with their own persona

## Brand system

Visual design follows the codewizwit brand baseline (cream + black + gold) with plum and teal as the per-piece pop accents for the two Claudes. Tokens, type, layout, and components live in four stylesheets under `src/styles/`:

| File             | Contents                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `global.css`     | Design tokens, CSS reset, focus styles, selection, grain overlay, keyframes              |
| `typography.css` | `@font-face` (self-hosted Lora, Inter, JetBrains Mono), heading scale, `.label`, `.link` |
| `utilities.css`  | `.container`, sections, flex, spacing, `.sr-only`, `.reveal`                             |
| `components.css` | `.btn-*`, `.mode-card`, `.message-bubble`, `.topic-banner`, `.toast`, `.error-banner`    |

Components are structural JSX only. All visual decisions live in the stylesheets above.

## Deploy to Vercel

1. **Install Vercel CLI** (if you haven't already)

   ```bash
   npm i -g vercel
   ```

2. **Set your API key**

   ```bash
   npx vercel env add ANTHROPIC_API_KEY
   ```

   Paste your key when prompted. Select all environments (Production, Preview, Development).

3. **Deploy**

   ```bash
   npx vercel --prod
   ```

   Vercel will build the Vite frontend and deploy the `/api/chat` serverless function automatically.

## Project structure

```
├── api/chat.js              # Vercel serverless function (API proxy)
├── server/index.js          # Express API proxy (local dev)
├── public/fonts/            # Self-hosted Lora, Inter, JetBrains Mono (WOFF2)
├── src/
│   ├── api/claude.js        # Frontend API client
│   ├── components/          # React components (structural JSX only)
│   ├── data/                # Personas and topics
│   └── styles/              # global, typography, utilities, components
├── index.html
├── vercel.json              # Vercel routing config
├── vite.config.js
└── package.json
```

## License

MIT
