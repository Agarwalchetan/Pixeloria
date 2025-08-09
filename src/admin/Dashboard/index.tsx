import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, FolderOpen, FlaskRound as Flask, Settings, Star, Mail, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Eye, Edit, Trash2, Calendar, Clock, Activity, BarChart3 } from 'lucide-react';
import { authUtils } from '../../utils/auth';
import { Link } from 'react-router-dom';

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

interface RecentActivity {
  contacts: any[];
  blogs: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    portfolio: 0,
    blogs: 0,
    contacts: 0,
    services: 0,
    labs: 0,
    users: 0,
    newsletter: 0,
    testimonials: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({
    contacts: [],
    blogs: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = authUtils.getToken();
      if (!token) {
        console.error('No auth token found');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data.statistics);
        setRecentActivity(data.data.recent);
      } else {
        console.error('Failed to fetch dashboard data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current user
  const adminUser = authUtils.getUser();

  const statCards = [
    {
      title: 'Portfolio Projects',
      value: stats.portfolio,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive',
      link: '/admin/dashboard/portfolio'
    },
    {
      title: 'Blog Posts',
      value: stats.blogs,
      icon: FileText,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      changeType: 'positive',
      link: '/admin/dashboard/blog'
    },
    {
      title: 'Contact Inquiries',
      value: stats.contacts,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      change: '+25%',
      changeType: 'positive',
      link: '/admin/dashboard/contact-inquiries'
    },
    {
      title: 'Services',
      value: stats.services,
      icon: Settings,
      color: 'from-orange-500 to-orange-600',
      change: '+5%',
      changeType: 'positive',
      link: '/admin/dashboard/services'
    },
    {
      title: 'Lab Projects',
      value: stats.labs,
      icon: Flask,
      color: 'from-pink-500 to-pink-600',
      change: '+18%',
      changeType: 'positive',
      link: '/admin/dashboard/labs'
    },
    {
      title: 'Admin Users',
      value: stats.users,
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      change: '+2%',
      changeType: 'positive',
      link: '/admin/dashboard/users'
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.newsletter,
      icon: Mail,
      color: 'from-teal-500 to-teal-600',
      change: '+15%',
      changeType: 'positive',
      link: '/admin/dashboard/newsletter'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      change: '+10%',
      changeType: 'positive',
      link: '/admin/dashboard/testimonials'
    },
  ];

  const quickActions = [
    { label: 'Add Portfolio Project', path: '/admin/dashboard/portfolio', icon: Plus, color: 'blue' },
    { label: 'Write Blog Post', path: '/admin/dashboard/blog', icon: Plus, color: 'green' },
    { label: 'Create Lab Project', path: '/admin/dashboard/labs', icon: Plus, color: 'purple' },
    { label: 'Add Service', path: '/admin/dashboard/services', icon: Plus, color: 'orange' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Unable to load user data</p>
          <Link to="/admin" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {adminUser.name}!</h1>
            <p className="text-blue-100">Here's what's happening with your website today.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Last login</div>
            <div className="font-semibold">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = card.link}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.changeType === 'positive' ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                <span>{card.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-500">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.label}
                to={action.path}
              href={action.path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              <Link
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <action.icon size={20} className="text-blue-600" />
                <action.icon size={20} className={`text-${action.color}-600`} />
              </div>
              </Link>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Contact Inquiries</h2>
            <Link
              to="/admin/dashboard/contact-inquiries"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.contacts && recentActivity.contacts.length > 0 ? (
              recentActivity.contacts.slice(0, 5).map((contact, index) => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {contact.first_name} {contact.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'new' ? 'bg-green-100 text-green-800' :
                      contact.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center py-8 text-gray-500"
              >
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p>No recent contact inquiries</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Blog Posts</h2>
            <Link
              to="/admin/dashboard/blog"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.blogs && recentActivity.blogs.length > 0 ? (
              recentActivity.blogs.slice(0, 5).map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">By {post.author}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center py-8 text-gray-500"
              >
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p>No recent blog posts</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1.2s</div>
              <div className="text-sm text-gray-500">Avg Response Time</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">+15%</div>
              <div className="text-sm text-gray-500">Monthly Growth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;