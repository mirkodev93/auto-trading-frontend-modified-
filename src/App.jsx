import React, { useState } from 'react';
import Chart from './components/Chart.jsx';
import Balance from './components/Balance.jsx';
import Rules from './components/Rules.jsx';
import History from './components/History.jsx';
import './App.css';

function App() {
  const [price, setPrice] = useState(0);
  const [rules, setRules] = useState([]);

  return (
    <>
      <div className="chart-pane">
        <Chart className="chart-box" />
        <History />
      </div>
      <div className="right-panel">
        <Balance price={price} setPrice={setPrice} />
        <Rules rules={rules} setRules={setRules} />
      </div>
    </>
  );
}

export default App;
