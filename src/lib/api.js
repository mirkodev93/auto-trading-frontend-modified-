const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

export async function getRules() {
  const r = await fetch(`${API_BASE}/api/rules`);
  if (!r.ok) throw new Error("Failed to fetch rules");
  return r.json();
}

export async function createRule(data) {
  const r = await fetch(`${API_BASE}/api/rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to create rule");
  return r.json();
}

export async function clearRules() {
  const r = await fetch(`${API_BASE}/api/rules`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to clear rules");
  return r.json();
}

export async function getHistories(limit = 100) {
  const r = await fetch(`${API_BASE}/api/histories?limit=${limit}`);
  if (!r.ok) throw new Error("Failed to fetch histories");
  return r.json();
}

export async function postHistory(payload) {
  const r = await fetch(`${API_BASE}/api/histories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Failed to post history");
  return r.json();
}

export async function getBalances() {
  console.log("Fetching balances from API...");
  // Backend returns: [{token:'btc',value:0}, {token:'eth',...}, {token:'sol',...}, {token:'usdt',...}]
  console.log("API_BASE:", API_BASE);
  const r = await fetch(`http://localhost:4000/api/balances`);
  console.log("======>>>>>>", r);
  if (!r.ok) throw new Error("Failed to fetch balances");
  const data = await r.json();
  console.log("------>>>>>>", data);
  return data;
}

export async function deleteRule(id) {
  const r = await fetch(`${API_BASE}/api/rules/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete rule");
  return r.json();
}
