import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'admin', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ai_model: {
    type: String,
    enum: ['groq', 'openai', 'deepseek', 'gemini'],
    required: function() {
      return this.sender === 'ai';
    }
  },
  message_id: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  }
});

const chatSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true
  },
  user_info: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    country: {
      type: String,
      required: true
    }
  },
  chat_type: {
    type: String,
    enum: ['ai', 'admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'waiting'],
    default: 'active'
  },
  messages: [messageSchema],
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.chat_type === 'admin';
    }
  },
  ai_config: {
    selected_model: {
      type: String,
      enum: ['groq', 'openai', 'deepseek', 'gemini']
    },
    api_keys: {
      groq: String,
      openai: String,
      deepseek: String,
      gemini: String
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_activity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better performance
chatSchema.index({ session_id: 1 });
chatSchema.index({ 'user_info.email': 1 });
chatSchema.index({ chat_type: 1, status: 1 });
chatSchema.index({ admin_id: 1 });

export default mongoose.model('Chat', chatSchema);