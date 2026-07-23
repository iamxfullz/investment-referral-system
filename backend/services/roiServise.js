import Investment from '../models/Investment.js';
import User from '../models/User.js';
import ROIHistory from '../models/ROIHistory.js';
import mongoose from 'mongoose';

// Process daily ROI for all active investments
export const processDailyROI = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Starting daily ROI processing...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all active investments
    const investments = await Investment.find({
      status: 'Active',
      endDate: { $gte: today }
    }).session(session);

    console.log(`Found ${investments.length} active investments`);

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const investment of investments) {
      try {
        // Check if ROI already processed today
        const existingROI = await ROIHistory.findOne({
          investment: investment._id,
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }).session(session);

        if (existingROI) {
          skippedCount++;
          continue;
        }

        // Calculate daily ROI
        const roiAmount = (investment.amount * investment.dailyROIPercentage) / 100;

        // Create ROI history
        await ROIHistory.create([{
          user: investment.user,
          investment: investment._id,
          roiAmount: roiAmount,
          date: today,
          status: 'Credited',
          processedAt: new Date()
        }], { session });

        // Update user wallet and total ROI
        await User.findByIdAndUpdate(
          investment.user,
          {
            $inc: {
              walletBalance: roiAmount,
              totalROIEarned: roiAmount
            }
          },
          { session }
        );

        // Update investment total ROI credited
        await Investment.findByIdAndUpdate(
          investment._id,
          {
            $inc: { totalROICredited: roiAmount },
            $set: { lastProcessedDate: new Date() }
          },
          { session }
        );

        processedCount++;
        console.log(`ROI credited for investment ${investment._id}: $${roiAmount}`);

      } catch (error) {
        errorCount++;
        console.error(`Error processing investment ${investment._id}:`, error.message);
        // Continue with next investment
      }
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    console.log('ROI processing completed:');
    console.log(`- Processed: ${processedCount}`);
    console.log(`- Skipped: ${skippedCount}`);
    console.log(`- Errors: ${errorCount}`);

    return {
      success: true,
      processed: processedCount,
      skipped: skippedCount,
      errors: errorCount
    };

  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();
    console.error('ROI processing failed:', error);
    throw error;
  }
};

// Process ROI for a specific investment
export const processInvestmentROI = async (investmentId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const investment = await Investment.findById(investmentId).session(session);
    if (!investment) {
      throw new Error('Investment not found');
    }

    if (investment.status !== 'Active') {
      throw new Error('Investment is not active');
    }

    // Check if already processed today
    const existingROI = await ROIHistory.findOne({
      investment: investment._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).session(session);

    if (existingROI) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: 'ROI already processed for today'
      };
    }

    // Calculate ROI
    const roiAmount = (investment.amount * investment.dailyROIPercentage) / 100;

    // Create ROI history
    await ROIHistory.create([{
      user: investment.user,
      investment: investment._id,
      roiAmount: roiAmount,
      date: today,
      status: 'Credited',
      processedAt: new Date()
    }], { session });

    // Update user
    await User.findByIdAndUpdate(
      investment.user,
      {
        $inc: {
          walletBalance: roiAmount,
          totalROIEarned: roiAmount
        }
      },
      { session }
    );

    // Update investment
    await Investment.findByIdAndUpdate(
      investment._id,
      {
        $inc: { totalROICredited: roiAmount },
        $set: { lastProcessedDate: new Date() }
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      roiAmount: roiAmount,
      investmentId: investment._id
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Check if ROI processed today for investment
export const isROIProcessedToday = async (investmentId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingROI = await ROIHistory.findOne({
    investment: investmentId,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  return !!existingROI;
};

// Get ROI history for user
export const getUserROIHistory = async (userId, limit = 50) => {
  try {
    const history = await ROIHistory.find({ user: userId })
      .populate('investment', 'amount planDetails')
      .sort({ date: -1 })
      .limit(limit);

    return history;
  } catch (error) {
    throw error;
  }
};

// Get total ROI for user
export const getUserTotalROI = async (userId) => {
  try {
    const result = await ROIHistory.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$roiAmount' } } }
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    throw error;
  }
};