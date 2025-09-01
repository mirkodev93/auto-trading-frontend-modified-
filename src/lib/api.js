export async function getHistories(limit = 100) {
  const r = await fetch(`http://localhost:4000/api/histories?limit=${limit}`);
  if (!r.ok) throw new Error("Failed to fetch histories");
  return r.json();
}

export async function getBalances() {
  // Backend returns: [{token:'btc',value:0}, {token:'eth',...}, {token:'sol',...}, {token:'usdt',...}]
  const r = await fetch(`http://localhost:4000/api/balances`);
  if (!r.ok) throw new Error("Failed to fetch balances");
  const data = await r.json();
  return data;
}

export async function clearHistories() {
  const r = await fetch(`http://localhost:4000/api/histories`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to clear histories");
  return r.json();
}

export async function sendConfig(payload) {
  const res = await fetch(`http://localhost:4000/api/trading/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Save failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function getSettings() {
  try {
    const res = await fetch(`http://localhost:4000/api/trading`, { cache: "no-store" });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`GET /api/trading failed: ${res.status} ${text}`);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("getSettings failed:", e);
    throw e;
  }
}

export async function getTradingStatus() {
  try {
    const res = await fetch("http://localhost:4000/api/trading/start");
    if (!res.ok) {
      throw new Error(`Failed to fetch trading status: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error("getTradingStatus failed:", err);
    throw err;
  }
}

export async function updateTradingStatus(isStart) {
  try {
    const res = await fetch(`http://localhost:4000/api/trading/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isStart: isStart }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update trading status: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error("updateTradingStatus failed:", err);
    throw err;
  }
}