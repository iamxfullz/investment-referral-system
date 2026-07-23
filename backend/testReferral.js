import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { processReferralIncome } from './services/referralService.js';
import Investment from './models/Investment.js';

dotenv.config();

const testReferral = async () => {
  try {
    await connectDB();
    
    // Find an investment from User C (or latest investment)
    const investment = await Investment.findOne().sort({ createdAt: -1 });
    if (!investment) {
      console.log('No investment found. Create one first.');
      return;
    }

    console.log(`Testing referral income for investment: ${investment._id}`);
    const result = await processReferralIncome(investment._id);
    console.log('Result:', result);
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

testReferral();