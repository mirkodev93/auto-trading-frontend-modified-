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
      <Chart />
      <Balance price={price} setPrice={setPrice} />
      <Rules rules={rules} setRules={setRules} />
      <History />
    </>
  );
}

export default App;
