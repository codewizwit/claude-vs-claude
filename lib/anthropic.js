const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export async function fetchChatCompletion(
  apiKey,
  { model, max_tokens, system, messages, thinking },
) {
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model, max_tokens, system, messages, thinking }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { ok: false, status: response.status, error };
  }

  const data = await response.json();
  return { ok: true, data };
}
