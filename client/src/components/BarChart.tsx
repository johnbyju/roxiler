import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import HostConnection from '../HostConnection';

interface BarChartData {
  range: string;
  count: number;
}

const BarChart: React.FC<{ month: string }> = ({ month }) => {
  const [chartData, setChartData] = useState<BarChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const { data } = await axios.get('http://localhost:5000/roxiler/chartdata', { params: { month } });
      setChartData(data);
    };

    fetchChartData();
  }, [month]);

  return (
    <div>
      <h2>Price Range Chart</h2>
      <Bar
        data={{
          labels: chartData.map((data) => data.range),
          datasets: [
            {
              label: 'Number of Items',
              data: chartData.map((data) => data.count),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        }}
      />
    </div>
  );
};

export default BarChart;
