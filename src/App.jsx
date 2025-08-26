import React, { useState, useEffect } from "react";
import Toggle from "./components/Toggle.jsx";
import Token from "./components/Token.jsx";
import Balance from "./components/Balance.jsx";
import Rules from "./components/Rules.jsx";
import Chart from "./components/Chart.jsx";
import AutoTrading from "./components/AutoTrading.jsx";
import History from "./components/History.jsx";
import PriceRange from "./components/PriceRange.jsx";
import "./App.css";

function App() {
  const [price, setPrice] = useState(0);
  const [rules, setRules] = useState([]);
  const [balanceArr, setBalanceArr] = useState([]);
  const [isAuto, setIsAuto] = useState(false);
  const [histories, setHistories] = useState([]);
  const [isFuture, setIsFuture] = useState(false);
  const [selectedToken, setSelectedToken] = useState("sol");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000"); // change port if needed

    ws.onopen = () => {
      console.log("Connected to backend WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("WS message:", msg);

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

  async function sendConfig(signal) {
    const payload = {
      future: isFuture,
      token: selectedToken,
      autoTrading: isAuto,
      settings: {
        rules,
        minPrice,
        maxPrice,
        time
      }
    };

    const res = await fetch("/api/trading/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Save failed: ${res.status} ${text}`);
    }
  }

  const handleSave = async () => {
    try {
      await sendConfig();
      console.log("Saved");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="chart-pane">
        <Toggle isFuture={isFuture} setIsFuture={setIsFuture} />
        <Chart selectedToken={selectedToken} />
      </div>
      <div className="right-panel">
        <Token selectedToken={selectedToken} setSelectedToken={setSelectedToken} onSave={handleSave} />
        <Balance price={price} setPrice={setPrice} balanceArr={balanceArr} setBalanceArr={setBalanceArr} selectedToken={selectedToken} />
        <AutoTrading isAuto={isAuto} setIsAuto={setIsAuto} />
        {
          isAuto ? (<PriceRange minPrice={minPrice} setMinPrice={setMinPrice} maxPrice={maxPrice} setMaxPrice={setMaxPrice} time={time} setTime={setTime} />) : (<Rules rules={rules} setRules={setRules} />)
        }
      </div>
      <div className="history-wrapper">
        <History histories={histories} setHistories={setHistories} />
      </div>
    </>
  );
}

export default App;
