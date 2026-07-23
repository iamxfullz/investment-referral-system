import User from '../models/User.js';
import Investment from '../models/Investment.js';
import ReferralIncome from '../models/ReferralIncome.js';
import mongoose from 'mongoose';

// Process referral income for an investment
export const processReferralIncome = async (investmentId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const investment = await Investment.findById(investmentId).session(session);
    if (!investment) {
      throw new Error('Investment not found');
    }

    // Check if referral income already processed
    const existingIncome = await ReferralIncome.findOne({
      investment: investmentId
    }).session(session);

    if (existingIncome) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: 'Referral income already processed for this investment'
      };
    }

    const investor = await User.findById(investment.user).session(session);
    if (!investor) {
      throw new Error('Investor not found');
    }

    // Get referral levels configuration
    const level1Percent = parseFloat(process.env.REFERRAL_LEVEL_1_PERCENT) || 5;
    const level2Percent = parseFloat(process.env.REFERRAL_LEVEL_2_PERCENT) || 3;
    const level3Percent = parseFloat(process.env.REFERRAL_LEVEL_3_PERCENT) || 1;

    const levels = [
      { level: 1, percentage: level1Percent },
      { level: 2, percentage: level2Percent },
      { level: 3, percentage: level3Percent }
    ];

    let creditedCount = 0;
    let currentUser = investor;

    for (const levelConfig of levels) {
      // Get referrer
      const referrer = await User.findById(currentUser.referredBy).session(session);
      if (!referrer) break;

      // Calculate commission
      const commission = (investment.amount * levelConfig.percentage) / 100;

      // Create referral income record
      await ReferralIncome.create([{
        beneficiary: referrer._id,
        source: investor._id,
        investment: investment._id,
        referralLevel: levelConfig.level,
        incomeAmount: commission,
        percentage: levelConfig.percentage,
        date: new Date(),
        status: 'Credited'
      }], { session });

      // Update referrer's wallet and total level income
      await User.findByIdAndUpdate(
        referrer._id,
        {
          $inc: {
            walletBalance: commission,
            totalLevelIncomeEarned: commission
          }
        },
        { session }
      );

      creditedCount++;
      currentUser = referrer;
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      creditedCount,
      investmentId: investment._id
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get referral income for a user
export const getUserReferralIncome = async (userId, limit = 50) => {
  try {
    const income = await ReferralIncome.find({ beneficiary: userId })
      .populate('source', 'fullName email')
      .populate('investment', 'amount planDetails')
      .sort({ date: -1 })
      .limit(limit);

    return income;
  } catch (error) {
    throw error;
  }
};

// Get total referral income for a user
export const getUserTotalReferralIncome = async (userId) => {
  try {
    const result = await ReferralIncome.aggregate([
      { $match: { beneficiary: userId } },
      { $group: { _id: null, total: { $sum: '$incomeAmount' } } }
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    throw error;
  }
};

// Get referral income by level
export const getReferralIncomeByLevel = async (userId, level) => {
  try {
    const income = await ReferralIncome.find({
      beneficiary: userId,
      referralLevel: level
    }).populate('source', 'fullName email');

    return income;
  } catch (error) {
    throw error;
  }
};