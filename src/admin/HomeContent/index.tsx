import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, RefreshCw, Eye, Plus, Trash2, ArrowUp, ArrowDown,
  Home, TrendingUp, Users, Clock, Star, CheckCircle
} from 'lucide-react';
import { adminApi } from '../../utils/api';
import { authUtils } from '../../utils/auth';

const HomeContent: React.FC = () => {
  const [homeSettings, setHomeSettings] = useState<any>(null);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('numbers');

  const [edgeNumbers, setEdgeNumbers] = useState({
    projects_delivered: 50,
    client_satisfaction: 100,
    users_reached: "1M+",
    support_hours: "24/7"
  });

  const [selectedCaseStudies, setSelectedCaseStudies] = useState<string[]>([]);

  const canEdit = authUtils.hasEditorAccess();

  useEffect(() => {
    fetchHomeSettings();
  }, []);

  const fetchHomeSettings = async () => {
    try {
      console.log('Fetching home settings from admin...');
      setIsLoading(true);
      const response = await adminApi.getHomeSettings();
      console.log('Admin API response:', response);
      
      if (response.success && response.data) {
        console.log('Setting home settings:', response.data.homeSettings);
        setHomeSettings(response.data.homeSettings);
        setAvailableProjects(response.data.availableProjects || []);
        setFeaturedTestimonials(response.data.featuredTestimonials || []);
        
        if (response.data.homeSettings?.edge_numbers) {
          console.log('Setting edge numbers:', response.data.homeSettings.edge_numbers);
          setEdgeNumbers(response.data.homeSettings.edge_numbers);
        }
        
        if (response.data.homeSettings?.featured_case_studies) {
          setSelectedCaseStudies(response.data.homeSettings.featured_case_studies.map((cs: any) => cs.portfolio_id._id || cs.portfolio_id));
        }
      } else {
        console.error('Failed to fetch home settings:', response);
      }
    } catch (error) {
      console.error('Error fetching home settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNumbers = async () => {
    if (!canEdit) return;
    
    console.log('Saving edge numbers:', edgeNumbers);
    setIsSaving(true);
    try {
      const response = await adminApi.updateHomeSettings({
        edge_numbers: edgeNumbers
      });
      console.log('Save response:', response);
      
      if (response.success) {
        setHomeSettings(response.data.homeSettings);
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successDiv.textContent = 'Pixeloria Edge numbers updated successfully!';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 3000);
      } else {
        console.error('Failed to save:', response);
        alert('Failed to update numbers: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating numbers:', error);
      alert('Failed to update numbers');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCaseStudies = async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      const featured_case_studies = selectedCaseStudies.map((projectId, index) => ({
        portfolio_id: projectId,
        order: index + 1
      }));

      const response = await adminApi.updateHomeSettings({
        featured_case_studies
      });
      
      if (response.success) {
        setHomeSettings(response.data.homeSettings);
        alert('Featured case studies updated successfully!');
      }
    } catch (error) {
      console.error('Error updating case studies:', error);
      alert('Failed to update case studies');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCaseStudy = (projectId: string) => {
    if (!canEdit) return;
    
    if (selectedCaseStudies.includes(projectId)) {
      setSelectedCaseStudies(selectedCaseStudies.filter(id => id !== projectId));
    } else if (selectedCaseStudies.length < 4) {
      setSelectedCaseStudies([...selectedCaseStudies, projectId]);
    }
  };

  const moveCaseStudy = (projectId: string, direction: 'up' | 'down') => {
    if (!canEdit) return;
    
    const currentIndex = selectedCaseStudies.indexOf(projectId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= selectedCaseStudies.length) return;

    const newOrder = [...selectedCaseStudies];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    setSelectedCaseStudies(newOrder);
  };

  const tabs = [
    { id: 'numbers', label: 'Pixeloria Edge Numbers', icon: TrendingUp },
    { id: 'case-studies', label: 'Featured Case Studies', icon: Star },
    { id: 'testimonials', label: 'Voices that Trust', icon: Users }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading home content settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Page Content</h1>
          <p className="text-gray-600">Manage home page content and featured sections</p>
          {!canEdit && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ You have read-only access to this section
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchHomeSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Eye size={16} />
            <span>Preview Home</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Pixeloria Edge Numbers */}
          {activeTab === 'numbers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pixeloria Edge Numbers</h2>
                {canEdit && (
                  <button
                    onClick={handleSaveNumbers}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projects Delivered
                  </label>
                  <input
                    type="number"
                    value={edgeNumbers.projects_delivered}
                    onChange={(e) => setEdgeNumbers({ ...edgeNumbers, projects_delivered: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Satisfaction (%)
                  </label>
                  <input
                    type="number"
                    value={edgeNumbers.client_satisfaction}
                    onChange={(e) => setEdgeNumbers({ ...edgeNumbers, client_satisfaction: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Users Reached
                  </label>
                  <input
                    type="text"
                    value={edgeNumbers.users_reached}
                    onChange={(e) => setEdgeNumbers({ ...edgeNumbers, users_reached: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1M+"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Hours
                  </label>
                  <input
                    type="text"
                    value={edgeNumbers.support_hours}
                    onChange={(e) => setEdgeNumbers({ ...edgeNumbers, support_hours: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="24/7"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {edgeNumbers.projects_delivered.toString().includes('+') 
                        ? edgeNumbers.projects_delivered 
                        : `${edgeNumbers.projects_delivered}+`}
                    </div>
                    <div className="text-sm text-gray-600">Projects Delivered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {edgeNumbers.client_satisfaction.toString().includes('%')
                        ? edgeNumbers.client_satisfaction
                        : `${edgeNumbers.client_satisfaction}%`}
                    </div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{edgeNumbers.users_reached}</div>
                    <div className="text-sm text-gray-600">Users Reached</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{edgeNumbers.support_hours}</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured Case Studies */}
          {activeTab === 'case-studies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Featured Case Studies</h2>
                  <p className="text-sm text-gray-600">Select up to 4 portfolio projects to feature on the home page</p>
                </div>
                {canEdit && (
                  <button
                    onClick={handleSaveCaseStudies}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : 'Save Selection'}</span>
                  </button>
                )}
              </div>

              {/* Selected Case Studies */}
              {selectedCaseStudies.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Selected Case Studies ({selectedCaseStudies.length}/4)</h3>
                  <div className="space-y-3">
                    {selectedCaseStudies.map((projectId, index) => {
                      const project = availableProjects.find(p => p._id === projectId);
                      if (!project) return null;
                      
                      return (
                        <div key={projectId} className="flex items-center justify-between bg-white rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500">{project.category}</div>
                            </div>
                          </div>
                          {canEdit && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveCaseStudy(projectId, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                onClick={() => moveCaseStudy(projectId, 'down')}
                                disabled={index === selectedCaseStudies.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ArrowDown size={16} />
                              </button>
                              <button
                                onClick={() => toggleCaseStudy(projectId)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available Projects */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Available Portfolio Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableProjects.map((project) => (
                    <motion.div
                      key={project._id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedCaseStudies.includes(project._id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      } ${!canEdit ? 'cursor-not-allowed opacity-75' : ''}`}
                      onClick={() => canEdit && toggleCaseStudy(project._id)}
                      whileHover={canEdit ? { scale: 1.02 } : {}}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        {selectedCaseStudies.includes(project._id) && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{project.category}</p>
                      {selectedCaseStudies.includes(project._id) && (
                        <div className="mt-2 text-xs text-blue-600 font-medium">
                          Position: {selectedCaseStudies.indexOf(project._id) + 1}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {selectedCaseStudies.length >= 4 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Maximum of 4 case studies can be featured. Remove one to add another.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Testimonials Management */}
          {activeTab === 'testimonials' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Voices that Trust</h2>
                  <p className="text-sm text-gray-600">Testimonials are managed in the Testimonials section</p>
                </div>
                <a
                  href="/admin/dashboard/testimonials"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Star size={16} />
                  <span>Manage Testimonials</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredTestimonials.map((testimonial, index) => (
                  <div key={testimonial._id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.company}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">"{testimonial.quote}"</p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeContent;