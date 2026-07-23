import mongoose from 'mongoose';

const roiHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  roiAmount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Credited', 'Failed'],
    default: 'Credited'
  },
  processedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate ROI for same investment on same day
roiHistorySchema.index(
  { investment: 1, date: 1 },
  { unique: true }
);

// Indexes
roiHistorySchema.index({ user: 1, date: -1 });
roiHistorySchema.index({ investment: 1 });
roiHistorySchema.index({ date: 1 });

export default mongoose.model('ROIHistory', roiHistorySchema);