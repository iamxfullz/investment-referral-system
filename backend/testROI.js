import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { processDailyROI } from './services/roiService.js';

dotenv.config();

const testROI = async () => {
  try {
    await connectDB();
    console.log('Testing ROI processing...');
    
    // First run
    console.log('\n--- First Run ---');
    const result1 = await processDailyROI();
    console.log('Result:', result1);
    
    // Second run (should skip)
    console.log('\n--- Second Run (should skip) ---');
    const result2 = await processDailyROI();
    console.log('Result:', result2);
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

testROI();