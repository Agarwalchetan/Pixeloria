import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Search, 
  Eye, 
  Download, 
  X, 
  Send, 
  Clock,
  User,
  Bot,
  TrendingUp,
  Globe,
  Ban,
  Mail
} from 'lucide-react';
import { getApiBaseUrl } from '../../utils/api';
import { authUtils } from '../../utils/auth';

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
  messages: Array<{
    sender: 'user' | 'admin' | 'ai';
    content: string;
    timestamp: string;
    ai_model?: string;
    status?: string;
  }>;
  admin_id?: string;
  ai_config?: {
    selected_model: string;
  };
  created_at: string;
  last_activity: string;
}

interface AdminStatus {
  _id: string;
  admin_id: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  is_online: boolean;
  last_seen: string;
  status_message: string;
}

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [adminStatuses, setAdminStatuses] = useState<AdminStatus[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showChatModal, setShowChatModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Available for chat');

  const currentUser = authUtils.getUser();

  useEffect(() => {
    fetchChats();
    fetchAdminStatuses();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchChats();
      fetchAdminStatuses();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      console.log('Fetching chats with filters:', { statusFilter, typeFilter, searchTerm });
      
      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/admin/dashboard/chats?status=${statusFilter}&chat_type=${typeFilter}&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('API Response:', data);
      if (data.success) {
        setChats(data.data.chats);
        console.log('Chats loaded:', data.data.chats.length);
      } else {
        console.error('API Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminStatuses = async () => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/chat/admin/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAdminStatuses(data.data.adminStatuses);
        
        // Set current user's status
        const currentUserStatus = data.data.adminStatuses.find(
          (status: AdminStatus) => status.admin_id._id === currentUser?.id
        );
        if (currentUserStatus) {
          setIsOnline(currentUserStatus.is_online);
          setStatusMessage(currentUserStatus.status_message);
        }
      }
    } catch (error) {
      console.error('Error fetching admin statuses:', error);
    }
  };

  const updateOnlineStatus = async (online: boolean) => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/chat/admin/status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_online: online,
          status_message: statusMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsOnline(online);
        fetchAdminStatuses();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const sendAdminMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: selectedChat.session_id,
          content: newMessage,
          sender: 'admin'
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchChats();
        
        // Update selected chat
        const updatedChat = chats.find(c => c.session_id === selectedChat.session_id);
        if (updatedChat) {
          setSelectedChat(updatedChat);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const terminateChat = async (sessionId: string, reason: string = 'Terminated by admin') => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/dashboard/chats/${sessionId}/terminate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        fetchChats(); // Refresh the chat list
        setShowChatModal(false);
      }
    } catch (error) {
      console.error('Error terminating chat:', error);
    }
  };

  const exportChatPDF = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/dashboard/chats/${sessionId}/export`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          window.open(`http://localhost:5000${data.data.pdfUrl}`, '_blank');
        }
      }
    } catch (error) {
      console.error('Error exporting chat:', error);
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = 
      chat.user_info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.user_info.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || chat.status === statusFilter;
    const matchesType = typeFilter === 'all' || chat.chat_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getAIModelIcon = (model: string) => {
    switch (model) {
      case 'groq': return '⚡';
      case 'openai': return '🤖';
      case 'deepseek': return '🧠';
      case 'gemini': return '✨';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'waiting': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat Management</h1>
          <p className="text-gray-600">Manage AI and live chat conversations</p>
        </div>
        
        {/* Online Status Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Status:</span>
            <button
              onClick={() => updateOnlineStatus(!isOnline)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isOnline 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Chats</p>
              <p className="text-2xl font-bold text-gray-900">{chats.length}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Chats</p>
              <p className="text-2xl font-bold text-gray-900">
                {chats.filter(c => c.chat_type === 'ai').length}
              </p>
            </div>
            <Bot className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Live Chats</p>
              <p className="text-2xl font-bold text-gray-900">
                {chats.filter(c => c.chat_type === 'admin').length}
              </p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Now</p>
              <p className="text-2xl font-bold text-gray-900">
                {chats.filter(c => c.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Admin Status Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Team Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminStatuses.map((status) => (
            <div
              key={status._id}
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {status.admin_id.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{status.admin_id.name}</div>
                <div className="text-sm text-gray-600">{status.admin_id.role}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    status.is_online ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {status.is_online ? 'Online' : `Last seen ${new Date(status.last_seen).toLocaleTimeString()}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="waiting">Waiting</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="ai">AI Chats</option>
            <option value="admin">Live Chats</option>
          </select>
        </div>
      </div>

      {/* Chats Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chat Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChats.map((chat, index) => (
                <motion.tr
                  key={chat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedChat(chat);
                    setShowChatModal(true);
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {chat.user_info.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{chat.user_info.name}</div>
                        <div className="text-sm text-gray-500">{chat.user_info.email}</div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Globe size={10} />
                          <span>{chat.user_info.country}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {chat.chat_type === 'ai' ? (
                        <>
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-600">AI Chat</span>
                          {chat.ai_config?.selected_model && (
                            <span className="text-xs text-gray-500">
                              {getAIModelIcon(chat.ai_config.selected_model)} {chat.ai_config.selected_model}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Live Chat</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{chat.messages.length} messages</div>
                    <div className="text-xs text-gray-500">
                      Last: {chat.messages[chat.messages.length - 1]?.content.substring(0, 30)}...
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(chat.status)}`}>
                      {chat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{new Date(chat.last_activity).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChat(chat);
                          setShowChatModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Chat"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportChatPDF(chat.session_id);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Export PDF"
                      >
                        <Download size={16} />
                      </button>
                      {chat.status === 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to terminate this chat?')) {
                              terminateChat(chat.session_id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Terminate Chat"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      <a
                        href={`mailto:${chat.user_info.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Email User"
                      >
                        <Mail size={16} />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat Detail Modal */}
      <AnimatePresence>
        {showChatModal && selectedChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {selectedChat.user_info.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedChat.user_info.name}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Mail size={12} />
                          <span>{selectedChat.user_info.email}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Globe size={12} />
                          <span>{selectedChat.user_info.country}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          {selectedChat.chat_type === 'ai' ? <Bot size={12} /> : <User size={12} />}
                          <span>{selectedChat.chat_type === 'ai' ? 'AI Chat' : 'Live Chat'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {selectedChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.sender === 'ai'
                          ? 'bg-purple-100 border border-purple-200'
                          : 'bg-green-100 border border-green-200'
                      }`}>
                        {message.sender !== 'user' && (
                          <div className="flex items-center space-x-2 mb-1">
                            {message.sender === 'ai' ? (
                              <>
                                <Bot size={14} className="text-purple-600" />
                                <span className="text-xs font-medium text-purple-600">
                                  {message.ai_model && getAIModelIcon(message.ai_model)} AI Assistant
                                </span>
                              </>
                            ) : (
                              <>
                                <User size={14} className="text-green-600" />
                                <span className="text-xs font-medium text-green-600">Admin</span>
                              </>
                            )}
                          </div>
                        )}
                        <p className={`text-sm ${
                          message.sender === 'user' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {message.content}
                        </p>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Reply (only for live chats) */}
              {selectedChat.chat_type === 'admin' && selectedChat.status === 'active' && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendAdminMessage()}
                      placeholder="Type your reply..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendAdminMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Session: {selectedChat.session_id} • Created: {new Date(selectedChat.created_at).toLocaleString()}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => exportChatPDF(selectedChat.session_id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download size={16} />
                      <span>Export PDF</span>
                    </button>
                    <a
                      href={`mailto:${selectedChat.user_info.email}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Mail size={16} />
                      <span>Email User</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chats;