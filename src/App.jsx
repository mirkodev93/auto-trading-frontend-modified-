import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Toggle from "./components/Toggle.jsx";
import Balance from "./components/Balance.jsx";
import Trading from "./components/Trading.jsx";
import Chart from "./components/Chart.jsx";
import History from "./components/History.jsx";
import "./App.css";

function App() {
  const [price, setPrice] = useState(0);
  const [mode, setMode] = useState("Trading");
  const [balanceArr, setBalanceArr] = useState([]);
  const [histories, setHistories] = useState([]);
  const [isFuture, setIsFuture] = useState(false);
  const [selectedToken, setSelectedToken] = useState("sol");
  const [manualTrade, setManualTrade] = useState({ isEnabled: false, rules: [] });
  const [autoTrade, setAutoTrade] = useState({ isEnabled: false, minPrice: 0, maxPrice: 0, time: 0 });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Connected to backend WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "price") {
          setPrice(msg.price);
        }

        if (msg.type === "swap_executed") {
          setHistories((prev) => [msg.data.history, ...prev]);
          setBalanceArr(msg.data.balances);
          setPrice(msg.data.price);
          setManualTrade((prev) => ({...prev, rules: msg.data.rules}));
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onclose = () => console.log("WS disconnected");
    ws.onerror = (err) => console.error("WS error:", err);

    return () => ws.close();
  }, []);

  async function sendConfig(payload) {
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

  const handleSave = async () => {
    const settingsObj = {
      future: !!isFuture,
      token: String(selectedToken ?? "sol"),
      manualTrade: manualTrade,
      autoTrade: autoTrade,
    };
    console.log("settings",settingsObj)
    const payload = { settings: JSON.stringify(settingsObj) };
    try {
      await sendConfig(payload);
      console.log("Saved");
    } catch (e) {
      console.error(e);
    }
  };

  async function getSettings() {
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

  function parseSettingsResponse(data) {
    if (Array.isArray(data)) {
      const latest = data[data.length - 1];
      const raw = latest?.settings ?? latest;
      if (typeof raw === "string") {
        try { return JSON.parse(raw); } catch { return {}; }
      }
      if (typeof raw === "object" && raw !== null) return raw;
      return {};
    }
    if (data && typeof data === "object" && "settings" in data) {
      const raw = data.settings;
      if (typeof raw === "string") {
        try { return JSON.parse(raw); } catch { return {}; }
      }
      if (typeof raw === "object" && raw !== null) return raw;
      return {};
    }
    return (typeof data === "object" && data) ? data : {};
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSettings();
      const s = parseSettingsResponse(data);
      setIsFuture(!!s.future);
      setSelectedToken(s.token ?? "sol");
      setManualTrade(s.manualTrade ?? {isEnabled: false, rules: []});
      setAutoTrade(s.autoTrade ?? {});
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="chart-pane">
        <Toggle isFuture={isFuture} setIsFuture={setIsFuture} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
        <Chart selectedToken={selectedToken} />
      </div>
      <div className="right-panel">
        <ToastContainer position="top-right" autoClose={3000} />
        <Balance price={price} setPrice={setPrice} balanceArr={balanceArr} setBalanceArr={setBalanceArr} selectedToken={selectedToken} />
        <Trading
          mode={mode}
          setMode={setMode}
          manualTrade={manualTrade}
          setManualTrade={setManualTrade}
          autoTrade={autoTrade}
          setAutoTrade={setAutoTrade}
          handleSave={handleSave}
        />
      </div>
      <div className="history-wrapper">
        <History histories={histories} setHistories={setHistories} />
      </div>
    </>
  );
}

export default App;
