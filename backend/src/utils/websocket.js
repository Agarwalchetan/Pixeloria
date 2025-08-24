import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from './logger.js';

let io;
const connectedClients = new Map(); // sessionId -> socket connections

export const initializeWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    // Join chat room
    socket.on('join-chat', (data) => {
      const { sessionId, userType } = data;
      
      if (!sessionId) {
        socket.emit('error', { message: 'Session ID required' });
        return;
      }

      socket.join(`chat-${sessionId}`);
      
      // Store connection info
      if (!connectedClients.has(sessionId)) {
        connectedClients.set(sessionId, new Set());
      }
      connectedClients.get(sessionId).add({
        socketId: socket.id,
        userType: userType || 'user'
      });

      logger.info(`Client joined chat room: chat-${sessionId} as ${userType}`);
      
      // Notify others in the room about new connection
      socket.to(`chat-${sessionId}`).emit('user-connected', {
        userType,
        timestamp: new Date()
      });
    });

    // Handle new messages
    socket.on('new-message', (data) => {
      const { sessionId, message } = data;
      
      if (!sessionId || !message) {
        socket.emit('error', { message: 'Session ID and message required' });
        return;
      }

      // Broadcast to all clients in the chat room except sender
      socket.to(`chat-${sessionId}`).emit('message-received', {
        message,
        timestamp: new Date()
      });

      logger.info(`Message broadcasted to chat-${sessionId}`);
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { sessionId, userType } = data;
      socket.to(`chat-${sessionId}`).emit('user-typing', { userType, typing: true });
    });

    socket.on('typing-stop', (data) => {
      const { sessionId, userType } = data;
      socket.to(`chat-${sessionId}`).emit('user-typing', { userType, typing: false });
    });

    // Handle admin authentication for admin sockets
    socket.on('authenticate-admin', (data) => {
      const { token } = data;
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'admin') {
          socket.isAdmin = true;
          socket.adminId = decoded.id;
          socket.emit('auth-success', { message: 'Admin authenticated' });
        } else {
          socket.emit('auth-error', { message: 'Invalid admin token' });
        }
      } catch (error) {
        socket.emit('auth-error', { message: 'Authentication failed' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
      
      // Remove from connected clients
      for (const [sessionId, connections] of connectedClients.entries()) {
        const connectionArray = Array.from(connections);
        const updatedConnections = connectionArray.filter(conn => conn.socketId !== socket.id);
        
        if (updatedConnections.length === 0) {
          connectedClients.delete(sessionId);
        } else {
          connectedClients.set(sessionId, new Set(updatedConnections));
        }
        
        // Notify others about disconnection
        socket.to(`chat-${sessionId}`).emit('user-disconnected', {
          timestamp: new Date()
        });
      }
    });
  });

  return io;
};

// Utility functions to emit events from controllers
export const emitToChat = (sessionId, event, data) => {
  if (io) {
    io.to(`chat-${sessionId}`).emit(event, data);
  }
};

export const emitNewMessage = (sessionId, message) => {
  if (io) {
    io.to(`chat-${sessionId}`).emit('message-received', {
      message,
      timestamp: new Date()
    });
  }
};

export const emitChatStatusUpdate = (sessionId, status) => {
  if (io) {
    io.to(`chat-${sessionId}`).emit('chat-status-update', {
      status,
      timestamp: new Date()
    });
  }
};

export const getConnectedClients = (sessionId) => {
  return connectedClients.get(sessionId) || new Set();
};

export const isClientConnected = (sessionId) => {
  return connectedClients.has(sessionId) && connectedClients.get(sessionId).size > 0;
};
