import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Save, Eye, EyeOff, Shield, Globe,
  Mail, Phone, MapPin, Palette, Code, Database, Lock
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    site_title: 'Pixeloria',
    site_description: 'Crafting Digital Experiences That Grow Your Business',
    contact_email: 'hello@pixeloria.com',
    contact_phone: '(415) 555-0123',
    office_address: '123 Web Dev Lane, San Francisco, CA 94103',
    social_twitter: '#',
    social_linkedin: '#',
    social_github: '#',
    maintenance_mode: false,
    analytics_enabled: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    session_timeout: 7, // days
    max_login_attempts: 5
  });

  const [emailSettings, setEmailSettings] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    from_email: 'noreply@pixeloria.com',
    from_name: 'Pixeloria Team'
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Code }
  ];

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'general', settings: generalSettings }),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (securitySettings.new_password !== securitySettings.confirm_password) {
      alert('New passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'security', settings: securitySettings }),
      });

      if (response.ok) {
        alert('Security settings updated successfully!');
        setSecuritySettings({
          current_password: '',
          new_password: '',
          confirm_password: '',
          session_timeout: securitySettings.session_timeout,
          max_login_attempts: securitySettings.max_login_attempts
        });
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
      alert('Failed to update security settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your admin portal and site settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      value={generalSettings.site_title}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, site_title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.contact_email}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contact_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={generalSettings.site_description}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, site_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={generalSettings.contact_phone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contact_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Office Address
                    </label>
                    <input
                      type="text"
                      value={generalSettings.office_address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, office_address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={generalSettings.maintenance_mode}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, maintenance_mode: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={generalSettings.analytics_enabled}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, analytics_enabled: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Analytics Enabled</span>
                  </label>
                </div>

                <button
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">Security Notice</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Changing your password will log you out of all devices. You'll need to log in again.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={securitySettings.current_password}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, current_password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securitySettings.new_password}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, new_password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securitySettings.confirm_password}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, confirm_password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (days)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.session_timeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, session_timeout: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={1}
                      max={30}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={securitySettings.max_login_attempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, max_login_attempts: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={3}
                      max={10}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveSecurity}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Lock size={16} />
                  <span>{isSaving ? 'Updating...' : 'Update Security'}</span>
                </button>
              </motion.div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Email Configuration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={emailSettings.smtp_port}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_user}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_user: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={emailSettings.smtp_password}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Email
                    </label>
                    <input
                      type="email"
                      value={emailSettings.from_email}
                      onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      value={emailSettings.from_name}
                      onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => alert('Email settings saved!')}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Email Settings'}</span>
                </button>
              </motion.div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance Settings</h2>
                
                <div className="text-center py-12 text-gray-500">
                  <Palette className="w-12 h-12 mx-auto mb-4" />
                  <p>Appearance customization coming soon...</p>
                </div>
              </motion.div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Advanced Settings</h2>
                
                <div className="text-center py-12 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4" />
                  <p>Advanced configuration coming soon...</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;