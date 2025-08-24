import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Download, AlertCircle, ArrowLeft, Mail, Globe, User, RefreshCw, Ban, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiBaseUrl } from '../../utils/api';
import MessageFormatter from '../../components/MessageFormatter';

interface Message {
  sender: 'user' | 'admin' | 'ai';
  content: string;
  timestamp: string;
  ai_model?: string;
  status?: string;
}

interface Chat {
  _id: string;
  session_id: string;
  user_info: {
    name: string;
    email: string;
    country: string;
  };
  chat_type: 'ai' | 'admin';
  status: 'active' | 'closed' | 'waiting';
  messages: Message[];
  admin_id?: string;
  created_at: string;
  last_activity: string;
}

const LiveChat: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [chat, setChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket functionality temporarily disabled to fix blackout
  // Will be re-enabled once properly configured

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  useEffect(() => {
    if (sessionId) {
      fetchChat();
      startPolling();
    }
    
    // Cleanup polling on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [sessionId]);

  const startPolling = () => {
    // Clear any existing polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    console.log('Starting admin chat polling for sessionId:', sessionId);
    
    // Poll for new messages every 2 seconds
    pollIntervalRef.current = setInterval(() => {
      if (sessionId) {
        console.log('Admin polling triggered for session:', sessionId);
        fetchChat(false); // Silent polling without loading states
      }
    }, 2000);
  };

  const fetchChat = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
        setConnectionStatus('connecting');
      }
      
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const apiBaseUrl = await getApiBaseUrl();
      
      const response = await fetch(`${apiBaseUrl}/chat/${sessionId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (showLoading) {
        console.log('Admin fetching chat:', { sessionId, success: data.success, messageCount: data.data?.chat?.messages?.length });
      }
      
      if (data.success) {
        setChat(data.data.chat);
        if (showLoading) {
          setConnectionStatus('connected');
          setError(null);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch chat');
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      if (showLoading) {
        setError('Failed to load chat. Please try again.');
        setConnectionStatus('disconnected');
      }
      // For silent polling failures, don't update UI state aggressively
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionId || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const apiBaseUrl = await getApiBaseUrl();
      
      const response = await fetch(`${apiBaseUrl}/chat/admin/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          content: messageContent,
          sender: 'admin'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh chat to show the new message
        await fetchChat(false);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Send message error:', error);
      setError('Failed to send message. Please try again.');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const terminateChat = async () => {
    if (!sessionId || !confirm('Are you sure you want to terminate this chat?')) return;

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const apiBaseUrl = await getApiBaseUrl();
      
      const response = await fetch(`${apiBaseUrl}/admin/dashboard/chats/${sessionId}/terminate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Terminated by admin' })
      });

      if (response.ok) {
        await fetchChat(false);
      }
    } catch (error) {
      console.error('Error terminating chat:', error);
      setError('Failed to terminate chat.');
    }
  };

  const exportChat = async () => {
    if (!sessionId) return;
    
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const apiBaseUrl = await getApiBaseUrl();
      
      const response = await fetch(`${apiBaseUrl}/admin/dashboard/chats/${sessionId}/export`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          window.open(`${apiBaseUrl}${data.data.pdfUrl}`, '_blank');
        }
      }
    } catch (error) {
      console.error('Error exporting chat:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error && !chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchChat()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chat not found</p>
          <button
            onClick={() => navigate('/admin/dashboard/chats')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard/chats')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {chat.user_info.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{chat.user_info.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Mail size={12} />
                    <span>{chat.user_info.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Globe size={12} />
                    <span>{chat.user_info.country}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <User size={12} />
                    <span>Live Chat</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-gray-600">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>

            {/* Chat Status */}
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              chat.status === 'active' ? 'bg-green-100 text-green-800' :
              chat.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {chat.status}
            </span>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchChat()}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={exportChat}
                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Export PDF"
              >
                <Download size={16} />
              </button>
              {chat.status === 'active' && (
                <button
                  onClick={terminateChat}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Terminate Chat"
                >
                  <Ban size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {chat.messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] p-4 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.sender === 'ai'
                  ? 'bg-purple-100 border border-purple-200'
                  : 'bg-green-100 border border-green-200'
              }`}>
                {message.sender !== 'user' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <User size={14} className="text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      {message.sender === 'admin' ? 'Admin' : 'AI Assistant'}
                    </span>
                  </div>
                )}
                
                <div className="text-sm">
                  <MessageFormatter 
                    content={message.content} 
                    isUser={message.sender === 'user'} 
                  />
                </div>
                
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  {message.status && (
                    <span className="ml-2">
                      {message.status === 'sent' && '○'}
                      {message.status === 'delivered' && '◐'}
                      {message.status === 'read' && '●'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-green-100 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-sm text-green-600">Sending...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {chat.status === 'active' && (
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-sm text-red-600">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  disabled={isSending}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {chat.status !== 'active' && (
        <div className="bg-gray-100 border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <CheckCircle size={16} />
              <span>This chat has been {chat.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
