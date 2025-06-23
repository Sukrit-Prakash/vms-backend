const API_BASE = "http://localhost:5000";

export async function fetchStreams() {
  const res = await fetch(`${API_BASE}/streams/`);
  return res.json();
}

export async function fetchResults(streamId, limit = 5) {
  const res = await fetch(`${API_BASE}/results/?stream_id=${streamId}&limit=${limit}`);
  return res.json();
}

export async function registerStream(url) {
  const res = await fetch(`${API_BASE}/streams/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return res.json();
}

export async function startStream(streamId) {
  const res = await fetch(`${API_BASE}/streams/${streamId}/start`, { method: "POST" });
  return res.json();
}

export async function stopStream(streamId) {
  const res = await fetch(`${API_BASE}/streams/${streamId}/stop`, { method: "POST" });
  return res.json();
} 