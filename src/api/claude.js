export async function callClaude(messages, system) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error (${response.status}): ${body}`);
  }

  const data = await response.json();
  const text = data.content
    ?.filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  if (!text) throw new Error("Empty response from Claude");
  return text;
}
