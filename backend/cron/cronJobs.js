import cron from 'node-cron';
import { processDailyROI } from '../services/roiService.js';

// Schedule ROI processing every day at 12:00 AM
export const startCronJobs = () => {
  console.log('🕐 Starting cron job scheduler...');
  
  // Run at 12:00 AM every day
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running daily ROI processing at:', new Date().toISOString());
    
    try {
      const result = await processDailyROI();
      console.log('✅ Daily ROI processing completed:', result);
      
      // Optional: Send notification or log to file
      if (result.errors > 0) {
        console.warn(`⚠️ ${result.errors} investments failed to process`);
      }
      
    } catch (error) {
      console.error('❌ Daily ROI processing failed:', error.message);
      // Optional: Send alert email or notification
    }
  });
  
  // Run at 12:00 PM (noon) for testing/backup
  // Uncomment if you want a second run
  // cron.schedule('0 12 * * *', async () => {
  //   console.log('⏰ Running noon ROI processing (backup)...');
  //   try {
  //     const result = await processDailyROI();
  //     console.log('✅ Noon ROI processing completed:', result);
  //   } catch (error) {
  //     console.error('❌ Noon ROI processing failed:', error.message);
  //   }
  // });
  
  console.log('✅ Cron jobs started successfully');
  console.log('📅 Daily ROI processing scheduled for 12:00 AM');
};

// Optional: Run once immediately on startup
export const runOnceOnStartup = async () => {
  console.log('🚀 Running ROI processing on startup...');
  try {
    const result = await processDailyROI();
    console.log('✅ Startup ROI processing completed:', result);
  } catch (error) {
    console.error('❌ Startup ROI processing failed:', error.message);
  }
};

// Manual trigger function for testing
export const triggerManualROI = async () => {
  console.log('🔧 Manual ROI processing triggered');
  try {
    const result = await processDailyROI();
    console.log('✅ Manual ROI processing completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Manual ROI processing failed:', error.message);
    throw error;
  }
};