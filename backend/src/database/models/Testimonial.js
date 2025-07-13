import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  role: {
    type: String,
    maxlength: 255
  },
  company: {
    type: String,
    maxlength: 255
  },
  industry: {
    type: String,
    maxlength: 100
  },
  image_url: {
    type: String,
    maxlength: 500
  },
  quote: {
    type: String,
    required: true
  },
  full_quote: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  project_type: {
    type: String,
    maxlength: 100
  },
  results: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
}, {
  timestamps: true
});

export default mongoose.model('Testimonial', testimonialSchema);