import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, FileText, Briefcase, Mail, Settings, LogOut, Plus,
  TrendingUp, Eye, Edit, Trash2, Search, Filter, Calendar, Award,
  Globe, ShoppingCart, Code, MessageSquare, Star, Clock, CheckCircle,
  X, Save, Upload, Image, Link, Tag, User, Shield, Key, AlertTriangle,
  Send, Download, PieChart, Activity, Zap, Heart, Coffee, Beaker,
  Palette, Database, CreditCard, Phone, MapPin, ExternalLink
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
  phone?: string;
  project_type?: string;
  budget?: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  file_url?: string;
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

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  image_url: string;
  quote: string;
  full_quote: string;
  rating: number;
  project_type: string;
  results: string[];
  status: 'draft' | 'published';
  createdAt: string;
}

interface NewsletterSubscriber {
  _id: string;
  email: string;
  subscription_date: string;
  verified: boolean;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'guest';
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newsletter, setNewsletter] = useState<NewsletterSubscriber[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
      const headers = getAuthHeaders();
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard', { headers });
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
        case 'testimonials':
          url = 'http://localhost:5000/api/admin/testimonials';
          break;
        case 'newsletter':
          url = 'http://localhost:5000/api/admin/newsletter';
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
          case 'testimonials':
            setTestimonials(data.data.testimonials || []);
            break;
          case 'newsletter':
            setNewsletter(data.data.subscribers || []);
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
    setSearchTerm('');
    setSelectedItems([]);
    if (tab !== 'dashboard') {
      fetchTabData(tab);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const openModal = (type: 'create' | 'edit' | 'view', item?: any) => {
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
        case 'testimonials':
          url = modalType === 'create'
            ? 'http://localhost:5000/api/admin/testimonials'
            : `http://localhost:5000/api/admin/testimonials/${editingItem._id}`;
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
        case 'testimonials':
          url = `http://localhost:5000/api/admin/testimonials/${id}`;
          break;
        case 'users':
          url = `http://localhost:5000/api/admin/users/${id}`;
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

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) return;

    try {
      const headers = getAuthHeaders();
      
      const response = await fetch('http://localhost:5000/api/admin/bulk-delete', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: activeTab,
          ids: selectedItems
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedItems([]);
        fetchTabData(activeTab);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
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

  const sendNewsletterEmail = async (subject: string, content: string) => {
    try {
      const headers = getAuthHeaders();
      
      const response = await fetch('http://localhost:5000/api/admin/newsletter/send', {
        method: 'POST',
        headers,
        body: JSON.stringify({ subject, content }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Newsletter sent successfully!');
      }
    } catch (err) {
      console.error('Error sending newsletter:', err);
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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, description: 'Manage Projects' },
    { id: 'blogs', label: 'Blog Posts', icon: FileText, description: 'Content Management' },
    { id: 'labs', label: 'Labs', icon: Beaker, description: 'Experimental Projects' },
    { id: 'services', label: 'Services', icon: Settings, description: 'Service Offerings' },
    { id: 'testimonials', label: 'Testimonials', icon: Star, description: 'Client Feedback' },
    { id: 'contacts', label: 'Contact Inquiries', icon: Mail, description: 'Customer Messages' },
    { id: 'newsletter', label: 'Newsletter', icon: Send, description: 'Email Subscribers' },
    { id: 'users', label: 'Admin Users', icon: Users, description: 'User Management' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, description: 'Site Analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Site Configuration' },
  ];

  const statCards = [
    { label: 'Portfolio Projects', value: stats.portfolio, icon: Briefcase, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'from-green-500 to-green-600', change: '+8%' },
    { label: 'Contact Submissions', value: stats.contacts, icon: Mail, color: 'from-purple-500 to-purple-600', change: '+25%' },
    { label: 'Services', value: stats.services, icon: Settings, color: 'from-orange-500 to-orange-600', change: '+5%' },
    { label: 'Lab Projects', value: stats.labs, icon: Beaker, color: 'from-pink-500 to-pink-600', change: '+15%' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-indigo-500 to-indigo-600', change: '+3%' },
    { label: 'Newsletter Subscribers', value: stats.newsletter, icon: TrendingUp, color: 'from-teal-500 to-teal-600', change: '+18%' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, color: 'from-yellow-500 to-yellow-600', change: '+10%' },
  ];

  const renderFormFields = () => {
    switch (activeTab) {
      case 'blogs':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
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
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="eCommerce">eCommerce</option>
                  <option value="Tech Tools">Tech Tools</option>
                  <option value="Tech Trends">Tech Trends</option>
                  <option value="Pixeloria News">Pixeloria News</option>
                </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://images.pexels.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the blog post..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full blog post content..."
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
                placeholder="react, javascript, tutorial"
              />
            </div>
          </>
        );

      case 'portfolio':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
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
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Web Application">Web Application</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Website">Website</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="E-Learning">E-Learning</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed project description..."
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
                  placeholder="https://project-demo.com"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.images) ? formData.images.join(', ') : formData.images || ''}
                onChange={(e) => setFormData({...formData, images: e.target.value.split(',').map((img: string) => img.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://images.pexels.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.tech_stack) ? formData.tech_stack.join(', ') : formData.tech_stack || ''}
                onChange={(e) => setFormData({...formData, tech_stack: e.target.value.split(',').map((t: string) => t.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.results) ? formData.results.join(', ') : formData.results || ''}
                onChange={(e) => setFormData({...formData, results: e.target.value.split(',').map((r: string) => r.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50% faster load times, 35% increase in conversions"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map((t: string) => t.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="featured, web-app, react"
              />
            </div>
          </>
        );

      case 'services':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
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
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Development">Development</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed service description..."
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
                  placeholder="$5,000 - $15,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="4-6 weeks"
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
                placeholder="Custom Design, Mobile Responsive, SEO Optimized"
              />
            </div>
          </>
        );

      case 'labs':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
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
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="AI Tools">AI Tools</option>
                  <option value="Development">Development</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Design">Design</option>
                  <option value="Experimental">Experimental</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What does this lab project do?"
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
                  placeholder="https://demo.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source URL</label>
                <input
                  type="url"
                  value={formData.source_url || ''}
                  onChange={(e) => setFormData({...formData, source_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/..."
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
                  placeholder="https://images.pexels.com/..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map((t: string) => t.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ai, experimental, tool"
              />
            </div>
          </>
        );

      case 'testimonials':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CEO, Founder, CTO"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Industry</option>
                  <option value="SaaS">SaaS</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Image URL</label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://images.pexels.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Quote *</label>
              <textarea
                value={formData.quote || ''}
                onChange={(e) => setFormData({...formData, quote: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief testimonial quote for cards..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Quote</label>
              <textarea
                value={formData.full_quote || ''}
                onChange={(e) => setFormData({...formData, full_quote: e.target.value})}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed testimonial for full display..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <input
                  type="text"
                  value={formData.project_type || ''}
                  onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SaaS Platform, E-Commerce Store"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'published'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.results) ? formData.results.join(', ') : formData.results || ''}
                onChange={(e) => setFormData({...formData, results: e.target.value.split(',').map((r: string) => r.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+150% conversion rate, Bank-grade security"
              />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
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
              <p className="text-sm text-gray-500 mt-1">
                Admin: Full access | Client: Limited access | Guest: View only
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'New Blog Post', tab: 'blogs', icon: FileText, color: 'from-green-500 to-green-600' },
                  { label: 'Add Portfolio', tab: 'portfolio', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
                  { label: 'Create Service', tab: 'services', icon: Settings, color: 'from-purple-500 to-purple-600' },
                  { label: 'New Lab Project', tab: 'labs', icon: Beaker, color: 'from-pink-500 to-pink-600' },
                ].map((action, index) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      setActiveTab(action.tab);
                      openModal('create');
                    }}
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-center group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{action.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  {[
                    { label: 'API Status', status: 'Operational', color: 'text-green-600' },
                    { label: 'Database', status: 'Connected', color: 'text-green-600' },
                    { label: 'Email Service', status: 'Active', color: 'text-green-600' },
                    { label: 'File Storage', status: 'Available', color: 'text-green-600' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.label}</span>
                      <span className={`font-medium ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12,543</div>
                  <div className="text-sm text-gray-600">Total Page Views</div>
                  <div className="text-xs text-green-600 mt-1">+15% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2,847</div>
                  <div className="text-sm text-gray-600">Lab Tool Usage</div>
                  <div className="text-xs text-green-600 mt-1">+22% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">1,234</div>
                  <div className="text-sm text-gray-600">Cost Calculator Uses</div>
                  <div className="text-xs text-green-600 mt-1">+8% this month</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Lab Tools</h3>
              <div className="space-y-3">
                {[
                  { name: 'AI Color Generator', usage: 95, icon: '🎨' },
                  { name: 'Neural Network Viz', usage: 88, icon: '🧠' },
                  { name: 'Animation Tester', usage: 82, icon: '⚡' },
                  { name: 'Code Playground', usage: 75, icon: '💻' },
                ].map((tool, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{tool.icon}</span>
                      <span className="font-medium text-gray-900">{tool.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${tool.usage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{tool.usage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Configuration</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                    <input
                      type="text"
                      defaultValue="Pixeloria"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="hello@pixeloria.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                  <textarea
                    defaultValue="Crafting Digital Experiences That Grow Your Business"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">Enable Analytics Tracking</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Maintenance Mode</span>
                  </label>
                </div>
                <button className="btn-primary">Save Settings</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="btn-primary">Update Password</button>
              </div>
            </div>
          </div>
        );

      default:
        // Generic content table for other tabs
        const getCurrentData = () => {
          switch (activeTab) {
            case 'contacts': return contacts;
            case 'blogs': return blogs;
            case 'portfolio': return portfolio;
            case 'services': return services;
            case 'labs': return labs;
            case 'testimonials': return testimonials;
            case 'newsletter': return newsletter;
            case 'users': return users;
            default: return [];
          }
        };

        const filteredData = getCurrentData().filter((item: any) => 
          (item.title || item.name || item.first_name || item.email || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete Selected ({selectedItems.length})</span>
                  </button>
                )}
              </div>
              
              {activeTab !== 'contacts' && activeTab !== 'newsletter' && activeTab !== 'analytics' && activeTab !== 'settings' && (
                <button
                  onClick={() => openModal('create')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {activeTab !== 'contacts' && activeTab !== 'newsletter' && (
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(filteredData.map((item: any) => item._id));
                              } else {
                                setSelectedItems([]);
                              }
                            }}
                            checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                          />
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {activeTab === 'contacts' ? 'Contact' : 
                         activeTab === 'newsletter' ? 'Email' :
                         activeTab === 'users' ? 'User' : 'Title'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {activeTab === 'contacts' ? 'Company' :
                         activeTab === 'newsletter' ? 'Subscribed' :
                         activeTab === 'users' ? 'Role' : 'Category'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {activeTab === 'contacts' ? 'Project Type' :
                         activeTab === 'testimonials' ? 'Rating' : 'Status'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item: any) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        {activeTab !== 'contacts' && activeTab !== 'newsletter' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([...selectedItems, item._id]);
                                } else {
                                  setSelectedItems(selectedItems.filter(id => id !== item._id));
                                }
                              }}
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {activeTab === 'contacts' ? `${item.first_name} ${item.last_name}` :
                               activeTab === 'newsletter' ? item.email :
                               activeTab === 'users' ? item.name :
                               item.title}
                            </div>
                            {activeTab === 'contacts' && (
                              <div className="text-sm text-gray-500">{item.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {activeTab === 'contacts' ? (item.company || '-') :
                           activeTab === 'newsletter' ? formatDate(item.subscription_date) :
                           activeTab === 'users' ? item.role :
                           item.category || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {activeTab === 'contacts' ? (item.project_type || '-') :
                           activeTab === 'testimonials' ? (
                             <div className="flex items-center">
                               {[...Array(5)].map((_, i) => (
                                 <Star
                                   key={i}
                                   size={14}
                                   className={i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                 />
                               ))}
                             </div>
                           ) : (
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status || item.role)}`}>
                               {item.status || item.role}
                             </span>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.createdAt || item.subscription_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {activeTab === 'contacts' ? (
                              <>
                                <button
                                  onClick={() => openModal('view', item)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                                <select
                                  value={item.status}
                                  onChange={(e) => updateContactStatus(item._id, e.target.value)}
                                  className="text-xs border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="new">New</option>
                                  <option value="replied">Replied</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </>
                            ) : activeTab === 'newsletter' ? (
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Remove Subscriber"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => openModal('edit', item)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pixeloria Admin</h1>
                <p className="text-sm text-gray-600">Complete content management system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, Admin
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
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <nav className="p-6">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                  {activeTab === item.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </motion.button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
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
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {modalType === 'create' ? 'Create New' : 
                     modalType === 'edit' ? 'Edit' : 'View'} {activeTab.slice(0, -1)}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {modalType === 'view' && activeTab === 'contacts' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {editingItem?.first_name} {editingItem?.last_name}</p>
                          <p><strong>Email:</strong> {editingItem?.email}</p>
                          <p><strong>Company:</strong> {editingItem?.company || 'Not provided'}</p>
                          <p><strong>Phone:</strong> {editingItem?.phone || 'Not provided'}</p>
                          <p><strong>Project Type:</strong> {editingItem?.project_type || 'Not specified'}</p>
                          <p><strong>Budget:</strong> {editingItem?.budget || 'Not specified'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Message</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{editingItem?.message}</p>
                        </div>
                        {editingItem?.file_url && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">Attachment</h5>
                            <a
                              href={editingItem.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                            >
                              <ExternalLink size={14} className="mr-1" />
                              View Attachment
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {renderFormFields()}

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;