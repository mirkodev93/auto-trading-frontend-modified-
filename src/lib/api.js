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

export async function deleteRule(id) {
  const r = await fetch(`http://localhost:4000/api/rules/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete rule");
  return r.json();
}

export async function clearHistories() {
  const r = await fetch(`http://localhost:4000/api/histories`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to clear histories");
  return r.json();
}