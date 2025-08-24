import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, TestTube, Eye, EyeOff, CheckCircle, AlertCircle, Settings, RefreshCw, Zap, Bot } from 'lucide-react';
import { getApiBaseUrl } from '../../utils/api';
import { authUtils } from '../../utils/auth';

interface AIModel {
  _id?: string;
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  apiKey: string;
  modelName?: string;
  isEnabled: boolean;
  status: 'active' | 'inactive' | 'error';
  lastTested?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_AI_MODELS: Omit<AIModel, '_id' | 'apiKey' | 'isEnabled' | 'status' | 'lastTested' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'groq',
    name: 'Groq',
    description: 'Lightning-fast inference with Llama models',
    icon: '⚡',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'ChatGPT 3.5 Turbo and GPT-4',
    icon: '🤖',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Advanced reasoning and code generation',
    icon: '🧠',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s multimodal AI model',
    icon: '✨',
    color: 'from-blue-500 to-cyan-500'
  }
];

const AIConfiguration: React.FC = () => {
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'saving' | 'saved' | 'error' | null }>({});

  const canEdit = authUtils.hasEditorAccess();

  useEffect(() => {
    fetchAIModels();
  }, []);

  // Force initialization if no models are loaded
  useEffect(() => {
    if (!isLoading && aiModels.length === 0) {
      console.log('No AI models found, initializing defaults');
      initializeDefaultModels();
    }
  }, [isLoading, aiModels.length]);

  const fetchAIModels = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/ai-config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.aiModels && data.data.aiModels.length > 0) {
          setAiModels(data.data.aiModels);
        } else {
          // If no models exist, initialize with defaults
          initializeDefaultModels();
        }
      } else {
        // If request fails, initialize with defaults
        console.log('Response not OK, initializing defaults');
        initializeDefaultModels();
      }
    } catch (error) {
      console.error('Error fetching AI models:', error);
      initializeDefaultModels();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultModels = () => {
    console.log('Initializing default AI models');
    const defaultModels: AIModel[] = DEFAULT_AI_MODELS.map(model => ({
      ...model,
      apiKey: '',
      isEnabled: false,
      status: 'inactive' as const
    }));
    console.log('Default models created:', defaultModels);
    setAiModels(defaultModels);
  };

  const saveAIModel = async (model: AIModel) => {
    if (!canEdit) return;

    setSaveStatus(prev => ({ ...prev, [model.id]: 'saving' }));

    try {
      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/admin/dashboard/ai-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authUtils.getToken()}`
        },
        body: JSON.stringify({
          ...model,
          modelName: model.modelName || ''
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Raw response:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }

      if (data.success) {
        setSaveStatus(prev => ({ ...prev, [model.id]: 'saved' }));
        if (data.data?.isValid) {
          alert('API key saved and validated successfully!');
        } else {
          alert('API key saved but validation failed. Please check your key.');
        }
        
        await fetchAIModels();
        
        // Clear saved status after 2 seconds
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [model.id]: null }));
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to save AI model');
      }
    } catch (error) {
      console.error('Error saving AI model:', error);
      setSaveStatus(prev => ({ ...prev, [model.id]: 'error' }));
      alert(`Error saving AI model: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [model.id]: null }));
      }, 3000);
    }
  };

  const testAIModel = async (model: AIModel) => {
    if (!model.apiKey) {
      alert('Please enter an API key first');
      return;
    }

    try {
      setTestingModel(model.id);
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      
      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/admin/dashboard/ai-config/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          modelId: model.id,
          apiKey: model.apiKey
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update model status
        setAiModels(prev => prev.map(m => 
          m.id === model.id 
            ? { ...m, status: 'active' as const, lastTested: new Date().toISOString() }
            : m
        ));
        alert('API key test successful!');
      } else {
        setAiModels(prev => prev.map(m => 
          m.id === model.id 
            ? { ...m, status: 'error' as const }
            : m
        ));
        alert(`API key test failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error testing AI model:', error);
      setAiModels(prev => prev.map(m => 
        m.id === model.id 
          ? { ...m, status: 'error' as const }
          : m
      ));
      alert('Error testing API key');
    } finally {
      setTestingModel(null);
    }
  };

  const toggleModelEnabled = async (model: AIModel) => {
    if (!canEdit) return;

    const updatedModel = { ...model, isEnabled: !model.isEnabled };
    setAiModels(prev => prev.map(m => m.id === model.id ? updatedModel : m));
    await saveAIModel(updatedModel);
  };

  const updateApiKey = (modelId: string, apiKey: string) => {
    setAiModels(prev => prev.map(m => 
      m.id === modelId 
        ? { ...m, apiKey, status: apiKey ? 'inactive' as const : 'inactive' as const }
        : m
    ));
  };

  const updateModelName = (modelId: string, modelName: string) => {
    setAiModels(prev => prev.map(m => 
      m.id === modelId 
        ? { ...m, modelName }
        : m
    ));
  };

  const toggleApiKeyVisibility = (modelId: string) => {
    setShowApiKey(prev => ({ ...prev, [modelId]: !prev[modelId] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={14} />;
      case 'error': return <AlertCircle size={14} />;
      default: return <Settings size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Configuration</h1>
          <p className="text-gray-600">Manage AI models and API keys for the chat system</p>
          {!canEdit && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ You have read-only access to this section
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAIModels}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* AI Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiModels.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            {/* Model Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center text-white text-xl`}>
                  {model.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(model.status)}`}>
                  {getStatusIcon(model.status)}
                  <span className="capitalize">{model.status}</span>
                </span>
                
                {canEdit && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={model.isEnabled}
                      onChange={() => toggleModelEnabled(model)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                )}
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Name (Optional)
                </label>
                <input
                  type="text"
                  value={model.modelName || ''}
                  onChange={(e) => updateModelName(model.id, e.target.value)}
                  placeholder={`Default: ${model.id === 'groq' ? 'openai/gpt-oss-20b' : model.id === 'openai' ? 'gpt-3.5-turbo' : model.id === 'deepseek' ? 'deepseek-chat' : 'gemini-pro'}`}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use default model. For custom models, enter the exact model name.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey[model.id] ? 'text' : 'password'}
                    value={model.apiKey}
                    onChange={(e) => updateApiKey(model.id, e.target.value)}
                    placeholder="Enter API key..."
                    disabled={!canEdit}
                    className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <button
                      onClick={() => toggleApiKeyVisibility(model.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showApiKey[model.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {canEdit && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => saveAIModel(model)}
                    disabled={saveStatus[model.id] === 'saving'}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saveStatus[model.id] === 'saving' ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : saveStatus[model.id] === 'saved' ? (
                      <CheckCircle size={16} />
                    ) : saveStatus[model.id] === 'error' ? (
                      <AlertCircle size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>
                      {saveStatus[model.id] === 'saving' ? 'Saving...' :
                       saveStatus[model.id] === 'saved' ? 'Saved!' :
                       saveStatus[model.id] === 'error' ? 'Error' : 'Save'}
                    </span>
                  </button>

                  <button
                    onClick={() => testAIModel(model)}
                    disabled={!model.apiKey || testingModel === model.id}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {testingModel === model.id ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Zap size={16} />
                    )}
                    <span>{testingModel === model.id ? 'Testing...' : 'Test API'}</span>
                  </button>
                </div>
              )}

              {/* Last Tested */}
              {model.lastTested && (
                <div className="text-xs text-gray-500">
                  Last tested: {new Date(model.lastTested).toLocaleString()}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Bot className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How AI Configuration Works</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• <strong>Enable/Disable:</strong> Toggle which AI models are available to users in the chat widget</p>
              <p>• <strong>API Keys:</strong> Securely store API keys for each AI service</p>
              <p>• <strong>Test Connection:</strong> Verify API keys work before making them available to users</p>
              <p>• <strong>Status Monitoring:</strong> Track which models are active, inactive, or have errors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConfiguration;
