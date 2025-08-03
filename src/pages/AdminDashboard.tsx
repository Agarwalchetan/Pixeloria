import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, FileText, Briefcase, Mail, Settings, LogOut, Plus,
  TrendingUp, Eye, Edit, Trash2, Search, Filter, Calendar, Award,
  Globe, ShoppingCart, Code, MessageSquare, Star, Clock, CheckCircle
} from 'lucide-react';

interface DashboardStats {
  portfolio: number;
  blogs: number;
  contacts: number;
  services: number;
  labs: number;
  users: number;
  newsletter: number;
  testimonials: number;
}

interface Contact {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  project_type?: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    portfolio: 0,
    blogs: 0,
    contacts: 0,
    services: 0,
    labs: 0,
    users: 0,
    newsletter: 0,
    testimonials: 0
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data.statistics);
        setContacts(data.data.recent.contacts || []);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const updateContactStatus = async (contactId: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`http://localhost:5000/api/admin/contacts/${contactId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setContacts(prev => prev.map(contact => 
          contact._id === contactId ? { ...contact, status: status as any } : contact
        ));
      }
    } catch (err) {
      console.error('Error updating contact status:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'blogs', label: 'Blog Posts', icon: FileText },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const statCards = [
    { label: 'Portfolio Projects', value: stats.portfolio, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { label: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'from-green-500 to-green-600' },
    { label: 'Contact Submissions', value: stats.contacts, icon: Mail, color: 'from-purple-500 to-purple-600' },
    { label: 'Services', value: stats.services, icon: Settings, color: 'from-orange-500 to-orange-600' },
    { label: 'Lab Projects', value: stats.labs, icon: Code, color: 'from-pink-500 to-pink-600' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Newsletter Subscribers', value: stats.newsletter, icon: TrendingUp, color: 'from-teal-500 to-teal-600' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, color: 'from-yellow-500 to-yellow-600' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your Pixeloria website</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {statCards.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contact Submissions</h3>
                  <div className="space-y-4">
                    {contacts.slice(0, 5).map((contact) => (
                      <div key={contact._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900">
                              {contact.first_name} {contact.last_name}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{contact.email}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(contact.createdAt)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateContactStatus(contact._id, 'replied')}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                          >
                            Mark Replied
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Contact Submissions</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter size={20} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contacts.map((contact) => (
                        <tr key={contact._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {contact.first_name} {contact.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{contact.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {contact.company || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {contact.project_type || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(contact.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateContactStatus(contact._id, 'replied')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'overview' && activeTab !== 'contacts' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {sidebarItems.find(item => item.id === activeTab)?.label} Management
              </h3>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;