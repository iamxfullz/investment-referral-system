import Investment from '../models/Investment.js';

// @desc    Create new investment // @access  Private
export const createInvestment = async (req, res) => {
  try {
    const { amount, planDetails } = req.body;
    const userId = req.user._id;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum investment amount is 100'
      });
    }

    const planConfig = {
      'Basic': { duration: 30, roi: 0.5 },
      'Standard': { duration: 60, roi: 0.7 },
      'Premium': { duration: 90, roi: 1.0 },
      'Enterprise': { duration: 180, roi: 1.5 }
    };

    const plan = planConfig[planDetails];
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan. Choose: Basic, Standard, Premium, Enterprise'
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const investment = await Investment.create({
      user: userId,
      amount,
      planDetails,
      startDate,
      endDate,
      dailyROIPercentage: plan.roi
    });

    res.status(201).json({
      success: true,
      data: investment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all investments for logged in user  // @access  Private
export const getUserInvestments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const investments = await Investment.find(filter)
      .sort({ createdAt: -1 });

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

// @desc    Get single investment by ID  // @access  Private
export const getInvestmentById = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: investment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel investment  // @access  Private
export const cancelInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    if (investment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed investment'
      });
    }

    if (investment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Investment already cancelled'
      });
    }

    investment.status = 'Cancelled';
    await investment.save();

    res.status(200).json({
      success: true,
      message: 'Investment cancelled successfully',
      data: investment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get investment statistics  // @access  Private
export const getInvestmentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Investment.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalInvested = await Investment.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats,
        totalInvested: totalInvested[0]?.total || 0
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