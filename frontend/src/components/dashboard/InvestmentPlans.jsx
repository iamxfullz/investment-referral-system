import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { 
  TrendingUp, 
  Crown, 
  Star, 
  Rocket, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const InvestmentPlans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');

  const plans = [
    {
      name: 'Basic',
      roi: '0.5%',
      duration: '30 Days',
      minAmount: 100,
      color: 'blue',
      icon: <TrendingUp className="w-6 h-6" />,
      features: ['Daily Returns', '30 Day Term', 'Withdraw Anytime']
    },
    {
      name: 'Standard',
      roi: '0.7%',
      duration: '60 Days',
      minAmount: 500,
      color: 'purple',
      icon: <Star className="w-6 h-6" />,
      features: ['Daily Returns', '60 Day Term', 'Priority Support', 'Higher Returns'],
      popular: true
    },
    {
      name: 'Premium',
      roi: '1.0%',
      duration: '90 Days',
      minAmount: 1000,
      color: 'indigo',
      icon: <Crown className="w-6 h-6" />,
      features: ['Daily Returns', '90 Day Term', 'VIP Support', 'Max Returns']
    },
    {
      name: 'Enterprise',
      roi: '1.5%',
      duration: '180 Days',
      minAmount: 5000,
      color: 'green',
      icon: <Rocket className="w-6 h-6" />,
      features: ['Daily Returns', '180 Day Term', 'Dedicated Manager', 'Premium Benefits']
    }
  ];

  const handleInvest = (plan) => {
    setSelectedPlan(plan);
    setAmount(plan.minAmount);
    setShowModal(true);
  };

  const handleCreateInvestment = async () => {
    if (!amount || amount < selectedPlan.minAmount) {
      toast.error(`Minimum investment is $${selectedPlan.minAmount}`);
      return;
    }

    setLoading(selectedPlan.name);
    try {
      const response = await api.post('/investments', {
        amount: parseFloat(amount),
        planDetails: selectedPlan.name
      });

      toast.success(`Investment of $${amount} in ${selectedPlan.name} plan created!`);
      setShowModal(false);
      setAmount('');
      setSelectedPlan(null);
      
      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create investment');
    } finally {
      setLoading(null);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hover: 'hover:border-blue-400',
        text: 'text-blue-600',
        btn: 'bg-blue-600 hover:bg-blue-700',
        light: 'bg-blue-100'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hover: 'hover:border-purple-400',
        text: 'text-purple-600',
        btn: 'bg-purple-600 hover:bg-purple-700',
        light: 'bg-purple-100'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        hover: 'hover:border-indigo-400',
        text: 'text-indigo-600',
        btn: 'bg-indigo-600 hover:bg-indigo-700',
        light: 'bg-indigo-100'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        hover: 'hover:border-green-400',
        text: 'text-green-600',
        btn: 'bg-green-600 hover:bg-green-700',
        light: 'bg-green-100'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Investment Plans</h2>
            <p className="text-gray-600">Choose a plan and start earning daily returns</p>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const colors = getColorClasses(plan.color);
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl border-2 ${colors.border} ${colors.hover} p-6 transition-all hover:shadow-xl hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                
                <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center mb-4 ${colors.text}`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{plan.duration}</p>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.roi}</span>
                  <span className="text-sm text-gray-500 ml-1">daily ROI</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="text-sm text-gray-500 mb-4">
                  Min. Investment: ${plan.minAmount}
                </div>
                
                <button
                  onClick={() => handleInvest(plan)}
                  className={`w-full py-2.5 ${colors.btn} text-white rounded-lg transition-all flex items-center justify-center gap-2`}
                >
                  Invest Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investment Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Invest in {selectedPlan.name} Plan
                </h3>
                <p className="text-sm text-gray-500">
                  Daily ROI: {selectedPlan.roi} • Duration: {selectedPlan.duration}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPlan(null);
                  setAmount('');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount (Min: ${selectedPlan.minAmount})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={selectedPlan.minAmount}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {[selectedPlan.minAmount, selectedPlan.minAmount * 2, selectedPlan.minAmount * 3].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Daily Earnings:</span>{' '}
                ${((parseFloat(amount) || 0) * parseFloat(selectedPlan.roi) / 100).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Total Return:</span>{' '}
                ${((parseFloat(amount) || 0) * parseFloat(selectedPlan.roi) / 100 * 
                  parseInt(selectedPlan.duration)).toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleCreateInvestment}
              disabled={loading === selectedPlan.name}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading === selectedPlan.name ? 'Processing...' : 'Confirm Investment'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentPlans;