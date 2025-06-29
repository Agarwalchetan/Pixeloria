import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, RotateCcw, Settings, Brain, 
  Layers, Plus, Minus, Eye, Code, Download, Save,
  BarChart3, Cpu, Activity, Zap, Target, Users,
  Upload, FileText, HelpCircle, Lightbulb, Share2,
  Monitor, Smartphone, Tablet, Grid, List, Filter,
  ChevronDown, ChevronRight, AlertCircle, CheckCircle,
  TrendingUp, TrendingDown, Clock, Award, Star,
  Database, Globe, Shield, Coffee, MessageSquare,
  ExternalLink, Copy, Sparkles, Wand2, Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NetworkLayer {
  id: string;
  type: 'input' | 'dense' | 'dropout' | 'activation' | 'output' | 'conv2d' | 'maxpool' | 'flatten';
  name: string;
  nodes: number;
  activation?: string;
  dropoutRate?: number;
  kernelSize?: number;
  filters?: number;
  poolSize?: number;
  position: { x: number; y: number };
  connections: string[];
}

interface NetworkNode {
  id: string;
  layerId: string;
  value: number;
  activation: number;
  gradient: number;
  weights: number[];
  bias: number;
  position: { x: number; y: number };
}

interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
  learningRate: number;
}

interface Dataset {
  id: string;
  name: string;
  type: 'classification' | 'regression';
  samples: number;
  features: number;
  classes?: number;
  description: string;
  preview: number[][];
}

const NeuralNetworkViz: React.FC = () => {
  const [layers, setLayers] = useState<NetworkLayer[]>([]);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [maxEpochs, setMaxEpochs] = useState(10);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('iris');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [showWeights, setShowWeights] = useState(true);
  const [showActivations, setShowActivations] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [explainMode, setExplainMode] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'training' | 'explain' | 'export'>('builder');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const layerTypes = [
    { type: 'input', label: 'Input Layer', icon: Database, color: 'from-green-500 to-emerald-600' },
    { type: 'dense', label: 'Dense Layer', icon: Grid, color: 'from-blue-500 to-cyan-600' },
    { type: 'dropout', label: 'Dropout', icon: Filter, color: 'from-yellow-500 to-orange-600' },
    { type: 'activation', label: 'Activation', icon: Zap, color: 'from-purple-500 to-pink-600' },
    { type: 'conv2d', label: 'Conv2D', icon: Layers, color: 'from-indigo-500 to-blue-600' },
    { type: 'maxpool', label: 'MaxPool', icon: Target, color: 'from-red-500 to-pink-600' },
    { type: 'flatten', label: 'Flatten', icon: List, color: 'from-gray-500 to-gray-600' },
    { type: 'output', label: 'Output Layer', icon: TrendingUp, color: 'from-emerald-500 to-green-600' }
  ];

  const activationFunctions = [
    'relu', 'sigmoid', 'tanh', 'softmax', 'leaky_relu', 'elu', 'swish'
  ];

  const datasets: Dataset[] = [
    {
      id: 'iris',
      name: 'Iris Classification',
      type: 'classification',
      samples: 150,
      features: 4,
      classes: 3,
      description: 'Classic flower classification dataset',
      preview: [[5.1, 3.5, 1.4, 0.2], [4.9, 3.0, 1.4, 0.2], [4.7, 3.2, 1.3, 0.2]]
    },
    {
      id: 'mnist',
      name: 'MNIST Digits',
      type: 'classification',
      samples: 60000,
      features: 784,
      classes: 10,
      description: 'Handwritten digit recognition',
      preview: [[0, 0, 0, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 0], [0, 0, 0, 1, 1, 0, 0]]
    },
    {
      id: 'housing',
      name: 'Boston Housing',
      type: 'regression',
      samples: 506,
      features: 13,
      description: 'House price prediction',
      preview: [[0.00632, 18.0, 2.31, 0, 0.538], [0.02731, 0.0, 7.07, 0, 0.469]]
    },
    {
      id: 'custom',
      name: 'Custom Dataset',
      type: 'classification',
      samples: 0,
      features: 0,
      description: 'Upload your own CSV data',
      preview: []
    }
  ];

  const tutorials = [
    {
      id: 'backprop',
      title: 'How Backpropagation Works',
      description: 'Visual explanation of gradient descent and weight updates',
      duration: '5 min',
      difficulty: 'Intermediate'
    },
    {
      id: 'cnn-vs-rnn',
      title: 'CNN vs RNN Architecture',
      description: 'When to use convolutional vs recurrent networks',
      duration: '8 min',
      difficulty: 'Advanced'
    },
    {
      id: 'overfitting',
      title: 'Understanding Overfitting',
      description: 'Visual guide to bias-variance tradeoff',
      duration: '6 min',
      difficulty: 'Beginner'
    },
    {
      id: 'activation-functions',
      title: 'Activation Functions Explained',
      description: 'ReLU, Sigmoid, Tanh and when to use them',
      duration: '4 min',
      difficulty: 'Beginner'
    }
  ];

  const addLayer = (type: string) => {
    const newLayer: NetworkLayer = {
      id: Date.now().toString(),
      type: type as any,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${layers.length + 1}`,
      nodes: type === 'input' ? 4 : type === 'output' ? 3 : 64,
      activation: type === 'activation' ? 'relu' : undefined,
      dropoutRate: type === 'dropout' ? 0.2 : undefined,
      kernelSize: type === 'conv2d' ? 3 : undefined,
      filters: type === 'conv2d' ? 32 : undefined,
      poolSize: type === 'maxpool' ? 2 : undefined,
      position: { x: 100 + layers.length * 150, y: 100 },
      connections: layers.length > 0 ? [layers[layers.length - 1].id] : []
    };

    setLayers(prev => [...prev, newLayer]);
    generateNodes(newLayer);
    setSelectedLayer(newLayer.id);
  };

  const generateNodes = (layer: NetworkLayer) => {
    const newNodes: NetworkNode[] = [];
    
    for (let i = 0; i < layer.nodes; i++) {
      const node: NetworkNode = {
        id: `${layer.id}-${i}`,
        layerId: layer.id,
        value: Math.random(),
        activation: Math.random(),
        gradient: Math.random() - 0.5,
        weights: Array.from({ length: 4 }, () => Math.random() - 0.5),
        bias: Math.random() - 0.5,
        position: {
          x: layer.position.x,
          y: layer.position.y + (i * 40) - ((layer.nodes - 1) * 20)
        }
      };
      newNodes.push(node);
    }

    setNodes(prev => [...prev.filter(n => n.layerId !== layer.id), ...newNodes]);
  };

  const startTraining = () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setTrainingMetrics([]);
    
    const trainEpoch = () => {
      setCurrentEpoch(prev => {
        const newEpoch = prev + 1;
        
        // Simulate training metrics
        const metrics: TrainingMetrics = {
          epoch: newEpoch,
          loss: Math.max(0.1, 2.0 * Math.exp(-newEpoch * 0.3) + Math.random() * 0.1),
          accuracy: Math.min(0.95, 0.5 + (newEpoch * 0.05) + Math.random() * 0.05),
          valLoss: Math.max(0.15, 2.2 * Math.exp(-newEpoch * 0.25) + Math.random() * 0.15),
          valAccuracy: Math.min(0.92, 0.45 + (newEpoch * 0.045) + Math.random() * 0.05),
          learningRate: 0.001 * Math.pow(0.95, newEpoch)
        };
        
        setTrainingMetrics(prev => [...prev, metrics]);
        
        // Update node activations
        setNodes(prev => prev.map(node => ({
          ...node,
          activation: Math.max(0, node.activation + (Math.random() - 0.5) * 0.1),
          gradient: (Math.random() - 0.5) * 0.5,
          weights: node.weights.map(w => w + (Math.random() - 0.5) * 0.01)
        })));
        
        if (newEpoch >= maxEpochs) {
          setIsTraining(false);
          return newEpoch;
        }
        
        setTimeout(trainEpoch, 1000 / animationSpeed);
        return newEpoch;
      });
    };
    
    trainEpoch();
  };

  const exportModel = (format: 'tensorflow' | 'pytorch' | 'json') => {
    const modelConfig = {
      layers: layers.map(layer => ({
        type: layer.type,
        nodes: layer.nodes,
        activation: layer.activation,
        dropoutRate: layer.dropoutRate,
        kernelSize: layer.kernelSize,
        filters: layer.filters,
        poolSize: layer.poolSize
      })),
      dataset: selectedDataset,
      metrics: trainingMetrics[trainingMetrics.length - 1]
    };

    let code = '';
    
    switch (format) {
      case 'tensorflow':
        code = `import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
${layers.map(layer => {
  switch (layer.type) {
    case 'input':
      return `    layers.Input(shape=(${layer.nodes},))`;
    case 'dense':
      return `    layers.Dense(${layer.nodes}${layer.activation ? `, activation='${layer.activation}'` : ''})`;
    case 'dropout':
      return `    layers.Dropout(${layer.dropoutRate})`;
    case 'conv2d':
      return `    layers.Conv2D(${layer.filters}, (${layer.kernelSize}, ${layer.kernelSize}), activation='relu')`;
    case 'maxpool':
      return `    layers.MaxPooling2D((${layer.poolSize}, ${layer.poolSize}))`;
    case 'flatten':
      return `    layers.Flatten()`;
    default:
      return `    layers.Dense(${layer.nodes})`;
  }
}).join(',\n')}
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)`;
        break;

      case 'pytorch':
        code = `import torch
import torch.nn as nn
import torch.nn.functional as F

class NeuralNetwork(nn.Module):
    def __init__(self):
        super(NeuralNetwork, self).__init__()
${layers.filter(l => l.type !== 'input').map((layer, i) => {
  switch (layer.type) {
    case 'dense':
      return `        self.fc${i + 1} = nn.Linear(${layers[i]?.nodes || 'input_size'}, ${layer.nodes})`;
    case 'dropout':
      return `        self.dropout${i + 1} = nn.Dropout(${layer.dropoutRate})`;
    case 'conv2d':
      return `        self.conv${i + 1} = nn.Conv2d(in_channels, ${layer.filters}, kernel_size=${layer.kernelSize})`;
    default:
      return '';
  }
}).filter(Boolean).join('\n')}
    
    def forward(self, x):
${layers.filter(l => l.type !== 'input').map((layer, i) => {
  switch (layer.type) {
    case 'dense':
      return `        x = F.relu(self.fc${i + 1}(x))`;
    case 'dropout':
      return `        x = self.dropout${i + 1}(x)`;
    default:
      return '';
  }
}).filter(Boolean).join('\n')}
        return x`;
        break;

      case 'json':
        code = JSON.stringify(modelConfig, null, 2);
        break;
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural_network.${format === 'json' ? 'json' : 'py'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const askAI = async () => {
    if (!aiQuestion.trim()) return;
    
    // Simulate AI response based on question
    const responses: Record<string, string> = {
      'accuracy': 'Accuracy dropped because the learning rate might be too high, causing the model to overshoot optimal weights. Try reducing it to 0.0001.',
      'overfitting': 'Your validation loss is increasing while training loss decreases - classic overfitting. Add dropout layers or reduce model complexity.',
      'activation': 'For image data, ReLU works well in hidden layers. Use softmax for multi-class output and sigmoid for binary classification.',
      'learning rate': 'Start with 0.001 for Adam optimizer. If loss plateaus, try 0.0001. If training is unstable, use 0.01.',
      'epochs': 'Monitor validation loss. Stop training when it starts increasing consistently (early stopping).'
    };

    const key = Object.keys(responses).find(k => aiQuestion.toLowerCase().includes(k));
    const response = key ? responses[key] : "I'd be happy to help! Try asking about accuracy, overfitting, activation functions, learning rates, or training epochs.";
    
    // Show response in a toast or modal
    alert(`AI Coach: ${response}`);
    setAiQuestion('');
  };

  const drawNetwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    if (showWeights) {
      layers.forEach(layer => {
        layer.connections.forEach(connectionId => {
          const sourceLayer = layers.find(l => l.id === connectionId);
          if (sourceLayer) {
            const sourceNodes = nodes.filter(n => n.layerId === sourceLayer.id);
            const targetNodes = nodes.filter(n => n.layerId === layer.id);

            sourceNodes.forEach(sourceNode => {
              targetNodes.forEach(targetNode => {
                const weight = Math.random(); // Simplified weight visualization
                ctx.strokeStyle = weight > 0 ? `rgba(59, 130, 246, ${Math.abs(weight)})` : `rgba(239, 68, 68, ${Math.abs(weight)})`;
                ctx.lineWidth = Math.abs(weight) * 3;
                ctx.beginPath();
                ctx.moveTo(sourceNode.position.x + 15, sourceNode.position.y + 15);
                ctx.lineTo(targetNode.position.x, targetNode.position.y + 15);
                ctx.stroke();
              });
            });
          }
        });
      });
    }

    // Draw nodes
    nodes.forEach(node => {
      const layer = layers.find(l => l.id === node.layerId);
      if (!layer) return;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.position.x + 15, node.position.y + 15, 15, 0, 2 * Math.PI);
      
      if (showActivations) {
        const intensity = Math.abs(node.activation);
        ctx.fillStyle = node.activation > 0 
          ? `rgba(34, 197, 94, ${intensity})` 
          : `rgba(239, 68, 68, ${intensity})`;
      } else {
        ctx.fillStyle = selectedNode === node.id ? '#3B82F6' : '#6B7280';
      }
      
      ctx.fill();
      ctx.strokeStyle = selectedNode === node.id ? '#1D4ED8' : '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Activation value
      if (showActivations && isTraining) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.activation.toFixed(2), node.position.x + 15, node.position.y + 20);
      }
    });

    // Draw layer labels
    layers.forEach(layer => {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(layer.name, layer.position.x + 15, layer.position.y - 10);
    });

  }, [layers, nodes, showWeights, showActivations, selectedNode, isTraining]);

  useEffect(() => {
    drawNetwork();
  }, [drawNetwork]);

  useEffect(() => {
    if (isTraining) {
      const animate = () => {
        drawNetwork();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTraining, drawNetwork]);

  // Initialize with a simple network
  useEffect(() => {
    if (layers.length === 0) {
      const inputLayer: NetworkLayer = {
        id: 'input-1',
        type: 'input',
        name: 'Input Layer',
        nodes: 4,
        position: { x: 50, y: 100 },
        connections: []
      };

      const hiddenLayer: NetworkLayer = {
        id: 'hidden-1',
        type: 'dense',
        name: 'Hidden Layer',
        nodes: 8,
        activation: 'relu',
        position: { x: 250, y: 80 },
        connections: ['input-1']
      };

      const outputLayer: NetworkLayer = {
        id: 'output-1',
        type: 'output',
        name: 'Output Layer',
        nodes: 3,
        activation: 'softmax',
        position: { x: 450, y: 100 },
        connections: ['hidden-1']
      };

      setLayers([inputLayer, hiddenLayer, outputLayer]);
      [inputLayer, hiddenLayer, outputLayer].forEach(generateNodes);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/labs" 
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Labs
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Neural Network Visualizer</h1>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">BETA</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setExplainMode(!explainMode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  explainMode ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Lightbulb size={16} className="mr-2" />
                AI Coach
              </button>
              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showTutorial ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <HelpCircle size={16} className="mr-2" />
                Learn
              </button>
              <div className="relative">
                <select
                  onChange={(e) => exportModel(e.target.value as any)}
                  className="appearance-none bg-gray-700 text-white px-4 py-2 rounded-lg pr-8 hover:bg-gray-600 transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Export</option>
                  <option value="tensorflow">TensorFlow</option>
                  <option value="pytorch">PyTorch</option>
                  <option value="json">JSON Config</option>
                </select>
                <Download size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar - Layer Builder */}
        <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700/50">
            {(['builder', 'training', 'explain', 'export'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'builder' && (
              <div className="p-6 space-y-6">
                {/* Layer Types */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Add Layers</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {layerTypes.map((type) => (
                      <button
                        key={type.type}
                        onClick={() => addLayer(type.type)}
                        className={`flex flex-col items-center p-4 bg-gradient-to-br ${type.color} rounded-lg hover:scale-105 transition-transform group`}
                      >
                        <type.icon size={24} className="text-white mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-white font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer Properties */}
                {selectedLayer && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Layer Properties</h3>
                    <div className="space-y-4">
                      {(() => {
                        const layer = layers.find(l => l.id === selectedLayer);
                        if (!layer) return null;

                        return (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Layer Name
                              </label>
                              <input
                                type="text"
                                value={layer.name}
                                onChange={(e) => setLayers(prev => prev.map(l => 
                                  l.id === selectedLayer ? { ...l, name: e.target.value } : l
                                ))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nodes/Units
                              </label>
                              <input
                                type="number"
                                value={layer.nodes}
                                onChange={(e) => {
                                  const newNodes = parseInt(e.target.value);
                                  setLayers(prev => prev.map(l => 
                                    l.id === selectedLayer ? { ...l, nodes: newNodes } : l
                                  ));
                                  generateNodes({ ...layer, nodes: newNodes });
                                }}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {(layer.type === 'dense' || layer.type === 'activation') && (
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Activation Function
                                </label>
                                <select
                                  value={layer.activation || 'relu'}
                                  onChange={(e) => setLayers(prev => prev.map(l => 
                                    l.id === selectedLayer ? { ...l, activation: e.target.value } : l
                                  ))}
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {activationFunctions.map(func => (
                                    <option key={func} value={func}>{func}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {layer.type === 'dropout' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Dropout Rate
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={layer.dropoutRate || 0.2}
                                  onChange={(e) => setLayers(prev => prev.map(l => 
                                    l.id === selectedLayer ? { ...l, dropoutRate: parseFloat(e.target.value) } : l
                                  ))}
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            )}

                            {layer.type === 'conv2d' && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Filters
                                  </label>
                                  <input
                                    type="number"
                                    value={layer.filters || 32}
                                    onChange={(e) => setLayers(prev => prev.map(l => 
                                      l.id === selectedLayer ? { ...l, filters: parseInt(e.target.value) } : l
                                    ))}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Kernel Size
                                  </label>
                                  <input
                                    type="number"
                                    value={layer.kernelSize || 3}
                                    onChange={(e) => setLayers(prev => prev.map(l => 
                                      l.id === selectedLayer ? { ...l, kernelSize: parseInt(e.target.value) } : l
                                    ))}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Dataset Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Dataset</h3>
                  <select
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {datasets.map(dataset => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.name} ({dataset.samples} samples)
                      </option>
                    ))}
                  </select>
                  
                  {(() => {
                    const dataset = datasets.find(d => d.id === selectedDataset);
                    return dataset && (
                      <div className="mt-3 p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-sm text-gray-300 mb-2">{dataset.description}</div>
                        <div className="text-xs text-gray-400">
                          Features: {dataset.features} | Type: {dataset.type}
                          {dataset.classes && ` | Classes: ${dataset.classes}`}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="p-6 space-y-6">
                {/* Training Controls */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Training Controls</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Epochs
                      </label>
                      <input
                        type="number"
                        value={maxEpochs}
                        onChange={(e) => setMaxEpochs(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Animation Speed: {animationSpeed}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <button
                      onClick={startTraining}
                      disabled={isTraining}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {isTraining ? (
                        <>
                          <Activity className="mr-2 animate-pulse" size={16} />
                          Training... Epoch {currentEpoch}/{maxEpochs}
                        </>
                      ) : (
                        <>
                          <Play className="mr-2" size={16} />
                          Start Training
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Training Metrics */}
                {trainingMetrics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Metrics</h3>
                    <div className="space-y-3">
                      {(() => {
                        const latest = trainingMetrics[trainingMetrics.length - 1];
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <div className="text-sm text-gray-400">Loss</div>
                              <div className="text-lg font-bold text-red-400">
                                {latest.loss.toFixed(4)}
                              </div>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <div className="text-sm text-gray-400">Accuracy</div>
                              <div className="text-lg font-bold text-green-400">
                                {(latest.accuracy * 100).toFixed(1)}%
                              </div>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <div className="text-sm text-gray-400">Val Loss</div>
                              <div className="text-lg font-bold text-orange-400">
                                {latest.valLoss.toFixed(4)}
                              </div>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <div className="text-sm text-gray-400">Val Acc</div>
                              <div className="text-lg font-bold text-blue-400">
                                {(latest.valAccuracy * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Visualization Controls */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Visualization</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showWeights}
                        onChange={(e) => setShowWeights(e.target.checked)}
                        className="mr-3 accent-blue-600"
                      />
                      <span className="text-gray-300">Show Weights</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showActivations}
                        onChange={(e) => setShowActivations(e.target.checked)}
                        className="mr-3 accent-blue-600"
                      />
                      <span className="text-gray-300">Show Activations</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'explain' && (
              <div className="p-6 space-y-6">
                {/* AI Coach */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Brain size={20} className="mr-2 text-purple-400" />
                    AI Coach
                  </h3>
                  <div className="space-y-3">
                    <textarea
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder="Ask about your network: 'Why did accuracy drop?' or 'What activation for images?'"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={askAI}
                      disabled={!aiQuestion.trim()}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center justify-center disabled:opacity-50"
                    >
                      <Sparkles className="mr-2" size={16} />
                      Ask AI Coach
                    </button>
                  </div>
                </div>

                {/* Quick Questions */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Quick Questions</h4>
                  <div className="space-y-2">
                    {[
                      "Why did accuracy drop after epoch 5?",
                      "What's a good activation for image data?",
                      "How do I prevent overfitting?",
                      "What learning rate should I use?"
                    ].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setAiQuestion(question)}
                        className="w-full text-left text-sm px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded text-gray-300 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Export Options</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => exportModel('tensorflow')}
                      className="w-full flex items-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Code className="mr-2" size={16} />
                      TensorFlow/Keras
                    </button>
                    <button
                      onClick={() => exportModel('pytorch')}
                      className="w-full flex items-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Code className="mr-2" size={16} />
                      PyTorch
                    </button>
                    <button
                      onClick={() => exportModel('json')}
                      className="w-full flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="mr-2" size={16} />
                      JSON Config
                    </button>
                  </div>
                </div>

                {/* Model Summary */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Model Summary</h4>
                  <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Layers:</span>
                      <span className="text-white">{layers.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Parameters:</span>
                      <span className="text-white">
                        {layers.reduce((sum, layer, index) => {
                          if (index === 0) return sum;
                          const prevLayer = layers[index - 1];
                          return sum + (layer.nodes * prevLayer.nodes) + layer.nodes;
                        }, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dataset:</span>
                      <span className="text-white">
                        {datasets.find(d => d.id === selectedDataset)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Controls */}
          <div className="bg-gray-800/30 border-b border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-white">Network Architecture</h2>
                {selectedNode && (
                  <div className="text-sm text-gray-400">
                    Selected: Node {selectedNode}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('2d')}
                    className={`px-3 py-1 rounded text-sm ${viewMode === '2d' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                  >
                    2D
                  </button>
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`px-3 py-1 rounded text-sm ${viewMode === '3d' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                  >
                    3D
                  </button>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setLayers([]);
                    setNodes([]);
                    setSelectedLayer(null);
                    setSelectedNode(null);
                  }}
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Find clicked node
                const clickedNode = nodes.find(node => {
                  const dx = x - (node.position.x + 15);
                  const dy = y - (node.position.y + 15);
                  return Math.sqrt(dx * dx + dy * dy) < 15;
                });
                
                if (clickedNode) {
                  setSelectedNode(selectedNode === clickedNode.id ? null : clickedNode.id);
                  setSelectedLayer(clickedNode.layerId);
                } else {
                  setSelectedNode(null);
                }
              }}
            />

            {/* Node Details Popup */}
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl max-w-sm"
              >
                {(() => {
                  const node = nodes.find(n => n.id === selectedNode);
                  if (!node) return null;

                  return (
                    <div>
                      <h4 className="font-semibold text-white mb-3">Node Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Activation:</span>
                          <span className="text-white font-mono">{node.activation.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gradient:</span>
                          <span className="text-white font-mono">{node.gradient.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Bias:</span>
                          <span className="text-white font-mono">{node.bias.toFixed(4)}</span>
                        </div>
                        <div className="mt-3">
                          <div className="text-gray-400 mb-1">Weights:</div>
                          <div className="grid grid-cols-2 gap-1">
                            {node.weights.slice(0, 4).map((weight, i) => (
                              <div key={i} className="text-xs font-mono text-white bg-gray-700 px-2 py-1 rounded">
                                {weight.toFixed(3)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Training Progress */}
            {isTraining && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <Activity className="text-green-400 animate-pulse" size={20} />
                  <div>
                    <div className="text-white font-semibold">Training in Progress</div>
                    <div className="text-gray-400 text-sm">
                      Epoch {currentEpoch} of {maxEpochs}
                    </div>
                  </div>
                </div>
                <div className="mt-3 w-48 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentEpoch / maxEpochs) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Metrics & Charts */}
        {trainingMetrics.length > 0 && (
          <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 flex flex-col">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Training Metrics</h3>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Loss Chart */}
              <div>
                <h4 className="font-semibold text-white mb-3">Loss</h4>
                <div className="h-32 bg-gray-700/30 rounded-lg p-3 relative">
                  <svg className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2"
                      points={trainingMetrics.map((metric, i) => 
                        `${(i / (trainingMetrics.length - 1)) * 100},${100 - (metric.loss / 2) * 100}`
                      ).join(' ')}
                    />
                    <polyline
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      points={trainingMetrics.map((metric, i) => 
                        `${(i / (trainingMetrics.length - 1)) * 100},${100 - (metric.valLoss / 2) * 100}`
                      ).join(' ')}
                    />
                  </svg>
                  <div className="absolute top-2 right-2 text-xs">
                    <div className="flex items-center text-red-400">
                      <div className="w-3 h-0.5 bg-red-400 mr-1"></div>
                      Train
                    </div>
                    <div className="flex items-center text-orange-400">
                      <div className="w-3 h-0.5 bg-orange-400 mr-1 border-dashed"></div>
                      Val
                    </div>
                  </div>
                </div>
              </div>

              {/* Accuracy Chart */}
              <div>
                <h4 className="font-semibold text-white mb-3">Accuracy</h4>
                <div className="h-32 bg-gray-700/30 rounded-lg p-3 relative">
                  <svg className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="2"
                      points={trainingMetrics.map((metric, i) => 
                        `${(i / (trainingMetrics.length - 1)) * 100},${100 - metric.accuracy * 100}`
                      ).join(' ')}
                    />
                    <polyline
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      points={trainingMetrics.map((metric, i) => 
                        `${(i / (trainingMetrics.length - 1)) * 100},${100 - metric.valAccuracy * 100}`
                      ).join(' ')}
                    />
                  </svg>
                  <div className="absolute top-2 right-2 text-xs">
                    <div className="flex items-center text-green-400">
                      <div className="w-3 h-0.5 bg-green-400 mr-1"></div>
                      Train
                    </div>
                    <div className="flex items-center text-blue-400">
                      <div className="w-3 h-0.5 bg-blue-400 mr-1 border-dashed"></div>
                      Val
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Metrics */}
              <div>
                <h4 className="font-semibold text-white mb-3">Current Values</h4>
                <div className="space-y-2">
                  {(() => {
                    const latest = trainingMetrics[trainingMetrics.length - 1];
                    return (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Learning Rate:</span>
                          <span className="text-white font-mono">{latest.learningRate.toExponential(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Epoch:</span>
                          <span className="text-white">{latest.epoch}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Best Val Acc:</span>
                          <span className="text-green-400">
                            {Math.max(...trainingMetrics.map(m => m.valAccuracy)).toFixed(3)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white">Interactive Tutorials</h3>
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial) => (
                    <motion.div
                      key={tutorial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-700/30 rounded-xl p-6 cursor-pointer hover:bg-gray-600/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{tutorial.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tutorial.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          tutorial.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tutorial.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{tutorial.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {tutorial.duration}
                        </span>
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                          Start Tutorial
                          <ExternalLink size={14} className="ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralNetworkViz;