# Claude vs Claude

A fun AI debate simulator where two Claude instances argue about silly topics. Pick a topic (or make your own), sit back, and watch the sparks fly.

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

- **Frontend** — React + Vite on `:5173`
- **Backend** — Express proxy on `:3001` that forwards requests to the Anthropic API with your key (never exposed to the browser)
- Pick a topic, set the number of rounds, and hit "Start the debate"
- Claude A and Claude B take turns arguing, each with their own personality

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
├── src/
│   ├── api/claude.js        # Frontend API client
│   ├── components/          # React components
│   ├── data/                # Personas and topics
│   └── styles/global.css    # Animations and button styles
├── index.html
├── vercel.json              # Vercel routing config
├── vite.config.js
└── package.json
```

## License

MIT
