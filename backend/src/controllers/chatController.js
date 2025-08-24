import Chat from '../database/models/Chat.js';
import AdminStatus from '../database/models/AdminStatus.js';
import User from '../database/models/User.js';
import { logger } from '../utils/logger.js';
import { sendEmail } from '../utils/email.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import axios from 'axios';

// AI Model Configurations
const AI_MODELS = {
  groq: {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'mixtral-8x7b-32768',
    description: 'Fast inference with Mixtral model'
  },
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    description: 'ChatGPT 3.5 Turbo model'
  },
  deepseek: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    description: 'DeepSeek Chat model'
  },
  gemini: {
    name: 'Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro',
    description: 'Google Gemini Pro model'
  }
};

// Initialize chat session
export const initializeChat = async (req, res, next) => {
  try {
    const { user_info, chat_type, ai_config } = req.body;

    // Validate user info
    if (!user_info || !user_info.name || !user_info.email || !user_info.country) {
      return res.status(400).json({
        success: false,
        message: 'User information (name, email, country) is required'
      });
    }

    // Generate unique session ID
    const session_id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check if admin is available for live chat
    let admin_available = false;
    let assigned_admin = null;

    if (chat_type === 'admin') {
      const onlineAdmin = await AdminStatus.findOne({ 
        is_online: true,
        last_seen: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Active in last 5 minutes
      }).populate('admin_id');

      if (onlineAdmin) {
        admin_available = true;
        assigned_admin = onlineAdmin.admin_id._id;
      }
    }

    // Create chat session
    const chat = new Chat({
      session_id,
      user_info,
      chat_type: admin_available ? 'admin' : chat_type,
      status: admin_available ? 'active' : 'waiting',
      admin_id: assigned_admin,
      ai_config: chat_type === 'ai' ? ai_config : undefined
    });

    await chat.save();

    // Send notification to admin if live chat requested
    if (chat_type === 'admin' && admin_available) {
      // Emit socket event to admin (will be implemented with WebSocket)
      logger.info(`New live chat request from ${user_info.name} assigned to admin ${assigned_admin}`);
    }

    res.status(201).json({
      success: true,
      data: {
        session_id,
        chat_type: chat.chat_type,
        admin_available,
        assigned_admin,
        ai_models: Object.keys(AI_MODELS).map(key => ({
          id: key,
          name: AI_MODELS[key].name,
          description: AI_MODELS[key].description
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Send message
export const sendMessage = async (req, res, next) => {
  try {
    const { session_id, content, sender, ai_model } = req.body;

    if (!session_id || !content || !sender) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, content, and sender are required'
      });
    }

    // Find chat session
    const chat = await Chat.findOne({ session_id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Create message
    const message = {
      sender,
      content,
      timestamp: new Date(),
      ai_model: sender === 'ai' ? ai_model : undefined,
      status: 'sent'
    };

    // Add message to chat
    chat.messages.push(message);
    chat.last_activity = new Date();
    await chat.save();

    // Handle AI response
    if (sender === 'user' && chat.chat_type === 'ai') {
      try {
        const aiResponse = await generateAIResponse(content, ai_model || chat.ai_config.selected_model, chat.ai_config.api_keys);
        
        const aiMessage = {
          sender: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          ai_model: ai_model || chat.ai_config.selected_model,
          status: 'sent'
        };

        chat.messages.push(aiMessage);
        await chat.save();

        return res.json({
          success: true,
          data: {
            user_message: message,
            ai_response: aiMessage
          }
        });
      } catch (aiError) {
        logger.error('AI response error:', aiError);
        
        const errorMessage = {
          sender: 'ai',
          content: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our support team.',
          timestamp: new Date(),
          ai_model: ai_model || chat.ai_config.selected_model,
          status: 'sent'
        };

        chat.messages.push(errorMessage);
        await chat.save();

        return res.json({
          success: true,
          data: {
            user_message: message,
            ai_response: errorMessage
          }
        });
      }
    }

    // Handle admin chat notification
    if (sender === 'user' && chat.chat_type === 'admin') {
      // Emit socket event to admin (WebSocket implementation)
      logger.info(`New message in admin chat ${session_id} from ${chat.user_info.name}`);
    }

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    next(error);
  }
};

// Generate AI response
const generateAIResponse = async (userMessage, model, apiKeys) => {
  const modelConfig = AI_MODELS[model];
  if (!modelConfig) {
    throw new Error('Invalid AI model selected');
  }

  const apiKey = apiKeys[model];
  if (!apiKey) {
    throw new Error(`API key not provided for ${model}`);
  }

  try {
    let response;

    if (model === 'gemini') {
      // Gemini has different API structure
      response = await axios.post(
        `${modelConfig.endpoint}?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: userMessage }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.candidates[0].content.parts[0].text;
    } else {
      // OpenAI-compatible API (Groq, OpenAI, DeepSeek)
      response = await axios.post(
        modelConfig.endpoint,
        {
          model: modelConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for Pixeloria, a web development agency. Help users with their web development questions and guide them toward our services when appropriate.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    }
  } catch (error) {
    logger.error(`AI API error for ${model}:`, error.response?.data || error.message);
    throw new Error(`Failed to get response from ${model}: ${error.response?.data?.error?.message || error.message}`);
  }
};

// Get chat history
export const getChatHistory = async (req, res, next) => {
  try {
    const { session_id } = req.params;

    const chat = await Chat.findOne({ session_id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      data: {
        chat: {
          session_id: chat.session_id,
          user_info: chat.user_info,
          chat_type: chat.chat_type,
          status: chat.status,
          messages: chat.messages,
          created_at: chat.created_at,
          last_activity: chat.last_activity
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin chat management
export const getAdminChats = async (req, res, next) => {
  try {
    const { status = 'active', limit = 50 } = req.query;

    const filter = { chat_type: 'admin' };
    if (status !== 'all') {
      filter.status = status;
    }

    const chats = await Chat.find(filter)
      .sort({ last_activity: -1 })
      .limit(parseInt(limit))
      .populate('admin_id', 'name email');

    res.json({
      success: true,
      data: {
        chats,
        total: chats.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update admin status
export const updateAdminStatus = async (req, res, next) => {
  try {
    const { is_online, status_message } = req.body;
    const admin_id = req.user._id;

    let adminStatus = await AdminStatus.findOne({ admin_id });
    
    if (!adminStatus) {
      adminStatus = new AdminStatus({ admin_id });
    }

    adminStatus.is_online = is_online;
    adminStatus.last_seen = new Date();
    if (status_message) {
      adminStatus.status_message = status_message;
    }

    await adminStatus.save();

    res.json({
      success: true,
      data: { adminStatus }
    });
  } catch (error) {
    next(error);
  }
};

// Get admin status
export const getAdminStatus = async (req, res, next) => {
  try {
    const adminStatuses = await AdminStatus.find()
      .populate('admin_id', 'name email role')
      .sort({ last_seen: -1 });

    res.json({
      success: true,
      data: { adminStatuses }
    });
  } catch (error) {
    next(error);
  }
};

// Close chat
export const closeChat = async (req, res, next) => {
  try {
    const { session_id } = req.params;

    const chat = await Chat.findOneAndUpdate(
      { session_id },
      { status: 'closed' },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      message: 'Chat closed successfully',
      data: { chat }
    });
  } catch (error) {
    next(error);
  }
};

// Export chat as PDF
export const exportChatPDF = async (req, res, next) => {
  try {
    const { session_id } = req.params;

    const chat = await Chat.findOne({ session_id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    const pdfPath = await generateChatPDF(chat);
    
    res.json({
      success: true,
      data: {
        pdfUrl: `/uploads/pdfs/${path.basename(pdfPath)}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// Generate chat PDF
const generateChatPDF = async (chat) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Chat History - ${chat.user_info.name}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
        .message { margin: 15px 0; padding: 10px; border-radius: 8px; }
        .user-message { background: #EBF8FF; border-left: 4px solid #3B82F6; }
        .admin-message { background: #F0FDF4; border-left: 4px solid #10B981; }
        .ai-message { background: #FEF3C7; border-left: 4px solid #F59E0B; }
        .timestamp { font-size: 12px; color: #6B7280; margin-top: 5px; }
        .user-info { background: #F8FAFC; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Pixeloria Chat History</h1>
        <p>Session: ${chat.session_id}</p>
        <p>Date: ${new Date(chat.created_at).toLocaleDateString()}</p>
      </div>

      <div class="user-info">
        <h3>User Information</h3>
        <p><strong>Name:</strong> ${chat.user_info.name}</p>
        <p><strong>Email:</strong> ${chat.user_info.email}</p>
        <p><strong>Country:</strong> ${chat.user_info.country}</p>
        <p><strong>Chat Type:</strong> ${chat.chat_type.toUpperCase()}</p>
      </div>

      <div class="messages">
        <h3>Chat Messages</h3>
        ${chat.messages.map(msg => `
          <div class="message ${msg.sender}-message">
            <strong>${msg.sender.toUpperCase()}${msg.ai_model ? ` (${msg.ai_model})` : ''}:</strong>
            <p>${msg.content}</p>
            <div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 40px; text-align: center; color: #6B7280; font-size: 14px;">
        <p>Generated by Pixeloria Chat System</p>
      </div>
    </body>
    </html>
  `;

  return await generatePDF({ htmlContent, filename: `chat_${chat.session_id}` });
};