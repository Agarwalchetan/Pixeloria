import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Star, User, Building,
  X, Upload, Quote
} from 'lucide-react';

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
  status: string;
  createdAt: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    industry: '',
    image_url: '',
    quote: '',
    full_quote: '',
    rating: 5,
    project_type: '',
    results: '',
    status: 'published'
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/testimonials', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.data.testimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      
      const testimonialData = {
        ...formData,
        results: formData.results.split(',').map(r => r.trim()).filter(r => r),
        rating: parseInt(formData.rating.toString())
      };

      const url = editingTestimonial 
        ? `http://localhost:5000/api/admin/dashboard/testimonials/${editingTestimonial._id}`
        : 'http://localhost:5000/api/admin/dashboard/testimonials';

      const response = await fetch(url, {
        method: editingTestimonial ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      if (response.ok) {
        await fetchTestimonials();
        setShowCreateModal(false);
        setEditingTestimonial(null);
        setFormData({
          name: '',
          role: '',
          company: '',
          industry: '',
          image_url: '',
          quote: '',
          full_quote: '',
          rating: 5,
          project_type: '',
          results: '',
          status: 'published'
        });
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/dashboard/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      industry: testimonial.industry,
      image_url: testimonial.image_url,
      quote: testimonial.quote,
      full_quote: testimonial.full_quote,
      rating: testimonial.rating,
      project_type: testimonial.project_type,
      results: testimonial.results.join(', '),
      status: testimonial.status
    });
    setShowCreateModal(true);
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || testimonial.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = ['All', ...new Set(testimonials.map(t => t.industry))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600">Manage client testimonials and reviews</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {testimonial.image_url ? (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">({testimonial.rating}/5)</span>
              </div>

              <blockquote className="text-gray-700 text-sm mb-4 line-clamp-3">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {testimonial.industry}
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {testimonial.project_type}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  testimonial.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {testimonial.status}
                </span>
              </div>

              {testimonial.results.length > 0 && (
                <div className="text-xs text-green-600 font-medium">
                  Results: {testimonial.results.join(', ')}
                </div>
              )}
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
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingTestimonial(null);
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
                      Client Name
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
                      Role/Position
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="CEO, Founder, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SaaS, E-Commerce, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Quote
                  </label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief testimonial quote..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Quote (Optional)
                  </label>
                  <textarea
                    value={formData.full_quote}
                    onChange={(e) => setFormData({ ...formData, full_quote: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed testimonial..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <input
                      type="text"
                      value={formData.project_type}
                      onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Web App, E-Commerce, etc."
                    />
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Results (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+150% conversion rate, 99.9% uptime"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingTestimonial(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
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

export default Testimonials;