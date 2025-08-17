import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Shield, User, Mail,
  X, AlertTriangle, Crown, Users as UsersIcon, CheckCircle,
  Eye, Settings, UserCheck
} from 'lucide-react';
import { adminApi } from '../../utils/api';
import { authUtils } from '../../utils/auth';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    setCurrentUserRole(authUtils.getUserRole() || '');
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      if (response.success && response.data) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    
    try {
      if (editingUser) {
        // Update existing user
        const response = await adminApi.updateUser(editingUser._id, {
          name: formData.name,
          email: formData.email,
          role: formData.role
        });

        if (response.success) {
          await fetchUsers();
          setShowCreateModal(false);
          setEditingUser(null);
          setSubmitStatus('success');
          setSubmitMessage('User updated successfully');
        }
      } else {
        // Create new user
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
          await fetchUsers();
          setShowCreateModal(false);
          setSubmitStatus('success');
          setSubmitMessage('Admin user created successfully');
        } else {
          throw new Error(data.message || 'Failed to create user');
        }
      }

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'viewer'
      });
    } catch (error) {
      console.error('Error saving user:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await adminApi.deleteUser(id);
      if (response.success) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowCreateModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-red-600" />;
      case 'editor':
        return <Settings className="w-4 h-4 text-blue-600" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'client':
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return <UsersIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'viewer':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'client':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full access to all features including user management';
      case 'editor':
        return 'Can create, edit, and delete content but cannot manage users';
      case 'viewer':
        return 'Read-only access to view all content and analytics';
      case 'client':
        return 'Limited access for client portal features';
      default:
        return 'Standard user access';
    }
  };

  const canCreateRole = (targetRole: string) => {
    // Only admins can create other admins
    if (targetRole === 'admin') {
      return currentUserRole === 'admin';
    }
    // Admins can create any role, editors can create viewers
    return currentUserRole === 'admin' || (currentUserRole === 'editor' && targetRole === 'viewer');
  };

  const canEditUser = (user: AdminUser) => {
    // Admins can edit anyone except themselves if they're the last admin
    if (currentUserRole === 'admin') {
      if (user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
        return false; // Can't edit the last admin
      }
      return true;
    }
    // Editors can only edit viewers
    if (currentUserRole === 'editor') {
      return user.role === 'viewer';
    }
    return false;
  };

  const canDeleteUser = (user: AdminUser) => {
    // Can't delete yourself
    const currentUser = authUtils.getUser();
    if (currentUser?.id === user._id) return false;
    
    // Only admins can delete other admins
    if (user.role === 'admin') {
      return currentUserRole === 'admin' && users.filter(u => u.role === 'admin').length > 1;
    }
    
    // Admins can delete anyone, editors can delete viewers
    return currentUserRole === 'admin' || (currentUserRole === 'editor' && user.role === 'viewer');
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'editor', label: 'Editor', description: 'Can manage content but not users' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access to admin portal' }
  ];

  const availableRoles = roleOptions.filter(role => canCreateRole(role.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage admin portal users and their access levels</p>
        </div>
        {(currentUserRole === 'admin' || currentUserRole === 'editor') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Create New User</span>
          </button>
        )}
      </div>

      {/* Role Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Crown className="w-8 h-8 text-red-600" />
            <h3 className="font-bold text-red-800">Admin</h3>
          </div>
          <p className="text-sm text-red-700">
            Full access to all features including user management, settings, and all content operations.
          </p>
          <div className="mt-3 text-xs text-red-600">
            Count: {users.filter(u => u.role === 'admin').length}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-blue-800">Editor</h3>
          </div>
          <p className="text-sm text-blue-700">
            Can create, edit, and delete content (portfolio, blog, services, labs) but cannot manage users or settings.
          </p>
          <div className="mt-3 text-xs text-blue-600">
            Count: {users.filter(u => u.role === 'editor').length}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Eye className="w-8 h-8 text-green-600" />
            <h3 className="font-bold text-green-800">Viewer</h3>
          </div>
          <p className="text-sm text-green-700">
            Read-only access to view all content, analytics, and contact inquiries. Cannot make any changes.
          </p>
          <div className="mt-3 text-xs text-green-600">
            Count: {users.filter(u => u.role === 'viewer').length}
          </div>
        </div>
      </div>

      {/* Current User Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <UserCheck className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Your Access Level</h3>
            <p className="text-sm text-gray-600">
              You are logged in as <span className="font-medium text-blue-600">{currentUserRole}</span> - {getRoleDescription(currentUserRole)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {getRoleIcon(user.role)}
                      <div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">
                          {getRoleDescription(user.role)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {canEditUser(user) && (
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit user"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {canDeleteUser(user) && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      {!canEditUser(user) && !canDeleteUser(user) && (
                        <span className="text-xs text-gray-400 px-2 py-1">No actions available</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingUser ? 'Edit User' : 'Create New User'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingUser(null);
                      setSubmitStatus('idle');
                      setSubmitMessage('');
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {!editingUser && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800">Creating New Admin Portal User</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          This will create a new user with access to the admin portal. Choose the appropriate role based on the access level needed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={6}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role & Access Level
                  </label>
                  <div className="space-y-3">
                    {roleOptions.map((role) => (
                      <label
                        key={role.value}
                        className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.role === role.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!canCreateRole(role.value) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="mt-1 mr-3"
                          disabled={!canCreateRole(role.value)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getRoleIcon(role.value)}
                            <span className="font-medium text-gray-900">{role.label}</span>
                            {!canCreateRole(role.value) && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                No Permission
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {currentUserRole !== 'admin' && (
                    <p className="text-xs text-gray-500 mt-2">
                      As an {currentUserRole}, you can only create users with lower or equal access levels.
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="flex items-center text-green-600 text-sm mr-4">
                      <CheckCircle size={16} className="mr-2" />
                      {submitMessage}
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="flex items-center text-red-600 text-sm mr-4">
                      <AlertTriangle size={16} className="mr-2" />
                      {submitMessage}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingUser(null);
                      setSubmitStatus('idle');
                      setSubmitMessage('');
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (formData.role && !canCreateRole(formData.role))}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                      isSubmitting || (formData.role && !canCreateRole(formData.role)) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingUser ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingUser ? 'Update User' : 'Create User'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;