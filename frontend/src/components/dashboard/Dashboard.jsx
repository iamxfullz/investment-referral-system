import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import SummaryCards from './SummaryCards';
import InvestmentTable from './InvestmentTable';
import ROIHistoryTable from './ROIHistoryTable';
import ReferralIncomeTable from './ReferralIncomeTable';
import EarningsChart from '../charts/EarningsChart';
import ReferralShare from './ReferralShare';
import InvestmentPlans from './InvestmentPlans'; // ← ADD THIS
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    investments: [],
    roiHistory: [],
    referralIncome: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, investmentsRes, roiRes, referralRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/investment-history'),
        api.get('/dashboard/roi-history'),
        api.get('/dashboard/referral-history'),
      ]);

      setDashboardData({
        stats: statsRes.data.data,
        investments: investmentsRes.data.data || [],
        roiHistory: roiRes.data.data || [],
        referralIncome: referralRes.data.data || [],
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Referral Share Section */}
      <ReferralShare />
      
      {/* Investment Plans Section */}
      <InvestmentPlans /> {/* ← ADD THIS */}
      
      {/* Summary Cards */}
      <SummaryCards stats={dashboardData.stats} />
      
      {/* Earnings Chart */}
      <div className="mt-8">
        <EarningsChart 
          roiHistory={dashboardData.roiHistory} 
          referralIncome={dashboardData.referralIncome} 
        />
      </div>

      {/* Investment History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment History</h2>
        <InvestmentTable investments={dashboardData.investments} />
      </div>

      {/* ROI History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">ROI History</h2>
        <ROIHistoryTable history={dashboardData.roiHistory} />
      </div>

      {/* Referral Income History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Referral Income History</h2>
        <ReferralIncomeTable history={dashboardData.referralIncome} />
      </div>
    </div>
  );
};

export default Dashboard;