import express from 'express';
import {
  createInvestment,
  getUserInvestments,
  getInvestmentById,
  cancelInvestment,
  getInvestmentStats
} from '../controllers/investmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createInvestment);
router.get('/', getUserInvestments);
router.get('/stats', getInvestmentStats);
router.get('/:id', getInvestmentById);
router.put('/:id/cancel', cancelInvestment);

export default router;