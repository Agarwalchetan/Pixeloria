import Chat from '../database/models/Chat.js';
import AdminStatus from '../database/models/AdminStatus.js';
import User from '../database/models/User.js';
import { logger } from '../utils/logger.js';
import { sendEmail } from '../utils/email.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import { getAIModelKey } from './aiConfigController.js';
import { emitNewMessage, emitChatStatusUpdate } from '../utils/websocket.js';
import axios from 'axios';

// AI Model Configurations
const AI_MODELS = {
  groq: {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'openai/gpt-oss-20b',
    description: 'Fast inference with GPT OSS 20B model'
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
    const chatData = {
      session_id,
      user_info,
      chat_type,
      status: chat_type === 'admin' ? (admin_available ? 'active' : 'waiting') : 'active'
    };

    // Only add admin_id if chat_type is admin AND we have an assigned admin
    if (chat_type === 'admin' && assigned_admin) {
      chatData.admin_id = assigned_admin;
    }

    // Only add ai_config if chat_type is ai
    if (chat_type === 'ai') {
      chatData.ai_config = ai_config;
    }

    const chat = new Chat(chatData);

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

    // Only validate AI configuration for AI chats
    let modelToUse, aiConfig, modelConfig, actualModel, apiKey;
    
    if (chat.chat_type === 'ai') {
      // Determine which AI model to use - from request or chat config
      modelToUse = ai_model || chat.ai_config?.selected_model;
      
      if (!modelToUse) {
        return res.status(400).json({
          success: false,
          message: 'No AI model specified'
        });
      }

      // Get AI model configuration from admin settings
      aiConfig = await getAIModelKey(modelToUse);
      if (!aiConfig) {
        return res.status(400).json({
          success: false,
          message: `AI model ${modelToUse} is not configured or enabled`
        });
      }

      modelConfig = AI_MODELS[modelToUse];
      if (!modelConfig) {
        return res.status(400).json({
          success: false,
          message: `Unsupported AI model: ${modelToUse}`
        });
      }

      // Use custom model name if specified in admin config, otherwise use default
      actualModel = aiConfig.modelName || modelConfig.model;
      apiKey = aiConfig.apiKey;
    }

    // Create message
    const message = {
      sender,
      content,
      timestamp: new Date(),
      ai_model: sender === 'ai' ? modelToUse : undefined,
      status: 'sent'
    };

    // Add message to chat
    chat.messages.push(message);
    chat.last_activity = new Date();
    await chat.save();

    // Emit real-time message to all connected clients
    emitNewMessage(chat.session_id, message);

    // Handle AI response
    if (sender === 'user' && chat.chat_type === 'ai') {
      try {
        const aiResponse = await generateAIResponse(content, modelToUse);
        
        const aiMessage = {
          sender: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          ai_model: modelToUse,
          status: 'sent'
        };

        chat.messages.push(aiMessage);
        await chat.save();

        // Emit AI response in real-time
        emitNewMessage(chat.session_id, aiMessage);

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
          ai_model: modelToUse,
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
const generateAIResponse = async (userMessage, model) => {
  // Get AI model configuration from admin settings
  const aiConfig = await getAIModelKey(model);
  if (!aiConfig) {
    throw new Error(`AI model ${model} is not configured or enabled`);
  }

  const modelConfig = AI_MODELS[model];
  if (!modelConfig) {
    throw new Error('Invalid AI model selected');
  }

  // Use custom model name if specified in admin config, otherwise use default
  const actualModel = aiConfig.modelName || modelConfig.model;
  const apiKey = aiConfig.apiKey;

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
      const requestBody = {
        model: actualModel,
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for Pixeloria, a creative platform. Be concise, helpful, and engaging. Format your responses with markdown when appropriate - use **bold** for emphasis, *italics* for subtle emphasis, \`code\` for technical terms, bullet points with - or *, numbered lists with 1. 2. etc., and code blocks with \`\`\` for longer code snippets. Use ## for section headers when organizing longer responses.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      };

      response = await axios.post(
        modelConfig.endpoint,
        requestBody,
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

// Admin chat management - Get all chats (both AI and admin)
export const getAllChats = async (req, res, next) => {
  try {
    const { 
      status = 'all', 
      chat_type = 'all', 
      limit = 50, 
      page = 1,
      search = ''
    } = req.query;

    const filter = {};
    
    // Filter by status
    if (status !== 'all') {
      filter.status = status;
    }
    
    // Filter by chat type
    if (chat_type !== 'all') {
      filter.chat_type = chat_type;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { 'user_info.name': { $regex: search, $options: 'i' } },
        { 'user_info.email': { $regex: search, $options: 'i' } },
        { session_id: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const chats = await Chat.find(filter)
      .sort({ last_activity: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('admin_id', 'name email')
      .select('session_id user_info chat_type status created_at last_activity messages admin_id ai_config');

    const total = await Chat.countDocuments(filter);

    // Add message count and last message preview
    const chatsWithStats = chats.map(chat => ({
      ...chat.toObject(),
      message_count: chat.messages.length,
      last_message: chat.messages.length > 0 ? {
        content: chat.messages[chat.messages.length - 1].content.substring(0, 100) + '...',
        sender: chat.messages[chat.messages.length - 1].sender,
        timestamp: chat.messages[chat.messages.length - 1].timestamp
      } : null
    }));

    res.json({
      success: true,
      data: {
        chats: chatsWithStats,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin chat management - Legacy endpoint for admin chats only
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

// Admin terminate chat (force close)
export const terminateChat = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { reason = 'Terminated by admin' } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { session_id },
      { 
        status: 'terminated',
        termination_reason: reason,
        terminated_by: req.user._id,
        terminated_at: new Date()
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Add system message about termination
    const systemMessage = {
      sender: 'system',
      content: `Chat terminated by admin. Reason: ${reason}`,
      timestamp: new Date(),
      status: 'sent'
    };

    chat.messages.push(systemMessage);
    await chat.save();

    res.json({
      success: true,
      message: 'Chat terminated successfully',
      data: { chat }
    });
  } catch (error) {
    next(error);
  }
};

// Get chat statistics
export const getChatStats = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const stats = await Chat.aggregate([
      {
        $match: {
          created_at: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total_chats: { $sum: 1 },
          ai_chats: {
            $sum: { $cond: [{ $eq: ['$chat_type', 'ai'] }, 1, 0] }
          },
          admin_chats: {
            $sum: { $cond: [{ $eq: ['$chat_type', 'admin'] }, 1, 0] }
          },
          active_chats: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          closed_chats: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          },
          terminated_chats: {
            $sum: { $cond: [{ $eq: ['$status', 'terminated'] }, 1, 0] }
          },
          total_messages: { $sum: { $size: '$messages' } }
        }
      }
    ]);

    const result = stats[0] || {
      total_chats: 0,
      ai_chats: 0,
      admin_chats: 0,
      active_chats: 0,
      closed_chats: 0,
      terminated_chats: 0,
      total_messages: 0
    };

    // Get live stats
    const liveStats = {
      currently_active: await Chat.countDocuments({ status: 'active' }),
      waiting_for_admin: await Chat.countDocuments({ 
        chat_type: 'admin', 
        status: 'waiting' 
      })
    };

    res.json({
      success: true,
      data: {
        period,
        stats: result,
        live: liveStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin reply
export const adminReply = async (req, res, next) => {
  try {
    const { session_id, content, sender } = req.body;

    if (!session_id || !content || sender !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Session ID, content, and sender (admin) are required'
      });
    }

    // Find the chat session
    const chat = await Chat.findOne({ session_id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Add admin message to chat
    const adminMessage = {
      sender: 'admin',
      content: content.trim(),
      timestamp: new Date(),
      status: 'delivered'
    };

    chat.messages.push(adminMessage);
    chat.last_activity = new Date();
    chat.status = 'active';

    await chat.save();

    // Emit real-time message if WebSocket is available
    try {
      emitNewMessage(session_id, adminMessage);
    } catch (wsError) {
      logger.warn('WebSocket emission failed:', wsError.message);
    }

    logger.info(`Admin replied to chat ${session_id}`);

    res.json({
      success: true,
      message: 'Admin reply sent successfully',
      data: {
        message: adminMessage,
        chat_status: chat.status
      }
    });

  } catch (error) {
    logger.error('Admin reply error:', error);
    next(error);
  }
};

// Export chat as PDF
export const exportChatPDF = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    const chat = await Chat.findOne({ session_id: sessionId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const pdfBuffer = await generatePDF(chat);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="chat-${sessionId}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    logger.error('Export chat PDF error:', error);
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