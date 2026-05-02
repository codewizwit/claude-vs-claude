const DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB";

export async function fetchTtsStream(apiKey, { text, voiceId }) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || DEFAULT_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    return { ok: false, status: response.status, error };
  }

  return { ok: true, response };
}
