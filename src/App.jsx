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
  const [selectedToken, setSelectedToken] = useState("sol");

  return (
    <>
      <div className="chart-pane">
        <Toggle />
        <Chart selectedToken={selectedToken} />
      </div>
      <div className="right-panel">
        <Token selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
        <Balance price={price} setPrice={setPrice} balanceArr={balanceArr} setBalanceArr={setBalanceArr} selectedToken={selectedToken} />
        <AutoTrading isAuto={isAuto} setIsAuto={setIsAuto} />
        {
          isAuto ? (<PriceRange />) : (<Rules rules={rules} setRules={setRules} />)
        }
      </div>
      <div className="history-wrapper">
        <History histories={histories} setHistories={setHistories} />
      </div>
    </>
  );
}

export default App;
