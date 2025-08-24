import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, MessageCircle, Maximize2, Minimize2, Loader, Settings, RefreshCw, AlertCircle } from 'lucide-react';
import { Download } from 'lucide-react';
import { getApiBaseUrl } from '../utils/api';
import MessageFormatter from './MessageFormatter';

interface Message {
  id: string;
  sender: 'user' | 'admin' | 'ai';
  content: string;
  timestamp: Date;
  ai_model?: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface UserInfo {
  name: string;
  email: string;
  country: string;
}

interface ChatWidgetProps {
  mode?: 'ai' | 'admin' | 'both';
  position?: 'bottom-right' | 'bottom-left';
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  mode = 'both', 
  position = 'bottom-right' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'userInfo' | 'chatType' | 'aiConfig' | 'chat'>('welcome');
  const [chatType, setChatType] = useState<'ai' | 'admin'>('ai');
  const [selectedAIModel, setSelectedAIModel] = useState('');
  const [availableAIModels, setAvailableAIModels] = useState<AIModel[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    country: ''
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [adminAvailable, setAdminAvailable] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch available AI models from admin configuration
  useEffect(() => {
    fetchAvailableAIModels();
  }, []);

  const fetchAvailableAIModels = async () => {
    try {
      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/admin/dashboard/ai-config/enabled`);
      const data = await response.json();
      
      if (data.success && data.data.aiModels.length > 0) {
        setAvailableAIModels(data.data.aiModels);
        // Set the first available model as default
        setSelectedAIModel(data.data.aiModels[0].id);
      } else {
        // Fallback to default models if none configured
        const defaultModels: AIModel[] = [
          {
            id: 'groq',
            name: 'Groq',
            description: 'Lightning-fast inference',
            icon: '⚡',
            color: 'from-orange-500 to-red-500',
            status: 'active'
          }
        ];
        setAvailableAIModels(defaultModels);
        setSelectedAIModel('groq');
      }
    } catch (error) {
      console.error('Error fetching AI models:', error);
      // Fallback to default model
      const defaultModels: AIModel[] = [
        {
          id: 'groq',
          name: 'Groq',
          description: 'Lightning-fast inference',
          icon: '⚡',
          color: 'from-orange-500 to-red-500',
          status: 'active'
        }
      ];
      setAvailableAIModels(defaultModels);
      setSelectedAIModel('groq');
    }
  };

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setConnectionStatus('connecting');

      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/chat/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_info: userInfo,
          chat_type: chatType,
          ai_config: chatType === 'ai' ? {
            selected_model: selectedAIModel
          } : undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.data.session_id);
        setAdminAvailable(data.data.admin_available);
        setConnectionStatus('connected');
        setCurrentStep('chat');
        
        // Add welcome message
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          sender: chatType === 'ai' ? 'ai' : 'admin',
          content: chatType === 'ai' 
            ? `Hello ${userInfo.name}! I'm your AI assistant powered by ${availableAIModels.find(m => m.id === selectedAIModel)?.name}. How can I help you today?`
            : data.data.admin_available 
              ? `Hello ${userInfo.name}! An admin will be with you shortly.`
              : `Hello ${userInfo.name}! All admins are currently offline. Your message will be saved and we'll get back to you soon.`,
          timestamp: new Date(),
          ai_model: chatType === 'ai' ? selectedAIModel : undefined,
          status: 'delivered'
        };
        
        setMessages([welcomeMessage]);
      } else {
        throw new Error(data.message || 'Failed to initialize chat');
      }
    } catch (error) {
      console.error('Chat initialization error:', error);
      setConnectionStatus('disconnected');
      alert('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          content: inputMessage,
          sender: 'user',
          ai_model: chatType === 'ai' ? selectedAIModel : undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.data.ai_response) {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + '_ai',
            sender: 'ai',
            content: data.data.ai_response.content,
            timestamp: new Date(data.data.ai_response.timestamp),
            ai_model: data.data.ai_response.ai_model,
            status: 'delivered'
          }]);
        }
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_error',
        sender: 'ai',
        content: 'Sorry, I encountered an error. Please try again or contact support.',
        timestamp: new Date(),
        status: 'delivered'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setCurrentStep('welcome');
    setMessages([]);
    setSessionId(null);
    setUserInfo({ name: '', email: '', country: '' });
    setConnectionStatus('disconnected');
  };

  const exportChat = async () => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(`http://localhost:50001/api/chat/${sessionId}/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          window.open(`http://localhost:50001${data.data.pdfUrl}`, '_blank');
        }
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {chatType === 'ai' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {chatType === 'ai' ? 'AI Assistant' : 'Live Support'}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-blue-100">
                      <div className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'connected' ? 'bg-green-400' :
                        connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <span>
                        {connectionStatus === 'connected' ? 'Connected' :
                         connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                      </span>
                      {chatType === 'ai' && sessionId && (
                        <span>• {availableAIModels.find(m => m.id === selectedAIModel)?.name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <div className="flex flex-col h-[536px]">
                {/* Welcome Step */}
                {currentStep === 'welcome' && (
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="text-center space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                      >
                        <MessageCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Welcome to Pixeloria Support
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Choose how you'd like to get help today
                        </p>
                      </div>

                      <div className="space-y-3">
                        {mode !== 'admin' && availableAIModels.length > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setChatType('ai');
                              setCurrentStep('userInfo');
                            }}
                            className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl text-left hover:shadow-md transition-all"
                          >
                            <div className="flex items-center space-x-3">
                              <Bot className="w-6 h-6 text-blue-600" />
                              <div>
                                <div className="font-semibold text-gray-900">AI Assistant</div>
                                <div className="text-sm text-gray-600">Get instant answers with AI</div>
                              </div>
                            </div>
                          </motion.button>
                        )}

                        {mode !== 'ai' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setChatType('admin');
                              setCurrentStep('userInfo');
                            }}
                            className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-left hover:shadow-md transition-all"
                          >
                            <div className="flex items-center space-x-3">
                              <User className="w-6 h-6 text-green-600" />
                              <div>
                                <div className="font-semibold text-gray-900">Live Support</div>
                                <div className="text-sm text-gray-600">Chat with our team</div>
                              </div>
                            </div>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* User Info Collection */}
                {currentStep === 'userInfo' && (
                  <div className="flex-1 p-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Let's get to know you
                        </h3>
                        <p className="text-gray-600 text-sm">
                          This helps us provide better assistance
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="your@email.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <select
                            value={userInfo.country}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, country: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select your country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="IN">India</option>
                            <option value="JP">Japan</option>
                            <option value="BR">Brazil</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => setCurrentStep('welcome')}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => {
                            if (chatType === 'ai' && availableAIModels.length > 1) {
                              setCurrentStep('aiConfig');
                            } else {
                              initializeChat();
                            }
                          }}
                          disabled={!userInfo.name || !userInfo.email || !userInfo.country}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Model Selection (only if multiple models available) */}
                {currentStep === 'aiConfig' && (
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Choose Your AI Assistant
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Select an AI model to help you today
                        </p>
                      </div>

                      {/* AI Model Selection */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          AI Model
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {availableAIModels.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => setSelectedAIModel(model.id)}
                              className={`p-3 rounded-lg border-2 text-left transition-all ${
                                selectedAIModel === model.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center text-white text-lg`}>
                                  {model.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{model.name}</div>
                                  <p className="text-xs text-gray-600">{model.description}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => setCurrentStep('userInfo')}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={initializeChat}
                          disabled={!selectedAIModel}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Interface */}
                {currentStep === 'chat' && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : message.sender === 'ai'
                                ? 'bg-white border border-gray-200'
                                : 'bg-green-100 border border-green-200'
                            }`}>
                              {message.sender !== 'user' && (
                                <div className="flex items-center space-x-2 mb-1">
                                  {message.sender === 'ai' ? (
                                    <Bot size={14} className="text-blue-600" />
                                  ) : (
                                    <User size={14} className="text-green-600" />
                                  )}
                                  <span className="text-xs font-medium text-gray-600">
                                    {message.sender === 'ai' 
                                      ? `${availableAIModels.find(m => m.id === message.ai_model)?.name || 'AI'} Assistant`
                                      : 'Admin'
                                    }
                                  </span>
                                </div>
                              )}
                              <div className="text-sm">
                                <MessageFormatter 
                                  content={message.content} 
                                  isUser={message.sender === 'user'} 
                                />
                              </div>
                              <div className={`text-xs mt-1 ${
                                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
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
                        
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Loader className="w-4 h-4 animate-spin text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  {chatType === 'ai' ? 'AI is thinking...' : 'Admin is typing...'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={`Message ${chatType === 'ai' ? 'AI assistant' : 'admin'}...`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || isLoading}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send size={16} />
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => {
                              const dropdown = document.getElementById('chat-menu');
                              dropdown?.classList.toggle('hidden');
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Settings size={16} />
                          </button>
                          
                          <div
                            id="chat-menu"
                            className="hidden absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                          >
                            <button
                              onClick={exportChat}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Download size={14} />
                              <span>Export Chat</span>
                            </button>
                            <button
                              onClick={resetChat}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <RefreshCw size={14} />
                              <span>New Chat</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {chatType === 'admin' && !adminAvailable && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                          <div className="flex items-center space-x-1">
                            <AlertCircle size={12} />
                            <span>Admin is offline. Your messages will be saved for review.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;