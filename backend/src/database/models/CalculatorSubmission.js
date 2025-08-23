import mongoose from 'mongoose';

const calculatorSubmissionSchema = new mongoose.Schema({
  projectType: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true,
    min: 1
  },
  features: [{
    type: String
  }],
  designComplexity: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  contactInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    company: {
      type: String
    }
  },
  estimate: {
    baseCost: {
      type: Number,
      required: true
    },
    featureCost: {
      type: Number,
      required: true
    },
    designCost: {
      type: Number,
      required: true
    },
    totalCost: {
      type: Number,
      required: true
    },
    timeline: {
      type: String,
      required: true
    },
    breakdown: [{
      label: String,
      cost: Number,
      percentage: Number
    }]
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('CalculatorSubmission', calculatorSubmissionSchema);