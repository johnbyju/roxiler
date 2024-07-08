import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HostConnection from '../HostConnection';

interface Statistics {
  totalSaleAmount: number;
  totalSoldItems: number;
  totalNotSoldItems: number;
}

const StatisticsBox: React.FC<{ month: string }> = ({ month }) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      const { data } = await axios.get('http://localhost:5000/roxiler/statistics', { params: { month } });
      setStatistics(data);
    };

    fetchStatistics();
  }, [month]);

  return (
    <div>
      <h2>Statistics</h2>
      {statistics ? (
        <div>
          <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
          <p>Total Sold Items: {statistics.totalSoldItems}</p>
          <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StatisticsBox;
