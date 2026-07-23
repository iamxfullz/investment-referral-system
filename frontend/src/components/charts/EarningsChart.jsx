import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const EarningsChart = ({ roiHistory, referralIncome }) => {
  // Combine and format data for chart
  const getChartData = () => {
    const dataMap = new Map();

    // Add ROI data
    roiHistory?.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString();
      if (!dataMap.has(date)) {
        dataMap.set(date, { date, roi: 0, referral: 0 });
      }
      dataMap.get(date).roi += item.roiAmount;
    });

    // Add referral income data
    referralIncome?.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString();
      if (!dataMap.has(date)) {
        dataMap.set(date, { date, roi: 0, referral: 0 });
      }
      dataMap.get(date).referral += item.incomeAmount;
    });

    return Array.from(dataMap.values()).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  const data = getChartData();

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
        <p className="text-gray-500 text-center py-8">No earnings data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="#3b82f6"
              strokeWidth={2}
              name="ROI Earnings"
            />
            <Line
              type="monotone"
              dataKey="referral"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Referral Income"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;