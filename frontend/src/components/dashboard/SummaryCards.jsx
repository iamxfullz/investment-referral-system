import React from 'react';
import { TrendingUp, Wallet, Users, DollarSign } from 'lucide-react';

const SummaryCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Investments',
      value: stats.totalInvestments,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Total ROI Earned',
      value: `$${stats.totalROIEarned.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Level Income',
      value: `$${stats.totalLevelIncomeEarned.toFixed(2)}`,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Wallet Balance',
      value: `$${stats.walletBalance.toFixed(2)}`,
      icon: Wallet,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`${card.color} p-3 rounded-full`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;