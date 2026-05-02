const VOICES = {
  left: "pNInz6obpgDQGcFmaJgB", // Adam — American
  right: "onwK4e9ZLuTAKqWW03F9", // Daniel — British
};

let pending = [];
let ready = [];
let fetching = false;
let playing = false;
let gen = 0;
let controller = null;
let audio = null;
let errorCallback = null;

export function onTtsError(cb) {
  errorCallback = cb;
}

function notifyError(msg) {
  if (errorCallback) errorCallback(msg);
}

export function unlockAudio() {
  if (!audio) {
    audio = new Audio();
    audio.src =
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";
    audio.play().catch(() => {});
  }
}

function stripMarkdownForSpeech(text) {
  const stripped = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/[*_`]/g, "");

  // Normalize line breaks into pauseable punctuation so the TTS breathes
  // between lines and longer between paragraphs.
  return stripped
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split(/\n/)
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return "";
          return /[.!?,;:—-]$/.test(trimmed) ? trimmed : `${trimmed},`;
        })
        .filter(Boolean)
        .join(" ")
        .replace(/,$/, "."),
    )
    .filter(Boolean)
    .join(". ... ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function speakMessage(text, side) {
  const cleaned = stripMarkdownForSpeech(text);
  if (!cleaned) return;
  pending.push({ text: cleaned, side });
  startFetching();
}

export function stopSpeech() {
  gen++;
  pending = [];
  ready.forEach((url) => URL.revokeObjectURL(url));
  ready = [];
  fetching = false;
  playing = false;
  if (controller) {
    controller.abort();
    controller = null;
  }
  if (audio) {
    audio.pause();
    audio.src = "";
  }
}

async function startFetching() {
  if (fetching) return;
  fetching = true;
  const myGen = gen;
  controller = new AbortController();
  const signal = controller.signal;

  while (pending.length > 0 && myGen === gen) {
    const { text, side } = pending.shift();
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: VOICES[side] }),
        signal,
      });
      if (myGen !== gen) break;
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail = body?.detail;
        if (detail?.status === "quota_exceeded") {
          notifyError(
            "Voice quota exceeded — upgrade ElevenLabs or disable voice",
          );
        } else {
          notifyError(`Voice failed (${res.status})`);
        }
        continue;
      }
      const raw = await res.blob();
      if (myGen !== gen) break;
      const blob =
        raw.type === "audio/mpeg"
          ? raw
          : new Blob([raw], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      ready.push(url);
      startPlaying();
    } catch {
      if (myGen !== gen) break;
      continue;
    }
  }

  if (myGen === gen) fetching = false;
}

async function startPlaying() {
  if (playing) return;
  playing = true;
  const myGen = gen;

  while (ready.length > 0 && myGen === gen) {
    const url = ready.shift();
    if (!audio) audio = new Audio();
    audio.src = url;
    await new Promise((resolve) => {
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    });
    URL.revokeObjectURL(url);
  }

  if (myGen === gen) playing = false;
}
