const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

async function handleRes(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || json.message || "API error");
  return json;
}

export async function fetchProperties(query = {}) {
  const q = new URLSearchParams(query).toString();
  const res = await fetch(`${API_BASE}/properties${q ? "?" + q : ""}`);
  return handleRes(res);
}

export async function fetchPropertyById(id) {
  const res = await fetch(`${API_BASE}/properties/${id}`);
  return handleRes(res);
}

export async function createProperty(payload) {
  const res = await fetch(`${API_BASE}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function updateProperty(id, payload) {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function deleteProperty(id) {
  const res = await fetch(`${API_BASE}/properties/${id}`, { method: "DELETE" });
  return handleRes(res);
}
