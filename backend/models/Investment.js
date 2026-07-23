import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Investment amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  planDetails: {
    type: String,
    required: true,
    enum: ['Basic', 'Standard', 'Premium', 'Enterprise'],
    default: 'Basic'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  dailyROIPercentage: {
    type: Number,
    default: 0.5
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  totalROICredited: {
    type: Number,
    default: 0
  },
  lastProcessedDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
investmentSchema.index({ user: 1, status: 1 });
investmentSchema.index({ status: 1, lastProcessedDate: 1 });
investmentSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model('Investment', investmentSchema);