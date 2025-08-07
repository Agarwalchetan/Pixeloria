import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Eye, ExternalLink, Code,
  X, Upload, Tag, Calendar, Globe, FlaskRound as Flask
} from 'lucide-react';

interface Lab {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  demo_url: string;
  source_url: string;
  image_url: string;
  status: string;
  createdAt: string;
}

const Labs: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    demo_url: '',
    source_url: '',
    status: 'published'
  });

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/labs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLabs(data.data.labs);
      }
    } catch (error) {
      console.error('Error fetching labs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });

      const url = editingLab 
        ? `http://localhost:5000/api/admin/dashboard/labs/${editingLab._id}`
        : 'http://localhost:5000/api/admin/dashboard/labs';

      const response = await fetch(url, {
        method: editingLab ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchLabs();
        setShowCreateModal(false);
        setEditingLab(null);
        setFormData({
          title: '',
          description: '',
          category: '',
          tags: '',
          demo_url: '',
          source_url: '',
          status: 'published'
        });
      }
    } catch (error) {
      console.error('Error saving lab:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lab project?')) return;

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/dashboard/labs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchLabs();
      }
    } catch (error) {
      console.error('Error deleting lab:', error);
    }
  };

  const handleEdit = (lab: Lab) => {
    setEditingLab(lab);
    setFormData({
      title: lab.title,
      description: lab.description,
      category: lab.category,
      tags: lab.tags.join(', '),
      demo_url: lab.demo_url,
      source_url: lab.source_url,
      status: lab.status
    });
    setShowCreateModal(true);
  };

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lab.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(labs.map(l => l.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Labs Management</h1>
          <p className="text-gray-600">Manage experimental projects and demos</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Lab Project</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search lab projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab, index) => (
          <motion.div
            key={lab._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {lab.image_url && (
              <div className="aspect-video relative">
                <img
                  src={`http://localhost:5000${lab.image_url}`}
                  alt={lab.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    lab.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lab.status}
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{lab.title}</h3>
                <Flask className="w-5 h-5 text-blue-600" />
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lab.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  {lab.category}
                </span>
                {lab.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {lab.demo_url && (
                    <a
                      href={lab.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="View Demo"
                    >
                      <Globe size={16} />
                    </a>
                  )}
                  {lab.source_url && (
                    <a
                      href={lab.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Source"
                    >
                      <Code size={16} />
                    </a>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(lab)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(lab._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingLab ? 'Edit Lab Project' : 'Create New Lab Project'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingLab(null);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., AI Tools"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the lab project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="AI, React, Experimental"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demo URL
                    </label>
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://demo.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source URL
                    </label>
                    <input
                      type="url"
                      value={formData.source_url}
                      onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload project screenshot</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="image"
                      />
                      <label
                        htmlFor="image"
                        className="mt-2 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingLab(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingLab ? 'Update Lab Project' : 'Create Lab Project'}
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

export default Labs;