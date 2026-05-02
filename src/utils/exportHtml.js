import { PERSONAS } from "../data/personas.js";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const INLINE_MARKDOWN = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;

function renderInlineMarkdown(text) {
  return escapeHtml(text).replace(INLINE_MARKDOWN, (part) => {
    if (part.startsWith("**")) return `<strong>${part.slice(2, -2)}</strong>`;
    if (part.startsWith("*")) return `<em>${part.slice(1, -1)}</em>`;
    if (part.startsWith("`")) return `<code>${part.slice(1, -1)}</code>`;
    return part;
  });
}

export function exportHtml({ messages, topic, turnCount, maxTurns }) {
  const turns = messages
    .map((msg, index) => {
      const persona = PERSONAS[msg.side];
      const isLast = index === messages.length - 1;
      const sideClass = msg.side === "left" ? "turn--left" : "turn--right";
      const lastClass = isLast ? " turn--last" : "";
      return `
      <article class="turn ${sideClass}${lastClass}">
        <header class="turn__speaker">${escapeHtml(persona.name)}</header>
        <div class="turn__body">${renderInlineMarkdown(msg.text)}</div>
      </article>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Claude &amp; Claude · ${escapeHtml(topic)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,0..100;1,9..144,300..900,0..100&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;600;700&family=Playfair+Display:ital,wght@1,500&display=swap"
    rel="stylesheet"
  />
  <style>
    :root {
      --cream: #f5f3ee;
      --ink: #1a1a1a;
      --gray: #6b6b6b;
      --gray-border: #d4d2cd;
      --plum: #7c3aed;
      --teal: #1f6b6b;
      --display: "Fraunces", ui-serif, serif;
      --body: "IBM Plex Sans", system-ui, sans-serif;
      --mono: "JetBrains Mono", ui-monospace, monospace;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: var(--cream);
      color: var(--ink);
      font-family: var(--body);
      line-height: 1.5;
      padding: 2.5rem 1.5rem 4rem;
    }
    .container {
      max-width: 56rem;
      margin: 0 auto;
    }
    .eyebrow {
      font-family: var(--mono);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--gray);
      margin-bottom: 1rem;
    }
    h1 {
      font-family: var(--display);
      font-size: clamp(2.25rem, 5vw, 3.75rem);
      font-weight: 900;
      line-height: 0.98;
      letter-spacing: -0.04em;
      margin-bottom: 1rem;
    }
    h1 .amp {
      font-family: "Playfair Display", serif;
      font-style: italic;
      font-weight: 500;
      color: var(--plum);
      margin-inline: 0.04em;
    }
    .topic {
      font-family: var(--display);
      font-style: italic;
      font-size: 1.25rem;
      color: var(--ink);
      margin-bottom: 0.5rem;
    }
    .meta {
      font-family: var(--mono);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--gray);
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--gray-border);
      margin-bottom: 2rem;
    }
    .turn {
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--gray-border);
    }
    .turn--last { border-bottom: none; }
    .turn__speaker {
      font-family: var(--mono);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      margin-bottom: 0.5rem;
    }
    .turn--left .turn__speaker { color: var(--plum); }
    .turn--right .turn__speaker { color: var(--teal); }
    .turn__body {
      font-size: 0.9375rem;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .turn__body strong { font-weight: 700; }
    .turn__body em { font-style: italic; }
    .turn__body code {
      font-family: var(--mono);
      font-size: 0.9em;
      background: rgba(26,26,26,0.06);
      padding: 0.05rem 0.3rem;
      border-radius: 4px;
    }
    footer {
      margin-top: 3rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--gray-border);
      font-family: var(--mono);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--gray);
      text-align: center;
    }
    @media (prefers-color-scheme: dark) {
      body { background: var(--cream); color: var(--ink); }
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="eyebrow">A Wizwit Jawn · A Live AI Dialogue</p>
    <h1>Claude <span class="amp">&amp;</span> Claude.</h1>
    <p class="topic">${escapeHtml(topic)}</p>
    <p class="meta">Round ${turnCount} / ${maxTurns}</p>

    ${turns}

    <footer>No humans were harmed in the making of this debate.</footer>
  </div>
</body>
</html>`;
}
