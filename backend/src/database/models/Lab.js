import mongoose from 'mongoose';

const labSchema = new mongoose.Schema({
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
  category: {
    type: String,
    maxlength: 100
  },
  tags: [{
    type: String
  }],
  demo_url: {
    type: String,
    maxlength: 500
  },
  source_url: {
    type: String,
    maxlength: 500
  },
  image_url: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
}, {
  timestamps: true
});

export default mongoose.model('Lab', labSchema);