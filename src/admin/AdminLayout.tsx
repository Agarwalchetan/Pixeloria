import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderOpen, FileText, FlaskRound as Flask, Settings as SettingsIcon, Star, Mail, Users, BarChart3, MessageSquare, LogOut, Menu, X, Code, Shield, Bell, Search, User, ChevronDown, Home } from 'lucide-react';
import { authUtils } from '../utils/auth';

// Role-based access control for sidebar items
const getRoleAccess = (userRole: string) => {
  const access = {
    admin: ['overview', 'portfolio', 'blog', 'labs', 'services', 'testimonials', 'contact-inquiries', 'newsletter', 'analytics', 'users', 'settings'],
    editor: ['overview', 'portfolio', 'blog', 'labs', 'services', 'testimonials', 'contact-inquiries', 'newsletter', 'analytics'],
    viewer: ['overview', 'portfolio', 'blog', 'labs', 'services', 'testimonials', 'contact-inquiries', 'newsletter', 'analytics']
  };
  
  return access[userRole as keyof typeof access] || [];
};

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin/dashboard/overview',
      description: 'Overview and statistics'
    },
    { 
      id: 'portfolio', 
      label: 'Portfolio', 
      icon: FolderOpen, 
      path: '/admin/dashboard/portfolio',
      description: 'Manage project portfolio'
    },
    { 
      id: 'blog', 
      label: 'Blog', 
      icon: FileText, 
      path: '/admin/dashboard/blog',
      description: 'Manage blog posts'
    },
    { 
      id: 'labs', 
      label: 'Labs', 
      icon: Flask, 
      path: '/admin/dashboard/labs',
      description: 'Experimental projects'
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: SettingsIcon, 
      path: '/admin/dashboard/services',
      description: 'Service offerings'
    },
    { 
      id: 'testimonials', 
      label: 'Testimonials', 
      icon: Star, 
      path: '/admin/dashboard/testimonials',
      description: 'Client testimonials'
    },
    { 
      id: 'contact-inquiries', 
      label: 'Contact Inquiries', 
      icon: MessageSquare, 
      path: '/admin/dashboard/contact-inquiries',
      description: 'Contact form submissions'
    },
    { 
      id: 'newsletter', 
      label: 'Newsletter', 
      icon: Mail, 
      path: '/admin/dashboard/newsletter',
      description: 'Newsletter subscribers'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/admin/dashboard/analytics',
      description: 'Site analytics'
    },
    { 
      id: 'users', 
      label: 'Admin Users', 
      icon: Users, 
      path: '/admin/dashboard/users',
      description: 'Manage admin users'
    },
    { 
      id: 'home-content', 
      label: 'Home Content', 
      icon: Home, 
      path: '/admin/dashboard/home-content',
      description: 'Manage home page content'
    },
    { 
      id: 'about-content', 
      label: 'About Content', 
      icon: User, 
      path: '/admin/dashboard/about-content',
      description: 'Manage about page content'
    },
  ];

  useEffect(() => {
    // Check authentication
    const user = authUtils.getUser();
    const role = authUtils.getUserRole();
    
    if (!authUtils.isAuthenticated() || !authUtils.isAdmin()) {
      navigate('/admin');
      return;
    }

    setAdminUser(user);
    setUserRole(role || '');
  }, [navigate]);

  const handleLogout = () => {
    authUtils.clearAuth();
    navigate('/admin');
  };

  const isActiveTab = (path: string) => {
    return location.pathname === path;
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative z-30 h-screen bg-white shadow-xl border-r border-gray-200 ${
          sidebarOpen ? 'w-80' : 'w-16'
        } transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <Code size={32} className="text-blue-600" />
              {sidebarOpen && (
                <div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Pixeloria
                  </span>
                  <div className="text-xs text-gray-500">Admin Portal</div>
                </div>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {sidebarItems.filter(item => getRoleAccess(userRole).includes(item.id)).map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActiveTab(item.path)
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{adminUser.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{adminUser.role}</div>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                  >
                    <Link
                      to="/"
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Home size={16} />
                      <span>Back to Site</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => isActiveTab(item.path))?.label || 'Admin Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {sidebarItems.find(item => isActiveTab(item.path))?.description || 'Manage your website content'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              
              <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{adminUser.name}</div>
                  <div className="text-gray-500">{adminUser.email}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;