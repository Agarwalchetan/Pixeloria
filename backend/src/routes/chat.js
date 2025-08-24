import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  initializeChat,
  sendMessage,
  getChatHistory,
  getAdminChats,
  updateAdminStatus,
  getAdminStatus,
  closeChat,
  exportChatPDF,
  adminReply
} from '../controllers/chatController.js';

const router = express.Router();

/**
 * @swagger
 * /api/chat/initialize:
 *   post:
 *     summary: Initialize new chat session
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_info
 *               - chat_type
 *             properties:
 *               user_info:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   country:
 *                     type: string
 *               chat_type:
 *                 type: string
 *                 enum: [ai, admin]
 *               ai_config:
 *                 type: object
 *                 properties:
 *                   selected_model:
 *                     type: string
 *                     enum: [groq, openai, deepseek, gemini]
 *                   api_keys:
 *                     type: object
 *     responses:
 *       201:
 *         description: Chat session initialized successfully
 */
router.post('/initialize', initializeChat);

/**
 * @swagger
 * /api/chat/message:
 *   post:
 *     summary: Send message in chat
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - content
 *               - sender
 *             properties:
 *               session_id:
 *                 type: string
 *               content:
 *                 type: string
 *               sender:
 *                 type: string
 *                 enum: [user, admin, ai]
 *               ai_model:
 *                 type: string
 *                 enum: [groq, openai, deepseek, gemini]
 *     responses:
 *       200:
 *         description: Message sent successfully
 */
router.post('/message', sendMessage);

/**
 * @swagger
 * /api/chat/{session_id}/history:
 *   get:
 *     summary: Get chat history
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 */
router.get('/:session_id/history', getChatHistory);

/**
 * @swagger
 * /api/chat/{session_id}/close:
 *   patch:
 *     summary: Close chat session
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat closed successfully
 */
router.patch('/:session_id/close', closeChat);

/**
 * @swagger
 * /api/chat/{session_id}/export:
 *   get:
 *     summary: Export chat as PDF
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat PDF generated successfully
 */
router.get('/:session_id/export', authenticateToken, requireAdmin, exportChatPDF);

// Admin routes
/**
 * @swagger
 * /api/chat/admin/chats:
 *   get:
 *     summary: Get all admin chats
 *     tags: [Chat Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, closed, waiting, all]
 *     responses:
 *       200:
 *         description: Admin chats retrieved successfully
 */
router.get('/admin/chats', authenticateToken, requireAdmin, getAdminChats);

/**
 * @swagger
 * /api/chat/admin/status:
 *   post:
 *     summary: Update admin online status
 *     tags: [Chat Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_online:
 *                 type: boolean
 *               status_message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin status updated successfully
 */
router.post('/admin/status', authenticateToken, requireAdmin, updateAdminStatus);

/**
 * @swagger
 * /api/chat/admin/status:
 *   get:
 *     summary: Get all admin statuses
 *     tags: [Chat Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statuses retrieved successfully
 */
router.get('/admin/status', authenticateToken, requireAdmin, getAdminStatus);

/**
 * @swagger
 * /api/chat/admin/reply:
 *   post:
 *     summary: Send admin reply to chat
 *     tags: [Chat Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - content
 *               - sender
 *             properties:
 *               session_id:
 *                 type: string
 *               content:
 *                 type: string
 *               sender:
 *                 type: string
 *                 enum: [admin]
 *     responses:
 *       200:
 *         description: Admin reply sent successfully
 */
router.post('/admin/reply', authenticateToken, requireAdmin, adminReply);

export default router;