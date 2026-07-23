import mongoose from 'mongoose';

const referralIncomeSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  referralLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  incomeAmount: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Credited', 'Failed'],
    default: 'Credited'
  }
}, {
  timestamps: true
});

// Prevent duplicate entries
referralIncomeSchema.index(
  { investment: 1, beneficiary: 1, referralLevel: 1 },
  { unique: true }
);

// Indexes
referralIncomeSchema.index({ beneficiary: 1, date: -1 });
referralIncomeSchema.index({ source: 1 });
referralIncomeSchema.index({ investment: 1 });

export default mongoose.model('ReferralIncome', referralIncomeSchema);