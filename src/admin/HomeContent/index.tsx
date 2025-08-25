import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save, RefreshCw, Eye, ArrowUp, ArrowDown,
  Star, Users, TrendingUp, CheckCircle, Trash2
} from 'lucide-react';
import { adminApi } from '../../utils/api';
import { authUtils } from '../../utils/auth';

const HomeContent: React.FC = () => {
  const [homeSettings, setHomeSettings] = useState<any>(null);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('numbers');

  const [edgeNumbers, setEdgeNumbers] = useState({
    projects_delivered: 50,
    client_satisfaction: 99,
    users_reached: "1M+",
    support_hours: "24/7"
  });

  const [selectedCaseStudies, setSelectedCaseStudies] = useState<string[]>([]);
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<any[]>([]);

  const canEdit = authUtils.hasEditorAccess();

  useEffect(() => {
    fetchHomeSettings();
  }, []);

  const fetchHomeSettings = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching home settings...');
      const response = await adminApi.getHomeSettings();
      console.log('Home settings response:', response);
      
      if (response.success && response.data) {
        const settings = response.data.homeSettings || {};
        console.log('Home settings data:', settings);
        console.log('Available projects:', response.data.availableProjects);
        console.log('Featured testimonials:', response.data.featuredTestimonials);
        
        setHomeSettings(settings);
        setAvailableProjects(response.data.availableProjects || []);
        setAllTestimonials(response.data.featuredTestimonials || []);
        
        if (settings.edge_numbers) {
          setEdgeNumbers({ ...edgeNumbers, ...settings.edge_numbers });
        }
        
        if (settings.featured_case_studies && Array.isArray(settings.featured_case_studies)) {
          const caseStudyIds = settings.featured_case_studies
            .map((cs: any) => cs.portfolio_id?._id || cs.portfolio_id)
            .filter(Boolean);
          console.log('Case study IDs:', caseStudyIds);
          setSelectedCaseStudies(caseStudyIds);
        }
        
        if (settings.featured_testimonials && Array.isArray(settings.featured_testimonials)) {
          const testimonialIds = settings.featured_testimonials
            .map((t: any) => t.testimonial_id?._id || t.testimonial_id || t._id)
            .filter(Boolean);
          console.log('Featured testimonial IDs:', testimonialIds);
          setSelectedTestimonials(testimonialIds);
        }
      } else {
        console.error('Failed to fetch home settings:', response.error);
      }
    } catch (error) {
      console.error('Error fetching home settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNumbers = async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      const response = await adminApi.updateHomeSettings({
        edge_numbers: edgeNumbers
      });
      
      // FIXED: Added a check for `response.data` to prevent the TypeScript error.
      if (response.success && response.data) {
        setHomeSettings(response.data.homeSettings);
        alert('Pixeloria Edge numbers updated successfully!');
      } else {
        console.error('Failed to save:', response);
        alert('Failed to update numbers: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating numbers:', error);
      alert('An unexpected error occurred while updating numbers.');
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
      
      // FIXED: Added a check for `response.data` to prevent the TypeScript error.
      if (response.success && response.data) {
        setHomeSettings(response.data.homeSettings);
        alert('Featured case studies updated successfully!');
      } else {
        alert('Failed to update case studies: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating case studies:', error);
      alert('An unexpected error occurred while updating case studies.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTestimonials = async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      const featured_testimonials = selectedTestimonials.map((testimonialId, index) => ({
        testimonial_id: testimonialId,
        order: index + 1
      }));

      const response = await adminApi.updateHomeSettings({
        featured_testimonials
      });
      
      if (response.success && response.data) {
        setHomeSettings(response.data.homeSettings);
        alert('Featured testimonials updated successfully!');
      } else {
        alert('Failed to update testimonials: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating testimonials:', error);
      alert('An unexpected error occurred while updating testimonials.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTestimonial = (testimonialId: string) => {
    if (!canEdit) return;
    
    setSelectedTestimonials(prev => 
      prev.includes(testimonialId) 
        ? prev.filter(id => id !== testimonialId)
        : prev.length < 6 ? [...prev, testimonialId] : prev
    );
  };

  const moveTestimonial = (testimonialId: string, direction: 'up' | 'down') => {
    if (!canEdit) return;
    
    const currentIndex = selectedTestimonials.indexOf(testimonialId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= selectedTestimonials.length) return;

    const newOrder = [...selectedTestimonials];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    setSelectedTestimonials(newOrder);
  };

  const toggleCaseStudy = (projectId: string) => {
    if (!canEdit) return;
    
    setSelectedCaseStudies(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : prev.length < 4 ? [...prev, projectId] : prev
    );
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
  
  // ... rest of the component remains the same
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
          {activeTab === 'numbers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Projects Delivered</label>
                  <input
                    type="number"
                    value={edgeNumbers.projects_delivered}
                    onChange={(e) => setEdgeNumbers({ ...edgeNumbers, projects_delivered: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Satisfaction (%)</label>
                  <input
                    type="number"
                    value={edgeNumbers.client_satisfaction}
                    onChange={(e) => setEdgeNumbers({ ...edgeNumbers, client_satisfaction: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Users Reached</label>
                  <input
                    type="text"
                    value={edgeNumbers.users_reached}
                    onChange={(e) => setEdgeNumbers({ ...edgeNumbers, users_reached: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1M+"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Hours</label>
                  <input
                    type="text"
                    value={edgeNumbers.support_hours}
                    onChange={(e) => setEdgeNumbers({ ...edgeNumbers, support_hours: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 24/7"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'case-studies' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Featured Case Studies</h2>
                  <p className="text-sm text-gray-600">Select up to 4 portfolio projects to feature on the home page.</p>
                </div>
                {canEdit && (
                  <button
                    onClick={handleSaveCaseStudies}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : 'Save Selection'}</span>
                  </button>
                )}
              </div>
                
              {selectedCaseStudies.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Selected & Ordered ({selectedCaseStudies.length}/4)</h3>
                  <div className="space-y-3">
                    {selectedCaseStudies.map((projectId, index) => {
                      const project = availableProjects.find(p => p._id === projectId);
                      if (!project) return null;
                      return (
                        <div key={projectId} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500">{project.category}</div>
                            </div>
                          </div>
                          {canEdit && (
                            <div className="flex items-center space-x-1">
                              <button onClick={() => moveCaseStudy(projectId, 'up')} disabled={index === 0} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp size={16} /></button>
                              <button onClick={() => moveCaseStudy(projectId, 'down')} disabled={index === selectedCaseStudies.length - 1} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown size={16} /></button>
                              <button onClick={() => toggleCaseStudy(projectId)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
                
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Available Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableProjects.length > 0 ? availableProjects.map((project) => (
                    <motion.div
                      key={project._id}
                      onClick={() => canEdit && toggleCaseStudy(project._id)}
                      whileHover={canEdit ? { scale: 1.02 } : {}}
                      className={`border-2 rounded-xl p-4 transition-all duration-200 ${selectedCaseStudies.includes(project._id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'} ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
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
                    </motion.div>
                  )) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No portfolio projects available. Create some projects first to feature them here.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'testimonials' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Featured Testimonials</h2>
                        <p className="text-sm text-gray-600">Select up to 6 testimonials to feature on the home page.</p>
                    </div>
                    <div className="flex space-x-3">
                      {canEdit && (
                        <button
                          onClick={handleSaveTestimonials}
                          disabled={isSaving}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save size={16} />
                          <span>{isSaving ? 'Saving...' : 'Save Selection'}</span>
                        </button>
                      )}
                      <a href="/#/admin/dashboard/testimonials" className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                          <Star size={16} />
                          <span>Manage Testimonials</span>
                      </a>
                    </div>
                </div>
                
                {selectedTestimonials.length > 0 && (
                  <div className="bg-purple-50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Selected & Ordered ({selectedTestimonials.length}/6)</h3>
                    <div className="space-y-3">
                      {selectedTestimonials.map((testimonialId, index) => {
                        const testimonial = allTestimonials.find(t => t._id === testimonialId);
                        if (!testimonial) return null;
                        return (
                          <div key={testimonialId} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center text-purple-600 font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex items-center space-x-3">
                                <img src={testimonial.image_url || '/api/placeholder/32/32'} alt={testimonial.name} className="w-8 h-8 rounded-full object-cover" />
                                <div>
                                  <div className="font-medium text-gray-900">{testimonial.name}</div>
                                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                                </div>
                              </div>
                            </div>
                            {canEdit && (
                              <div className="flex items-center space-x-1">
                                <button onClick={() => moveTestimonial(testimonialId, 'up')} disabled={index === 0} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp size={16} /></button>
                                <button onClick={() => moveTestimonial(testimonialId, 'down')} disabled={index === selectedTestimonials.length - 1} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown size={16} /></button>
                                <button onClick={() => toggleTestimonial(testimonialId)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Available Testimonials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allTestimonials.length > 0 ? allTestimonials.map((testimonial) => (
                      <motion.div
                        key={testimonial._id}
                        onClick={() => canEdit && toggleTestimonial(testimonial._id)}
                        whileHover={canEdit ? { scale: 1.02 } : {}}
                        className={`border-2 rounded-xl p-4 transition-all duration-200 ${selectedTestimonials.includes(testimonial._id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-400'} ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <img src={testimonial.image_url || '/api/placeholder/40/40'} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                              <p className="text-sm text-gray-600">{testimonial.company}</p>
                            </div>
                          </div>
                          {selectedTestimonials.includes(testimonial._id) && (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <CheckCircle size={14} className="text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">"{testimonial.quote}"</p>
                      </motion.div>
                    )) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No testimonials available. Create some testimonials first to feature them here.</p>
                      </div>
                    )}
                  </div>
                </div>
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeContent;