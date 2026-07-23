import User from '../models/User.js';
import ReferralIncome from '../models/ReferralIncome.js';

// Get direct referrals
export const getDirectReferrals = async (req, res) => {
  try {
    const userId = req.user._id;

    const referrals = await User.find({
      referredBy: userId,
      accountStatus: 'Active'
    }).select('fullName email mobileNumber createdAt referralCode');

    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get complete referral tree (recursive)
export const getReferralTree = async (req, res) => {
  try {
    const userId = req.user._id;

    const buildTree = async (userId, level = 0) => {
      // Get user details
      const user = await User.findById(userId)
        .select('fullName email referralCode createdAt');

      // Get direct referrals
      const referrals = await User.find({
        referredBy: userId,
        accountStatus: 'Active'
      }).select('fullName email referralCode createdAt');

      // Recursively build tree for each referral
      const children = [];
      for (const referral of referrals) {
        const childTree = await buildTree(referral._id, level + 1);
        children.push(childTree);
      }

      return {
        user,
        level,
        referrals: children
      };
    };

    const tree = await buildTree(userId);

    res.status(200).json({
      success: true,
      data: tree
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get referral income summary
export const getReferralIncomeSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total by level
    const levelSummary = await ReferralIncome.aggregate([
      { $match: { beneficiary: userId } },
      {
        $group: {
          _id: '$referralLevel',
          totalAmount: { $sum: '$incomeAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Total overall
    const totalResult = await ReferralIncome.aggregate([
      { $match: { beneficiary: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: '$incomeAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalIncome: totalResult[0]?.total || 0,
        totalTransactions: totalResult[0]?.count || 0,
        byLevel: levelSummary
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

// Get referral tree with depth limit
export const getReferralTreeLimited = async (req, res) => {
  try {
    const userId = req.user._id;
    const maxDepth = parseInt(req.query.depth) || 3;

    const buildTree = async (userId, level = 0) => {
      if (level >= maxDepth) {
        const user = await User.findById(userId)
          .select('fullName email referralCode');
        return {
          user,
          level,
          referrals: [],
          truncated: true
        };
      }

      const user = await User.findById(userId)
        .select('fullName email referralCode createdAt');

      const referrals = await User.find({
        referredBy: userId,
        accountStatus: 'Active'
      }).select('fullName email referralCode createdAt');

      const children = [];
      for (const referral of referrals) {
        const childTree = await buildTree(referral._id, level + 1);
        children.push(childTree);
      }

      return {
        user,
        level,
        referrals: children,
        truncated: false
      };
    };

    const tree = await buildTree(userId);

    res.status(200).json({
      success: true,
      data: tree
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};