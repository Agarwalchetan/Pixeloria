import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, FileText, Briefcase, Mail, Settings, LogOut, Plus,
  TrendingUp, Eye, Edit, Trash2, Search, Filter, Calendar, Award,
  Globe, ShoppingCart, Code, MessageSquare, Star, Clock, CheckCircle,
  X, Save, Upload, Image, Link, Tag, User, Shield, Key, AlertTriangle
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

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  read_time: number;
  status: 'draft' | 'published';
  image_url?: string;
  createdAt: string;
}

interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  tech_stack: string[];
  results: string[];
  link: string;
  status: 'draft' | 'published';
  images: string[];
  createdAt: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
  price_range: string;
  duration: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface LabProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  demo_url: string;
  source_url: string;
  image_url: string;
  status: 'draft' | 'published';
  createdAt: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'guest';
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

  // Data states
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [labs, setLabs] = useState<LabProject[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

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

  const fetchTabData = async (tab: string) => {
    try {
      const headers = getAuthHeaders();
      let url = '';
      
      switch (tab) {
        case 'contacts':
          url = 'http://localhost:5000/api/admin/contacts';
          break;
        case 'blogs':
          url = 'http://localhost:5000/api/blogs';
          break;
        case 'portfolio':
          url = 'http://localhost:5000/api/portfolio';
          break;
        case 'services':
          url = 'http://localhost:5000/api/services';
          break;
        case 'labs':
          url = 'http://localhost:5000/api/labs';
          break;
        case 'users':
          url = 'http://localhost:5000/api/admin/users';
          break;
        default:
          return;
      }

      const response = await fetch(url, { headers });
      const data = await response.json();

      if (data.success) {
        switch (tab) {
          case 'contacts':
            setContacts(data.data.contacts || []);
            break;
          case 'blogs':
            setBlogs(data.data.posts || []);
            break;
          case 'portfolio':
            setPortfolio(data.data.projects || []);
            break;
          case 'services':
            setServices(data.data.services || []);
            break;
          case 'labs':
            setLabs(data.data.labs || []);
            break;
          case 'users':
            setUsers(data.data.users || []);
            break;
        }
      }
    } catch (err) {
      console.error(`Error fetching ${tab} data:`, err);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'overview') {
      fetchTabData(tab);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const openModal = (type: 'create' | 'edit', item?: any) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const headers = getAuthHeaders();
      let url = '';
      let method = modalType === 'create' ? 'POST' : 'PATCH';

      switch (activeTab) {
        case 'blogs':
          url = modalType === 'create' 
            ? 'http://localhost:5000/api/blogs'
            : `http://localhost:5000/api/blogs/${editingItem._id}`;
          break;
        case 'portfolio':
          url = modalType === 'create'
            ? 'http://localhost:5000/api/portfolio'
            : `http://localhost:5000/api/portfolio/${editingItem._id}`;
          break;
        case 'services':
          url = modalType === 'create'
            ? 'http://localhost:5000/api/services'
            : `http://localhost:5000/api/services/${editingItem._id}`;
          break;
        case 'labs':
          url = modalType === 'create'
            ? 'http://localhost:5000/api/labs'
            : `http://localhost:5000/api/labs/${editingItem._id}`;
          break;
        case 'users':
          if (modalType === 'create') {
            url = 'http://localhost:5000/api/auth/register';
            method = 'POST';
          } else {
            url = `http://localhost:5000/api/admin/users/${editingItem._id}`;
            method = 'PATCH';
          }
          break;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        closeModal();
        fetchTabData(activeTab);
        fetchDashboardData(); // Refresh stats
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const headers = getAuthHeaders();
      let url = '';

      switch (activeTab) {
        case 'blogs':
          url = `http://localhost:5000/api/blogs/${id}`;
          break;
        case 'portfolio':
          url = `http://localhost:5000/api/portfolio/${id}`;
          break;
        case 'services':
          url = `http://localhost:5000/api/services/${id}`;
          break;
        case 'labs':
          url = `http://localhost:5000/api/labs/${id}`;
          break;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        fetchTabData(activeTab);
        fetchDashboardData(); // Refresh stats
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const updateContactStatus = async (contactId: string, status: string) => {
    try {
      const headers = getAuthHeaders();
      
      const response = await fetch(`http://localhost:5000/api/admin/contacts/${contactId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
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
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'blogs', label: 'Blog Posts', icon: FileText },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'labs', label: 'Labs', icon: Code },
    { id: 'users', label: 'Admin Users', icon: Users },
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

  const renderFormFields = () => {
    switch (activeTab) {
      case 'blogs':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Read Time (minutes)</label>
                <input
                  type="number"
                  value={formData.read_time || ''}
                  onChange={(e) => setFormData({...formData, read_time: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map((t: string) => t.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case 'portfolio':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                <input
                  type="url"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.tech_stack) ? formData.tech_stack.join(', ') : formData.tech_stack || ''}
                onChange={(e) => setFormData({...formData, tech_stack: e.target.value.split(',').map((t: string) => t.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.results) ? formData.results.join(', ') : formData.results || ''}
                onChange={(e) => setFormData({...formData, results: e.target.value.split(',').map((r: string) => r.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case 'services':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <input
                  type="text"
                  value={formData.price_range || ''}
                  onChange={(e) => setFormData({...formData, price_range: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features || ''}
                onChange={(e) => setFormData({...formData, features: e.target.value.split(',').map((f: string) => f.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case 'labs':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Demo URL</label>
                <input
                  type="url"
                  value={formData.demo_url || ''}
                  onChange={(e) => setFormData({...formData, demo_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source URL</label>
                <input
                  type="url"
                  value={formData.source_url || ''}
                  onChange={(e) => setFormData({...formData, source_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </>
        );

      case 'users':
        return (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">
                  <strong>Admin User Management:</strong> Only existing admin users can create new admin accounts. 
                  Use this feature carefully and only grant admin access to trusted individuals.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            {modalType === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 6 characters required</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={formData.role || 'admin'}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="guest">Guest</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

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
                  onClick={() => handleTabChange(item.id)}
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

          {/* Content Management Tabs */}
          {activeTab !== 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab} Management</h2>
                {activeTab !== 'contacts' && (
                  <button
                    onClick={() => openModal('create')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>
              </div>

              {/* Content Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  {activeTab === 'contacts' && (
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
                        {contacts.filter(contact => 
                          contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((contact) => (
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
                  )}

                  {/* Generic content table for other tabs */}
                  {activeTab !== 'contacts' && (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(() => {
                          let data: any[] = [];
                          switch (activeTab) {
                            case 'blogs': data = blogs; break;
                            case 'portfolio': data = portfolio; break;
                            case 'services': data = services; break;
                            case 'labs': data = labs; break;
                            case 'users': data = users; break;
                          }
                          
                          return data.filter(item => 
                            (item.title || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
                          ).map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.title || item.name}
                                </div>
                                {activeTab === 'users' && (
                                  <div className="text-sm text-gray-500">{item.email}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.category || item.role || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status || item.role)}`}>
                                  {item.status || item.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(item.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openModal('edit', item)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  {activeTab !== 'users' && (
                                    <button
                                      onClick={() => handleDelete(item._id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {modalType === 'create' ? 'Create New' : 'Edit'} {activeTab.slice(0, -1)}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderFormFields()}

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;