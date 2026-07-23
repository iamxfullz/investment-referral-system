import User from '../models/User.js';
import Investment from '../models/Investment.js';
import ROIHistory from '../models/ROIHistory.js';
import ReferralIncome from '../models/ReferralIncome.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user basic info
    const user = await User.findById(userId);

    // Get investment stats
    const investmentStats = await Investment.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalInvestments = investmentStats.reduce((sum, stat) => sum + stat.count, 0);
    const totalInvested = investmentStats.reduce((sum, stat) => sum + stat.totalAmount, 0);

    // Get ROI stats
    const roiStats = await ROIHistory.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalROI: { $sum: '$roiAmount' }
        }
      }
    ]);

    const totalROI = roiStats[0]?.totalROI || 0;

    // Get referral income stats
    const referralStats = await ReferralIncome.aggregate([
      { $match: { beneficiary: userId } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$incomeAmount' }
        }
      }
    ]);

    const totalLevelIncome = referralStats[0]?.totalIncome || 0;

    // Format investment stats by status
    const statusStats = {};
    investmentStats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalInvestments,
        totalInvested,
        totalROIEarned: totalROI,
        totalLevelIncomeEarned: totalLevelIncome,
        walletBalance: user.walletBalance,
        investmentStats: {
          Active: statusStats.Active || 0,
          Completed: statusStats.Completed || 0,
          Cancelled: statusStats.Cancelled || 0
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get ROI history for dashboard
export const getROIHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50 } = req.query;

    const history = await ROIHistory.find({ user: userId })
      .populate('investment', 'amount planDetails')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get referral income history for dashboard
export const getReferralIncomeHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50 } = req.query;

    const history = await ReferralIncome.find({ beneficiary: userId })
      .populate('source', 'fullName email')
      .populate('investment', 'amount planDetails')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get investment history for dashboard
export const getInvestmentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, limit = 50 } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const investments = await Investment.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: investments.length,
      data: investments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};