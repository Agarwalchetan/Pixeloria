import mongoose from 'mongoose';

const homeSettingsSchema = new mongoose.Schema({
  // Pixeloria Edge Numbers
  edge_numbers: {
    projects_delivered: {
      type: mongoose.Schema.Types.Mixed,
      default: 50
    },
    client_satisfaction: {
      type: mongoose.Schema.Types.Mixed,
      default: 100
    },
    users_reached: {
      type: String,
      default: "1M+"
    },
    support_hours: {
      type: String,
      default: "24/7"
    }
  },
  
  // Featured Case Studies (references to Portfolio)
  featured_case_studies: [{
    portfolio_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio'
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  
  // Meta settings
  last_updated: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model('HomeSettings', homeSettingsSchema);