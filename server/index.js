import "dotenv/config";
import express from "express";
import { Readable } from "node:stream";
import { fetchChatCompletion } from "../lib/anthropic.js";
import { fetchTtsStream } from "../lib/elevenlabs.js";

const app = express();
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_API_KEY;
const ELEVEN_KEY = process.env.ELEVEN;

if (!API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY in .env");
  process.exit(1);
}

app.post("/api/chat", async (req, res) => {
  try {
    const result = await fetchChatCompletion(API_KEY, req.body);
    if (!result.ok)
      return res.status(result.status).json({ error: result.error });
    res.json(result.data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Internal proxy error" });
  }
});

app.post("/api/tts", async (req, res) => {
  if (!ELEVEN_KEY) {
    return res.status(500).json({ error: "Missing ELEVEN api key" });
  }

  try {
    const result = await fetchTtsStream(ELEVEN_KEY, req.body);
    if (!result.ok)
      return res.status(result.status).json({ error: result.error });

    res.setHeader("Content-Type", "audio/mpeg");
    Readable.fromWeb(result.response.body).pipe(res);
  } catch (err) {
    console.error("TTS proxy error:", err.message);
    res.status(500).json({ error: "Internal TTS proxy error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API proxy listening on :${PORT}`));
