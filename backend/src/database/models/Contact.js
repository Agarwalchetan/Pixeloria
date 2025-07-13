import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  company: {
    type: String,
    maxlength: 255
  },
  phone: {
    type: String,
    maxlength: 50
  },
  project_type: {
    type: String,
    maxlength: 100
  },
  budget: {
    type: String,
    maxlength: 100
  },
  message: {
    type: String,
    required: true
  },
  file_url: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['new', 'replied', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});

export default mongoose.model('Contact', contactSchema);