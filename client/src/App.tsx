import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChart from './components/BarChart';
import './App.css';

const App: React.FC = () => {
  const [month, setMonth] = useState<string>('03');

  return (
    <div className="App">
      <h1>Transactions Dashboard</h1>
      <div className="controls">
        <label>
          Select Month:
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
              <option key={m} value={m}>{new Date(2023, parseInt(m) - 1, 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
        </label>
      </div>
      <TransactionsTable />
      <StatisticsBox month={month} />
      <BarChart month={month} />
    </div>
  );
};

export default App;
