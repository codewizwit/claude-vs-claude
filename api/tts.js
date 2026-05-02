import { fetchTtsStream } from "../lib/elevenlabs.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.ELEVEN;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing ELEVEN api key" });
  }

  try {
    const result = await fetchTtsStream(API_KEY, req.body);
    if (!result.ok)
      return res.status(result.status).json({ error: result.error });

    res.setHeader("Content-Type", "audio/mpeg");
    const reader = result.response.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };
    await pump();
  } catch (err) {
    console.error("TTS proxy error:", err.message);
    res.status(500).json({ error: "Internal TTS proxy error" });
  }
}
