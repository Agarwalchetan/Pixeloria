import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, RefreshCw, Eye, Plus, Edit, Trash2, ArrowUp, ArrowDown,
  User, TrendingUp, Clock, X, Upload, Users, Calendar, Star,
  CheckCircle, Rocket, Award
} from 'lucide-react';
import { adminApi } from '../../utils/api';
import { authUtils } from '../../utils/auth';

const AboutContent: React.FC = () => {
  const [aboutSettings, setAboutSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('numbers');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);

  const [aboutNumbers, setAboutNumbers] = useState({
    projects_completed: "50+",
    client_satisfaction: "100%",
    support_availability: "24/7",
    team_members: "10+"
  });

  const [teamFormData, setTeamFormData] = useState({
    name: '',
    role: '',
    bio: '',
    fun_fact: '',
    skills: '',
    social: {
      github: '',
      linkedin: '',
      twitter: ''
    },
    order: 1,
    status: 'active'
  });

  const [journeyFormData, setJourneyFormData] = useState({
    year: '',
    title: '',
    description: '',
    icon: 'Rocket',
    order: 1,
    status: 'active'
  });

  const canEdit = authUtils.hasEditorAccess();

  const iconOptions = [
    { value: 'Rocket', label: 'Rocket 🚀' },
    { value: 'Users', label: 'Users 👥' },
    { value: 'CheckCircle', label: 'Check Circle ✅' },
    { value: 'Star', label: 'Star ⭐' },
    { value: 'Award', label: 'Award 🏆' },
    { value: 'TrendingUp', label: 'Trending Up 📈' }
  ];

  useEffect(() => {
    fetchAboutSettings();
  }, []);

  const fetchAboutSettings = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getAboutSettings();
      
      if (response.success && response.data) {
        setAboutSettings(response.data.aboutSettings);
        
        if (response.data.aboutSettings?.about_numbers) {
          setAboutNumbers(response.data.aboutSettings.about_numbers);
        }
      }
    } catch (error) {
      console.error('Error fetching about settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNumbers = async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      const response = await adminApi.updateAboutSettings({
        about_numbers: aboutNumbers
      });
      
      if (response.success) {
        setAboutSettings(response.data.aboutSettings);
        alert('About page numbers updated successfully!');
      }
    } catch (error) {
      console.error('Error updating numbers:', error);
      alert('Failed to update numbers');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      const imageInput = document.getElementById('team-image') as HTMLInputElement;
      const image = imageInput?.files?.[0];
      
      const response = editingTeamMember 
        ? await adminApi.updateTeamMember(editingTeamMember._id, teamFormData, image)
        : await adminApi.createTeamMember(teamFormData, image);

      if (response.success) {
        setAboutSettings(response.data.aboutSettings);
        setShowTeamModal(false);
        setEditingTeamMember(null);
        resetTeamForm();
        
        if (imageInput) {
          imageInput.value = '';
        }
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleJourneySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      const response = editingMilestone 
        ? await adminApi.updateJourneyMilestone(editingMilestone._id, journeyFormData)
        : await adminApi.createJourneyMilestone(journeyFormData);

      if (response.success) {
        setAboutSettings(response.data.aboutSettings);
        setShowJourneyModal(false);
        setEditingMilestone(null);
        resetJourneyForm();
      }
    } catch (error) {
      console.error('Error saving journey milestone:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!canEdit || !confirm('Are you sure you want to delete this team member?')) return;

    try {
      const response = await adminApi.deleteTeamMember(id);
      if (response.success) {
        setAboutSettings(response.data.aboutSettings);
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!canEdit || !confirm('Are you sure you want to delete this milestone?')) return;

    try {
      const response = await adminApi.deleteJourneyMilestone(id);
      if (response.success) {
        setAboutSettings(response.data.aboutSettings);
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const resetTeamForm = () => {
    setTeamFormData({
      name: '',
      role: '',
      bio: '',
      fun_fact: '',
      skills: '',
      social: {
        github: '',
        linkedin: '',
        twitter: ''
      },
      order: 1,
      status: 'active'
    });
  };

  const resetJourneyForm = () => {
    setJourneyFormData({
      year: '',
      title: '',
      description: '',
      icon: 'Rocket',
      order: 1,
      status: 'active'
    });
  };

  const handleEditTeamMember = (member: any) => {
    setEditingTeamMember(member);
    setTeamFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      fun_fact: member.fun_fact,
      skills: member.skills.join(', '),
      social: member.social,
      order: member.order,
      status: member.status
    });
    setShowTeamModal(true);
  };

  const handleEditMilestone = (milestone: any) => {
    setEditingMilestone(milestone);
    setJourneyFormData({
      year: milestone.year,
      title: milestone.title,
      description: milestone.description,
      icon: milestone.icon,
      order: milestone.order,
      status: milestone.status
    });
    setShowJourneyModal(true);
  };

  const tabs = [
    { id: 'numbers', label: 'About Numbers', icon: TrendingUp },
    { id: 'team', label: 'Meet Our Team', icon: Users },
    { id: 'journey', label: 'Our Journey', icon: Calendar }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about content settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Page Content</h1>
          <p className="text-gray-600">Manage about page content, team, and journey</p>
          {!canEdit && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ You have read-only access to this section
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchAboutSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Eye size={16} />
            <span>Preview About</span>
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
          {/* About Numbers */}
          {activeTab === 'numbers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">About Page Numbers</h2>
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
                    Projects Completed
                  </label>
                  <input
                    type="text"
                    value={aboutNumbers.projects_completed}
                    onChange={(e) => setAboutNumbers({ ...aboutNumbers, projects_completed: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50+"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Satisfaction
                  </label>
                  <input
                    type="text"
                    value={aboutNumbers.client_satisfaction}
                    onChange={(e) => setAboutNumbers({ ...aboutNumbers, client_satisfaction: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100%"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Availability
                  </label>
                  <input
                    type="text"
                    value={aboutNumbers.support_availability}
                    onChange={(e) => setAboutNumbers({ ...aboutNumbers, support_availability: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="24/7"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Members
                  </label>
                  <input
                    type="text"
                    value={aboutNumbers.team_members}
                    onChange={(e) => setAboutNumbers({ ...aboutNumbers, team_members: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10+"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{aboutNumbers.projects_completed}</div>
                    <div className="text-sm text-gray-600">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{aboutNumbers.client_satisfaction}</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{aboutNumbers.support_availability}</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{aboutNumbers.team_members}</div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Team Management */}
          {activeTab === 'team' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Meet Our Team</h2>
                {canEdit && (
                  <button
                    onClick={() => setShowTeamModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Team Member</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aboutSettings?.team_members?.filter((member: any) => member.status === 'active').map((member: any, index: number) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 text-xs font-medium text-gray-600">
                        #{member.order}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{member.bio}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {canEdit && (
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleEditTeamMember(member)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTeamMember(member._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Journey Management */}
          {activeTab === 'journey' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Our Journey</h2>
                {canEdit && (
                  <button
                    onClick={() => setShowJourneyModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Milestone</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {aboutSettings?.journey_milestones?.filter((milestone: any) => milestone.status === 'active').map((milestone: any, index: number) => (
                  <motion.div
                    key={milestone._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">
                            {milestone.icon === 'Rocket' && '🚀'}
                            {milestone.icon === 'Users' && '👥'}
                            {milestone.icon === 'CheckCircle' && '✅'}
                            {milestone.icon === 'Star' && '⭐'}
                            {milestone.icon === 'Award' && '🏆'}
                            {milestone.icon === 'TrendingUp' && '📈'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-semibold text-blue-600">{milestone.year}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              Order: {milestone.order}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      
                      {canEdit && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditMilestone(milestone)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(milestone._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Team Member Modal */}
      <AnimatePresence>
        {showTeamModal && (
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
                    {editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowTeamModal(false);
                      setEditingTeamMember(null);
                      resetTeamForm();
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleTeamSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={teamFormData.name}
                      onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
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
                      value={teamFormData.role}
                      onChange={(e) => setTeamFormData({ ...teamFormData, role: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={teamFormData.bio}
                    onChange={(e) => setTeamFormData({ ...teamFormData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fun Fact
                  </label>
                  <input
                    type="text"
                    value={teamFormData.fun_fact}
                    onChange={(e) => setTeamFormData({ ...teamFormData, fun_fact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Something interesting about them"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={teamFormData.skills}
                    onChange={(e) => setTeamFormData({ ...teamFormData, skills: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="React, Node.js, AWS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload team member photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="team-image"
                    />
                    <label
                      htmlFor="team-image"
                      className="mt-2 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={teamFormData.order}
                      onChange={(e) => setTeamFormData({ ...teamFormData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={teamFormData.status}
                      onChange={(e) => setTeamFormData({ ...teamFormData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTeamModal(false);
                      setEditingTeamMember(null);
                      resetTeamForm();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : editingTeamMember ? 'Update Member' : 'Add Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journey Milestone Modal */}
      <AnimatePresence>
        {showJourneyModal && (
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
                    {editingMilestone ? 'Edit Milestone' : 'Add Journey Milestone'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowJourneyModal(false);
                      setEditingMilestone(null);
                      resetJourneyForm();
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleJourneySubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="text"
                      value={journeyFormData.year}
                      onChange={(e) => setJourneyFormData({ ...journeyFormData, year: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2024"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={journeyFormData.icon}
                      onChange={(e) => setJourneyFormData({ ...journeyFormData, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={journeyFormData.title}
                    onChange={(e) => setJourneyFormData({ ...journeyFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={journeyFormData.description}
                    onChange={(e) => setJourneyFormData({ ...journeyFormData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={journeyFormData.order}
                      onChange={(e) => setJourneyFormData({ ...journeyFormData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={journeyFormData.status}
                      onChange={(e) => setJourneyFormData({ ...journeyFormData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJourneyModal(false);
                      setEditingMilestone(null);
                      resetJourneyForm();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : editingMilestone ? 'Update Milestone' : 'Add Milestone'}
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

export default AboutContent;