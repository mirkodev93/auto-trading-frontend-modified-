import React, { useState, useEffect } from "react";
import Toggle from "./components/Toggle.jsx";
import Token from "./components/Token.jsx";
import Balance from "./components/Balance.jsx";
import TradeModeTabs from "./components/TradeModeTabs.jsx";
import Chart from "./components/Chart.jsx";
import History from "./components/History.jsx";
import "./App.css";

function App() {
  const [price, setPrice] = useState(0);
  const [rules, setRules] = useState([]);
  const [balanceArr, setBalanceArr] = useState([]);
  const [mode, setMode] = useState("Manual");
  const [histories, setHistories] = useState([]);
  const [isFuture, setIsFuture] = useState(false);
  const [selectedToken, setSelectedToken] = useState("sol");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [time, setTime] = useState(0);

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
      mode: String(mode),
      rules: (Array.isArray(rules) ? rules : []),
      minPrice: (Number(minPrice) || 0),
      maxPrice: (Number(maxPrice) || 0),
      time: (Number(time) || 0),
    };
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
      setMode(s.mode === "Auto" ? "Auto" : "Manual");
      setRules(Array.isArray(s.rules) ? s.rules : []);
      setMinPrice(Number(s.minPrice) || 0);
      setMaxPrice(Number(s.maxPrice) || 0);
      setTime(Number(s.time) || 0);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="chart-pane">
        <Toggle isFuture={isFuture} setIsFuture={setIsFuture} />
        <Chart selectedToken={selectedToken} />
      </div>
      <div className="right-panel">
        <Token selectedToken={selectedToken} setSelectedToken={setSelectedToken} onSave={handleSave} />
        <Balance price={price} setPrice={setPrice} balanceArr={balanceArr} setBalanceArr={setBalanceArr} selectedToken={selectedToken} />
        <TradeModeTabs
          mode={mode}
          onModeChange={setMode}
          rules={rules}
          setRules={setRules}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          time={time}
          setTime={setTime}
        />
      </div>
      <div className="history-wrapper">
        <History histories={histories} setHistories={setHistories} />
      </div>
    </>
  );
}

export default App;
