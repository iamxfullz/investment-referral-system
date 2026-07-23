import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import { processDailyROI } from './services/roiService.js';
import { startCronJobs, triggerManualROI } from './cron/cronJobs.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referrals', referralRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Test route for ROI processing
app.post('/api/test/process-roi', async (req, res) => {
  try {
    const result = await processDailyROI();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Manual trigger route for cron testing
app.post('/api/test/trigger-cron', async (req, res) => {
  try {
    const result = await triggerManualROI();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

// Start server and cron jobs
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Start cron jobs
  if (process.env.NODE_ENV !== 'test') {
    startCronJobs();
    
    // Optional: Run once on startup
    // Uncomment if you want to process ROI immediately when server starts
    // runOnceOnStartup();
  }
});