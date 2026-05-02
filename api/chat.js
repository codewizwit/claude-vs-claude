import { fetchChatCompletion } from "../lib/anthropic.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY" });
  }

  try {
    const result = await fetchChatCompletion(API_KEY, req.body);
    if (!result.ok)
      return res.status(result.status).json({ error: result.error });
    res.json(result.data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Internal proxy error" });
  }
}
