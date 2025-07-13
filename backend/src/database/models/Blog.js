import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  excerpt: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    maxlength: 500
  },
  author: {
    type: String,
    maxlength: 255
  },
  category: {
    type: String,
    maxlength: 100
  },
  tags: [{
    type: String
  }],
  read_time: {
    type: Number,
    min: 1
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
}, {
  timestamps: true
});

export default mongoose.model('Blog', blogSchema);