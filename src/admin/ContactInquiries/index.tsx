import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Eye, Mail, Phone, Building, Calendar, FileText,
  X, MessageSquare, User, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

interface Contact {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone: string;
  project_type: string;
  budget: string;
  message: string;
  file_url: string;
  status: string;
  createdAt: string;
}

const ContactInquiries: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/contact-inquiries', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/dashboard/contact-inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchContacts();
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || contact.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-orange-100 text-orange-800';
      case 'replied':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
          <p className="text-gray-600">Manage contact form submissions and client inquiries</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span>New: {contacts.filter(c => c.status === 'new').length}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Replied: {contacts.filter(c => c.status === 'replied').length}</span>
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
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="new">New</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <motion.tr
                  key={contact._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {contact.first_name} {contact.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                        {contact.company && (
                          <div className="text-xs text-gray-400 flex items-center">
                            <Building size={12} className="mr-1" />
                            {contact.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {contact.project_type && (
                        <div className="text-sm font-medium text-gray-900">{contact.project_type}</div>
                      )}
                      {contact.budget && (
                        <div className="text-sm text-gray-600">Budget: {contact.budget}</div>
                      )}
                      <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {contact.message}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(contact.status)}
                      <select
                        value={contact.status}
                        onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusBadge(contact.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(contact)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Mail size={16} />
                        </a>
                      )}
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                          <Phone size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedContact && (
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedContact.first_name} {selectedContact.last_name}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedContact.email}</p>
                    </div>

                    {selectedContact.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedContact.phone}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedContact.company && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company</label>
                        <p className="text-gray-900">{selectedContact.company}</p>
                      </div>
                    )}

                    {selectedContact.project_type && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Project Type</label>
                        <p className="text-gray-900">{selectedContact.project_type}</p>
                      </div>
                    )}

                    {selectedContact.budget && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Budget</label>
                        <p className="text-gray-900">{selectedContact.budget}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {/* File Attachment */}
                {selectedContact.file_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Attachment</label>
                    <div className="mt-2">
                      <a
                        href={`http://localhost:5000${selectedContact.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FileText size={16} className="mr-2" />
                        View Attachment
                      </a>
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-2 flex space-x-2">
                    {['new', 'replied', 'closed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateContactStatus(selectedContact._id, status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedContact.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: Your inquiry about ${selectedContact.project_type || 'your project'}`}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail size={16} className="mr-2" />
                    Reply via Email
                  </a>
                  {selectedContact.phone && (
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone size={16} className="mr-2" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactInquiries;