import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Calculator, DollarSign,
  X, Save, Eye, Download, Settings, ArrowUp, ArrowDown,
  FileText, BarChart3, TrendingUp, Clock, Zap
} from 'lucide-react';
import { calculatorApi } from '../../utils/api';
import { authUtils } from '../../utils/auth';

interface CalculatorSubmission {
  _id: string;
  projectType: string;
  pages: number;
  features: string[];
  designComplexity: string;
  timeline: string;
  contactInfo: {
    name: string;
    email: string;
    company?: string;
  };
  estimate: {
    totalCost: number;
    timeline: string;
    breakdown: any[];
  };
  status: string;
  createdAt: string;
}

interface ProjectType {
  _id?: string;
  id: string;
  label: string;
  description: string;
  baseCost: number;
  timeline: number;
  popular: boolean;
  status: string;
}

interface Feature {
  _id?: string;
  id: string;
  label: string;
  description: string;
  cost: number;
  category: string;
  status: string;
}

interface DesignOption {
  _id?: string;
  id: string;
  label: string;
  description: string;
  cost: number;
  multiplier: number;
  popular: boolean;
  status: string;
}

interface TimelineOption {
  _id?: string;
  id: string;
  label: string;
  description: string;
  multiplier: number;
  weeks: number;
  status: string;
}

const Calculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState<CalculatorSubmission[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [designOptions, setDesignOptions] = useState<DesignOption[]>([]);
  const [timelineOptions, setTimelineOptions] = useState<TimelineOption[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'projectType' | 'feature' | 'design' | 'timeline'>('projectType');

  const [formData, setFormData] = useState<any>({});

  const canEdit = authUtils.hasEditorAccess();

  const tabs = [
    { id: 'submissions', label: 'Calculator Submissions', icon: FileText },
    { id: 'project-types', label: 'Project Types', icon: Settings },
    { id: 'features', label: 'Features & Add-ons', icon: Plus },
    { id: 'design-options', label: 'Design Options', icon: Eye },
    { id: 'timeline-options', label: 'Timeline Options', icon: Clock },
    { id: 'analytics', label: 'Calculator Analytics', icon: BarChart3 }
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchSubmissions(),
        fetchProjectTypes(),
        fetchFeatures(),
        fetchDesignOptions(),
        fetchTimelineOptions()
      ]);
    } catch (error) {
      console.error('Error fetching calculator data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await calculatorApi.getSubmissions();
      if (response.success && response.data) {
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const fetchProjectTypes = async () => {
    try {
      const response = await calculatorApi.getProjectTypes();
      if (response.success && response.data) {
        setProjectTypes(response.data.projectTypes);
      }
    } catch (error) {
      console.error('Error fetching project types:', error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await calculatorApi.getFeatures();
      if (response.success && response.data) {
        setFeatures(response.data.features);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const fetchDesignOptions = async () => {
    try {
      const response = await calculatorApi.getDesignOptions();
      if (response.success && response.data) {
        setDesignOptions(response.data.designOptions);
      }
    } catch (error) {
      console.error('Error fetching design options:', error);
    }
  };

  const fetchTimelineOptions = async () => {
    try {
      const response = await calculatorApi.getTimelineOptions();
      if (response.success && response.data) {
        setTimelineOptions(response.data.timelineOptions);
      }
    } catch (error) {
      console.error('Error fetching timeline options:', error);
    }
  };

  const handleExportPDF = async (submissionId: string) => {
    try {
      const response = await calculatorApi.exportPDF(submissionId);
      if (response.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = `http://localhost:5000${response.data.pdfUrl}`;
        link.download = `project-estimate-${submissionId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    try {
      let response;
      switch (modalType) {
        case 'projectType':
          response = editingItem 
            ? await calculatorApi.updateProjectType(editingItem._id, formData)
            : await calculatorApi.createProjectType(formData);
          break;
        case 'feature':
          response = editingItem 
            ? await calculatorApi.updateFeature(editingItem._id, formData)
            : await calculatorApi.createFeature(formData);
          break;
        case 'design':
          response = editingItem 
            ? await calculatorApi.updateDesignOption(editingItem._id, formData)
            : await calculatorApi.createDesignOption(formData);
          break;
        case 'timeline':
          response = editingItem 
            ? await calculatorApi.updateTimelineOption(editingItem._id, formData)
            : await calculatorApi.createTimelineOption(formData);
          break;
      }

      if (response?.success) {
        await fetchAllData();
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!canEdit || !confirm('Are you sure you want to delete this item?')) return;

    try {
      let response;
      switch (type) {
        case 'projectType':
          response = await calculatorApi.deleteProjectType(id);
          break;
        case 'feature':
          response = await calculatorApi.deleteFeature(id);
          break;
        case 'design':
          response = await calculatorApi.deleteDesignOption(id);
          break;
        case 'timeline':
          response = await calculatorApi.deleteTimelineOption(id);
          break;
      }

      if (response?.success) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openModal = (type: 'projectType' | 'feature' | 'design' | 'timeline', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    
    if (item) {
      setFormData({ ...item });
    } else {
      // Set default form data based on type
      switch (type) {
        case 'projectType':
          setFormData({
            id: '',
            label: '',
            description: '',
            baseCost: 0,
            timeline: 0,
            popular: false,
            status: 'active'
          });
          break;
        case 'feature':
          setFormData({
            id: '',
            label: '',
            description: '',
            cost: 0,
            category: '',
            status: 'active'
          });
          break;
        case 'design':
          setFormData({
            id: '',
            label: '',
            description: '',
            cost: 0,
            multiplier: 1,
            popular: false,
            status: 'active'
          });
          break;
        case 'timeline':
          setFormData({
            id: '',
            label: '',
            description: '',
            multiplier: 1,
            weeks: 0,
            status: 'active'
          });
          break;
      }
    }
    setShowModal(true);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.contactInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || submission.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calculator Management</h1>
          <p className="text-gray-600">Manage calculator submissions and configuration</p>
          {!canEdit && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ You have read-only access to this section
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <a
            href="/cost-estimator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Calculator size={16} />
            <span>Preview Calculator</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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
          {/* Calculator Submissions */}
          {activeTab === 'submissions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search submissions..."
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
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </div>

              {/* Submissions Table */}
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
                        Estimate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission, index) => (
                      <motion.tr
                        key={submission._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{submission.contactInfo.name}</div>
                            <div className="text-sm text-gray-500">{submission.contactInfo.email}</div>
                            {submission.contactInfo.company && (
                              <div className="text-xs text-gray-400">{submission.contactInfo.company}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{submission.projectType}</div>
                            <div className="text-sm text-gray-500">{submission.pages} pages</div>
                            <div className="text-xs text-gray-400">{submission.features.length} features</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              ${submission.estimate.totalCost.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">{submission.estimate.timeline}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            submission.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            submission.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleExportPDF(submission._id)}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Export PDF"
                            >
                              <Download size={16} />
                            </button>
                            <a
                              href={`mailto:${submission.contactInfo.email}`}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Contact Client"
                            >
                              <FileText size={16} />
                            </a>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Project Types */}
          {activeTab === 'project-types' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Project Types</h2>
                {canEdit && (
                  <button
                    onClick={() => openModal('projectType')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Project Type</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectTypes.map((type, index) => (
                  <motion.div
                    key={type._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{type.label}</h3>
                      {type.popular && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Base Cost:</span>
                        <span className="font-medium text-green-600">${type.baseCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Timeline:</span>
                        <span className="font-medium">{type.timeline} weeks</span>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex justify-between">
                        <button
                          onClick={() => openModal('projectType', type)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('projectType', type._id!)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Features & Add-ons</h2>
                {canEdit && (
                  <button
                    onClick={() => openModal('feature')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Feature</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{feature.label}</h3>
                      <span className="text-lg font-bold text-blue-600">+${feature.cost.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {feature.category}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        feature.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    {canEdit && (
                      <div className="flex justify-between">
                        <button
                          onClick={() => openModal('feature', feature)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('feature', feature._id!)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900">Calculator Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                      <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                    </div>
                    <Calculator className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Project Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${submissions.length > 0 ? Math.round(submissions.reduce((acc, s) => acc + s.estimate.totalCost, 0) / submissions.length).toLocaleString() : '0'}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {submissions.length > 0 ? Math.round((submissions.filter(s => s.status === 'converted').length / submissions.length) * 100) : 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {submissions.filter(s => 
                          new Date(s.createdAt).getMonth() === new Date().getMonth()
                        ).length}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal for Creating/Editing */}
      <AnimatePresence>
        {showModal && (
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
                    {editingItem ? 'Edit' : 'Create'} {modalType === 'projectType' ? 'Project Type' : 
                     modalType === 'feature' ? 'Feature' : 
                     modalType === 'design' ? 'Design Option' : 'Timeline Option'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      setFormData({});
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID
                    </label>
                    <input
                      type="text"
                      value={formData.id || ''}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={formData.label || ''}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Type-specific fields */}
                {modalType === 'projectType' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Cost ($)
                      </label>
                      <input
                        type="number"
                        value={formData.baseCost || 0}
                        onChange={(e) => setFormData({ ...formData, baseCost: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline (weeks)
                      </label>
                      <input
                        type="number"
                        value={formData.timeline || 0}
                        onChange={(e) => setFormData({ ...formData, timeline: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {modalType === 'feature' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cost ($)
                      </label>
                      <input
                        type="number"
                        value={formData.cost || 0}
                        onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
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
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., User Management"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      setFormData({});
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Create'}
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

export default Calculator;