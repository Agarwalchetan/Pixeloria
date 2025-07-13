import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    trim: true
  },
  features: [{
    type: String
  }],
  price_range: {
    type: String,
    maxlength: 100
  },
  duration: {
    type: String,
    maxlength: 100
  },
  category: {
    type: String,
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);