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
  const [mode, setMode] = useState("Auto");
  const [balanceArr, setBalanceArr] = useState([]);
  const [histories, setHistories] = useState([]);
  const [isFuture, setIsFuture] = useState(false);
  const [selectedToken, setSelectedToken] = useState("sol");
  const [manualTrade, setManualTrade] = useState({ isEnabled: false, rules: [], allPreviousRulesSwapped: false });
  const [autoTrade, setAutoTrade] = useState({
    isEnabled: false,
    maCount: 5,
    interval: 1,
    maRamda1: 0,
    maRamda2: 0,
    beforeCount: 2,
    afterCount: 2,
    isSimulation: false,
    startTime: '',
    endTime: '',
    // Up Trend settings
    upTrend: {
      useMAHigh: false,
      maCount: 50,
      continuousUp: {
        count: 3,
        ramda: 0.5
      },
      priceDelta: {
        buy: 10000,
        sell: 0.1
      },
      checkStrong: false
    },
    // Down Trend settings
    downTrend: {
      useMAHigh: false,
      maCount: 50,
      continuousDown: {
        count: 3,
        ramda: 0.5
      },
      priceDelta: {
        buy: -0.1,
        sell: -10000
      },
      checkStrong: false
    },
    // Ambiguous Trend settings
    ambiguousTrend: {
      priceDelta: {
        buy: -0.1,
        sell: 0.1
      }
    }
  });
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [globalTrend, setGlobalTrend] = useState('');
  const [technicalIndicators, setTechnicalIndicators] = useState({
    RSI: 0,
    MA50: 0,
    MA200: 0,
    MA5: 0,
    slopeMA5: 0,
    currentPrice: 0
  });

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

        if (msg.type === "global_trend") {
          setGlobalTrend(msg.data.trend);
          if (msg.data.technicalIndicators) {
            setTechnicalIndicators(msg.data.technicalIndicators);
          }
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
      setManualTrade(s.manualTrade ?? { isEnabled: false, rules: [], allPreviousRulesSwapped: false });
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
        <Balance histories={histories} autoTrade={autoTrade} price={price} balanceArr={balanceArr} setBalanceArr={setBalanceArr} selectedToken={selectedToken} />
        <Trading
          mode={mode}
          setMode={setMode}
          manualTrade={manualTrade}
          setManualTrade={setManualTrade}
          autoTrade={autoTrade}
          setAutoTrade={setAutoTrade}
          handleSave={handleSave}
          simulationProgress={simulationProgress}
          globalTrend={globalTrend}
          technicalIndicators={technicalIndicators}
          price={price}
          balanceArr={balanceArr}
        />
      </div>
      <div className="history-wrapper">
        <History histories={histories} setHistories={setHistories} />
      </div>
    </>
  );
}

export default App;
