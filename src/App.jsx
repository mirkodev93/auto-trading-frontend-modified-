import React, { useState, useEffect } from 'react';
import Chart from './components/Chart.jsx';
import Balance from './components/Balance.jsx';
import Rules from './components/Rules.jsx';
import History from './components/History.jsx';
import './App.css';
import { getBalances, getHistories, postHistory } from "./lib/api.js";

function App() {
  const [price, setPrice] = useState(0);
  const [rules, setRules] = useState([]);
  const [prevPrice, setPrevPrice] = useState(0);
  const [histories, setHistories] = useState([]);
  const [balanceArr, setBalanceArr] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevPrice(price);
    }, 100);

    return () => clearTimeout(timer);
  }, [price]);

  useEffect(() => {
    if (prevPrice == 0)
      return;
    for (const r of rules) {
      const sp = parseFloat(r.setpoint);
      if ((prevPrice > sp && price <= sp && price !== prevPrice) || (prevPrice < sp && price >= sp && price !== prevPrice)) {
        (async () => {
          try {
            await postHistory({
              side: r.side,
              cur_price: price,
              percentage: r.percentage,
            });

            const res = await getBalances();
            setBalanceArr(res);

            const data = await getHistories();
            setHistories(data);
          } catch (error) {
            console.error("Error posting history:", error);
          }
        })();
      }
    }
  }, [price]);

  return (
    <>
      <div className="chart-pane">
        <Chart className="chart-box" />
        <History histories={histories} setHistories={setHistories} />
      </div>
      <div className="right-panel">
        <Balance price={price} setPrice={setPrice} balanceArr={balanceArr} setBalanceArr={setBalanceArr} />
        <Rules rules={rules} setRules={setRules} />
      </div>
    </>
  );
}

export default App;
