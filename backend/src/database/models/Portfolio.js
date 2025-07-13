import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
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
  images: [{
    type: String
  }],
  category: {
    type: String,
    maxlength: 100
  },
  tags: [{
    type: String
  }],
  tech_stack: [{
    type: String
  }],
  results: [{
    type: String
  }],
  link: {
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

export default mongoose.model('Portfolio', portfolioSchema);