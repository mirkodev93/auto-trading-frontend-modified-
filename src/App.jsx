import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Toggle from "./components/Toggle.jsx";
import Balance from "./components/Balance.jsx";
import Trading from "./components/Trading.jsx";
import Chart from "./components/Chart.jsx";
import History from "./components/History.jsx";
import { sendConfig, getSettings } from "./lib/api.js";
import "./App.css";

function App() {
  const [price, setPrice] = useState(0);
  const [mode, setMode] = useState("Trading");
  const [balanceArr, setBalanceArr] = useState([]);
  const [histories, setHistories] = useState([]);
  const [isFuture, setIsFuture] = useState(false);
  const [selectedToken, setSelectedToken] = useState("sol");
  const [manualTrade, setManualTrade] = useState({ isEnabled: false, rules: [] });
  const [autoTrade, setAutoTrade] = useState({ isEnabled: false, maCount: 5, interval: 1, maRamda: 0, priceDeltaBuy: 0.5, priceDeltaSell: 0.5 });
  const [simulationProgress, setSimulationProgress] = useState(0);

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
          setManualTrade((prev) => ({ ...prev, rules: msg.data.rules }));
        }

        if (msg.type === "simulation_progress") {
          setSimulationProgress(msg.data.progress);
        }

        if (msg.type === "simulation_completed") {
          setAutoTrade(msg.data.autoTrade);
          setSimulationProgress(0); // Reset progress when simulation completes

          // Show success notification
          toast.success("Simulation completed successfully! AutoTrade has been disabled.", {
            autoClose: 5000,
            position: "top-right"
          });
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onclose = () => console.log("WS disconnected");
    ws.onerror = (err) => console.error("WS error:", err);

    return () => ws.close();
  }, []);

  const handleSave = async () => {
    const settingsObj = {
      future: !!isFuture,
      token: String(selectedToken ?? "sol"),
      manualTrade: manualTrade,
      autoTrade: autoTrade,
    };
    const payload = { settings: JSON.stringify(settingsObj) };
    try {
      await sendConfig(payload);
      console.log("Saved");
    } catch (e) {
      console.error(e);
    }
  };

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
      setManualTrade(s.manualTrade ?? { isEnabled: false, rules: [] });
      setAutoTrade(s.autoTrade ?? {});
    };
    fetchData();
  }, []);

  // Reset simulation progress when auto trading is disabled or simulation is disabled
  useEffect(() => {
    if (!autoTrade.isEnabled || !autoTrade.isSimulation) {
      setSimulationProgress(0);
    }
  }, [autoTrade.isEnabled, autoTrade.isSimulation]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="chart-pane">
        <Toggle isFuture={isFuture} setIsFuture={setIsFuture} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
        <Chart selectedToken={selectedToken} maCount={autoTrade.maCount} interval={autoTrade.interval} />
      </div>
      <div className="right-panel">
        <Balance price={price} setPrice={setPrice} balanceArr={balanceArr} setBalanceArr={setBalanceArr} selectedToken={selectedToken} />
        <Trading
          mode={mode}
          setMode={setMode}
          manualTrade={manualTrade}
          setManualTrade={setManualTrade}
          autoTrade={autoTrade}
          setAutoTrade={setAutoTrade}
          handleSave={handleSave}
          simulationProgress={simulationProgress}
        />
      </div>
      <div className="history-wrapper">
        <History histories={histories} setHistories={setHistories} />
      </div>
    </>
  );
}

export default App;
