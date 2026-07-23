import express from 'express';
import {
  getDirectReferrals,
  getReferralTree,
  getReferralIncomeSummary,
  getReferralTreeLimited
} from '../controllers/referralController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/direct', getDirectReferrals);
router.get('/tree', getReferralTree);
router.get('/tree-limited', getReferralTreeLimited);
router.get('/income-summary', getReferralIncomeSummary);

export default router;