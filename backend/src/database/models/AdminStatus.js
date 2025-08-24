import mongoose from 'mongoose';

const adminStatusSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  is_online: {
    type: Boolean,
    default: false
  },
  last_seen: {
    type: Date,
    default: Date.now
  },
  status_message: {
    type: String,
    default: 'Available for chat'
  },
  auto_away_timeout: {
    type: Number,
    default: 300000 // 5 minutes in milliseconds
  }
}, {
  timestamps: true
});

// Update last_seen when status changes
adminStatusSchema.pre('save', function(next) {
  if (this.isModified('is_online')) {
    this.last_seen = new Date();
  }
  next();
});

export default mongoose.model('AdminStatus', adminStatusSchema);