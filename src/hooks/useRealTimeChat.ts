import { useEffect, useRef, useState, useCallback } from 'react';
// @ts-ignore
import io from 'socket.io-client';

interface Message {
  id: string;
  sender: 'user' | 'admin' | 'ai';
  content: string;
  timestamp: Date;
  ai_model?: string;
  status: string;
}

interface UseRealTimeChatProps {
  sessionId: string | null;
  userType: 'user' | 'admin';
  token?: string;
  onMessageReceived?: (message: Message) => void;
  onConnectionStatusChange?: (status: 'connected' | 'connecting' | 'disconnected') => void;
  onUserTyping?: (isTyping: boolean, userType: string) => void;
}

export const useRealTimeChat = ({
  sessionId,
  userType,
  token,
  onMessageReceived,
  onConnectionStatusChange,
  onUserTyping
}: UseRealTimeChatProps) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const getApiBaseUrl = async () => {
    try {
      const response = await fetch('/port.json');
      const data = await response.json();
      return `http://localhost:${data.port}`;
    } catch (error) {
      console.error('Error reading port:', error);
      return 'http://localhost:5000';
    }
  };

  const updateConnectionStatus = useCallback((status: 'connected' | 'connecting' | 'disconnected') => {
    setConnectionStatus(status);
    onConnectionStatusChange?.(status);
  }, [onConnectionStatusChange]);

  const connectSocket = useCallback(async () => {
    if (!sessionId) return;

    try {
      updateConnectionStatus('connecting');
      const apiBaseUrl = await getApiBaseUrl();
      
      const newSocket = io(apiBaseUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        updateConnectionStatus('connected');
        
        // Join the chat room
        newSocket.emit('join-chat', { sessionId, userType });
        
        // Authenticate admin if needed
        if (userType === 'admin' && token) {
          newSocket.emit('authenticate-admin', { token });
        }
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        updateConnectionStatus('disconnected');
      });

      newSocket.on('connect_error', (error: any) => {
        console.error('WebSocket connection error:', error);
        updateConnectionStatus('disconnected');
        
        // Retry connection after 3 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSocket();
        }, 3000);
      });

      // Message events
      newSocket.on('message-received', (data: any) => {
        const message: Message = {
          id: `${data.message.timestamp}_${data.message.sender}`,
          sender: data.message.sender,
          content: data.message.content,
          timestamp: new Date(data.message.timestamp),
          ai_model: data.message.ai_model,
          status: data.message.status || 'delivered'
        };
        onMessageReceived?.(message);
      });

      // Typing events
      newSocket.on('user-typing', (data: any) => {
        onUserTyping?.(data.typing, data.userType);
      });

      // Connection status events
      newSocket.on('user-connected', (data: any) => {
        console.log(`User connected: ${data.userType}`);
      });

      newSocket.on('user-disconnected', () => {
        console.log('User disconnected');
      });

      // Error events
      newSocket.on('error', (error: any) => {
        console.error('Socket error:', error);
      });

      newSocket.on('auth-success', () => {
        console.log('Admin authenticated successfully');
      });

      newSocket.on('auth-error', (error: any) => {
        console.error('Admin authentication failed:', error);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Failed to connect socket:', error);
      updateConnectionStatus('disconnected');
    }
  }, [sessionId, userType, token, onMessageReceived, onUserTyping, updateConnectionStatus]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      updateConnectionStatus('disconnected');
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, [socket, updateConnectionStatus]);

  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socket && isConnected && sessionId) {
      socket.emit('new-message', {
        sessionId,
        message: {
          ...message,
          timestamp: new Date()
        }
      });
    }
  }, [socket, isConnected, sessionId]);

  const startTyping = useCallback(() => {
    if (socket && isConnected && sessionId) {
      socket.emit('typing-start', { sessionId, userType });
      
      // Auto-stop typing after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    }
  }, [socket, isConnected, sessionId, userType]);

  const stopTyping = useCallback(() => {
    if (socket && isConnected && sessionId) {
      socket.emit('typing-stop', { sessionId, userType });
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [socket, isConnected, sessionId, userType]);

  // Connect when sessionId is available
  useEffect(() => {
    if (sessionId) {
      connectSocket();
    }
    
    return () => {
      disconnectSocket();
    };
  }, [sessionId, connectSocket, disconnectSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnectSocket();
    };
  }, [disconnectSocket]);

  return {
    socket,
    isConnected,
    connectionStatus,
    sendMessage,
    startTyping,
    stopTyping,
    reconnect: connectSocket,
    disconnect: disconnectSocket
  };
};
