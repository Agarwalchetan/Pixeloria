import mongoose from 'mongoose';

const aiConfigSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true
  },
  modelName: {
    type: String,
    required: false
  },
  isEnabled: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
    default: 'inactive'
  },
  lastTested: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Update the updatedAt field before saving
aiConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('AIConfig', aiConfigSchema);
