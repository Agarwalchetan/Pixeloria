import mongoose from 'mongoose';

const aboutSettingsSchema = new mongoose.Schema({
  // About Page Numbers
  about_numbers: {
    projects_completed: {
      type: String,
      default: "50+"
    },
    client_satisfaction: {
      type: String,
      default: "100%"
    },
    support_availability: {
      type: String,
      default: "24/7"
    },
    team_members: {
      type: String,
      default: "10+"
    }
  },
  
  // Team Members
  team_members: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true
    },
    fun_fact: {
      type: String
    },
    skills: [{
      type: String
    }],
    social: {
      github: String,
      linkedin: String,
      twitter: String
    },
    order: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  }],
  
  // Journey Milestones
  journey_milestones: [{
    year: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'Rocket'
    },
    order: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
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

export default mongoose.model('AboutSettings', aboutSettingsSchema);