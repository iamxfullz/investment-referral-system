import express from 'express';
import {
  getDashboardStats,
  getROIHistory,
  getReferralIncomeHistory,
  getInvestmentHistory
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getDashboardStats);
router.get('/roi-history', getROIHistory);
router.get('/referral-history', getReferralIncomeHistory);
router.get('/investment-history', getInvestmentHistory);

export default router;