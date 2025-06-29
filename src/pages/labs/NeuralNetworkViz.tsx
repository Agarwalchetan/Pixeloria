import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, RotateCcw, Settings, Brain, 
  Layers, Zap, Activity, BarChart3, Download, Save,
  Eye, Code, Share2, Users, HelpCircle, Target,
  Plus, Minus, ChevronDown, ChevronRight, Sparkles,
  Upload, FileText, Monitor, Smartphone, Tablet,
  Cpu, Database, Globe, Shield, AlertTriangle,
  CheckCircle, TrendingUp, Clock, Award, Coffee
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Neuron {
  id: string;
  x: number;
  y: number;
  value: number;
  activation: number;
  bias: number;
  layer: number;
  type: 'input' | 'hidden' | 'output';
}

interface Connection {
  id: string;
  from: string;
  to: string;
  weight: number;
  gradient: number;
  active: boolean;
}

interface Layer {
  id: string;
  name: string;
  type: 'input' | 'dense' | 'dropout' | 'activation' | 'output';
  neurons: number;
  activationFunction?: string;
  dropoutRate?: number;
  parameters: Record<string, any>;
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
  description: string;
  samples: number;
  features: number;
  classes: number;
  type: 'classification' | 'regression';
}

const NeuralNetworkViz: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Input', type: 'input', neurons: 4, parameters: {} },
    { id: '2', name: 'Hidden 1', type: 'dense', neurons: 6, activationFunction: 'relu', parameters: {} },
    { id: '3', name: 'Hidden 2', type: 'dense', neurons: 4, activationFunction: 'relu', parameters: {} },
    { id: '4', name: 'Output', type: 'output', neurons: 3, activationFunction: 'softmax', parameters: {} }
  ]);
  
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isForwardProp, setIsForwardProp] = useState(false);
  const [selectedNeuron, setSelectedNeuron] = useState<string | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>('iris');
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [maxEpochs, setMaxEpochs] = useState(100);
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const [showMetrics, setShowMetrics] = useState(true);
  const [show3D, setShow3D] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [explainMode, setExplainMode] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [collaborationMode, setCollaborationMode] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  const datasets: Dataset[] = [
    {
      id: 'iris',
      name: 'Iris Flowers',
      description: 'Classic flower classification dataset',
      samples: 150,
      features: 4,
      classes: 3,
      type: 'classification'
    },
    {
      id: 'mnist',
      name: 'MNIST Digits',
      description: 'Handwritten digit recognition',
      samples: 60000,
      features: 784,
      classes: 10,
      type: 'classification'
    },
    {
      id: 'housing',
      name: 'Boston Housing',
      description: 'House price prediction',
      samples: 506,
      features: 13,
      classes: 1,
      type: 'regression'
    },
    {
      id: 'custom',
      name: 'Custom Dataset',
      description: 'Upload your own CSV data',
      samples: 0,
      features: 0,
      classes: 0,
      type: 'classification'
    }
  ];

  const activationFunctions = [
    { id: 'relu', name: 'ReLU', description: 'Rectified Linear Unit' },
    { id: 'sigmoid', name: 'Sigmoid', description: 'Logistic function' },
    { id: 'tanh', name: 'Tanh', description: 'Hyperbolic tangent' },
    { id: 'softmax', name: 'Softmax', description: 'Probability distribution' },
    { id: 'linear', name: 'Linear', description: 'No activation' }
  ];

  const layerTypes = [
    { id: 'dense', name: 'Dense', icon: Layers, description: 'Fully connected layer' },
    { id: 'dropout', name: 'Dropout', icon: Shield, description: 'Regularization layer' },
    { id: 'activation', name: 'Activation', icon: Zap, description: 'Activation function' }
  ];

  // Initialize network visualization
  useEffect(() => {
    generateNetwork();
  }, [layers]);

  const generateNetwork = () => {
    const newNeurons: Neuron[] = [];
    const newConnections: Connection[] = [];
    
    const layerSpacing = 200;
    const startX = 100;
    
    layers.forEach((layer, layerIndex) => {
      const neuronSpacing = 60;
      const startY = 150 - (layer.neurons * neuronSpacing) / 2;
      
      for (let i = 0; i < layer.neurons; i++) {
        const neuron: Neuron = {
          id: `${layer.id}-${i}`,
          x: startX + layerIndex * layerSpacing,
          y: startY + i * neuronSpacing,
          value: Math.random(),
          activation: Math.random(),
          bias: (Math.random() - 0.5) * 2,
          layer: layerIndex,
          type: layer.type === 'input' ? 'input' : layer.type === 'output' ? 'output' : 'hidden'
        };
        newNeurons.push(neuron);
        
        // Create connections to next layer
        if (layerIndex < layers.length - 1) {
          const nextLayer = layers[layerIndex + 1];
          for (let j = 0; j < nextLayer.neurons; j++) {
            const connection: Connection = {
              id: `${neuron.id}-${layerIndex + 1}-${j}`,
              from: neuron.id,
              to: `${layers[layerIndex + 1].id}-${j}`,
              weight: (Math.random() - 0.5) * 2,
              gradient: 0,
              active: false
            };
            newConnections.push(connection);
          }
        }
      }
    });
    
    setNeurons(newNeurons);
    setConnections(newConnections);
  };

  const addLayer = (type: string) => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${layers.length}`,
      type: type as any,
      neurons: type === 'dropout' ? 0 : 4,
      activationFunction: type === 'activation' ? 'relu' : undefined,
      dropoutRate: type === 'dropout' ? 0.2 : undefined,
      parameters: {}
    };
    
    // Insert before output layer
    const outputIndex = layers.findIndex(l => l.type === 'output');
    const newLayers = [...layers];
    newLayers.splice(outputIndex, 0, newLayer);
    setLayers(newLayers);
  };

  const removeLayer = (layerId: string) => {
    setLayers(prev => prev.filter(l => l.id !== layerId && l.type !== 'input' && l.type !== 'output'));
  };

  const updateLayerNeurons = (layerId: string, neurons: number) => {
    setLayers(prev => prev.map(l => 
      l.id === layerId ? { ...l, neurons: Math.max(1, neurons) } : l
    ));
  };

  const startTraining = () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setTrainingMetrics([]);
    
    const trainingInterval = setInterval(() => {
      setCurrentEpoch(prev => {
        const newEpoch = prev + 1;
        
        // Simulate training metrics
        const loss = Math.max(0.01, 2 * Math.exp(-newEpoch * 0.05) + Math.random() * 0.1);
        const accuracy = Math.min(0.99, 1 - Math.exp(-newEpoch * 0.03) + Math.random() * 0.05);
        const valLoss = loss + Math.random() * 0.05;
        const valAccuracy = accuracy - Math.random() * 0.03;
        
        setTrainingMetrics(prev => [...prev, {
          epoch: newEpoch,
          loss,
          accuracy,
          valLoss,
          valAccuracy,
          learningRate
        }]);
        
        // Animate network during training
        if (newEpoch % 5 === 0) {
          animateForwardProp();
        }
        
        if (newEpoch >= maxEpochs) {
          setIsTraining(false);
          clearInterval(trainingInterval);
          return newEpoch;
        }
        
        return newEpoch;
      });
    }, 100 / animationSpeed);
  };

  const animateForwardProp = () => {
    setIsForwardProp(true);
    
    // Animate connections layer by layer
    layers.forEach((layer, layerIndex) => {
      setTimeout(() => {
        setConnections(prev => prev.map(conn => {
          const fromNeuron = neurons.find(n => n.id === conn.from);
          if (fromNeuron && fromNeuron.layer === layerIndex) {
            return { ...conn, active: true };
          }
          return { ...conn, active: false };
        }));
        
        // Update neuron activations
        setNeurons(prev => prev.map(neuron => {
          if (neuron.layer === layerIndex + 1) {
            return { ...neuron, activation: Math.random() };
          }
          return neuron;
        }));
      }, layerIndex * 500 / animationSpeed);
    });
    
    setTimeout(() => {
      setIsForwardProp(false);
      setConnections(prev => prev.map(conn => ({ ...conn, active: false })));
    }, layers.length * 500 / animationSpeed);
  };

  const exportModel = (format: 'tensorflow' | 'pytorch' | 'json') => {
    const modelConfig = {
      layers: layers.map(layer => ({
        type: layer.type,
        neurons: layer.neurons,
        activation: layer.activationFunction,
        dropout: layer.dropoutRate
      })),
      training: {
        epochs: maxEpochs,
        learningRate,
        batchSize
      },
      metrics: trainingMetrics
    };

    let code = '';
    switch (format) {
      case 'tensorflow':
        code = `import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
${layers.map(layer => {
  if (layer.type === 'dense') {
    return `    layers.Dense(${layer.neurons}, activation='${layer.activationFunction}'),`;
  } else if (layer.type === 'dropout') {
    return `    layers.Dropout(${layer.dropoutRate}),`;
  }
  return '';
}).filter(Boolean).join('\n')}
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=${learningRate}),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)`;
        break;
        
      case 'pytorch':
        code = `import torch
import torch.nn as nn

class NeuralNetwork(nn.Module):
    def __init__(self):
        super(NeuralNetwork, self).__init__()
${layers.map((layer, index) => {
  if (layer.type === 'dense' && index > 0) {
    const prevLayer = layers[index - 1];
    return `        self.fc${index} = nn.Linear(${prevLayer.neurons}, ${layer.neurons})`;
  }
  return '';
}).filter(Boolean).join('\n')}
        
    def forward(self, x):
${layers.map((layer, index) => {
  if (layer.type === 'dense' && index > 0) {
    const activation = layer.activationFunction === 'relu' ? 'torch.relu' : 'torch.sigmoid';
    return `        x = ${activation}(self.fc${index}(x))`;
  }
  return '';
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

  const askAI = () => {
    // Simulate AI response
    const responses = [
      "The accuracy dropped because the learning rate might be too high, causing the model to overshoot the optimal weights.",
      "For image data, ReLU activation is generally preferred in hidden layers due to its ability to mitigate vanishing gradients.",
      "Overfitting occurs when your model learns the training data too well, including noise. Try adding dropout layers or reducing model complexity.",
      "The loss function measures how far your predictions are from the actual values. Lower loss indicates better performance."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    alert(`AI Coach: ${randomResponse}`);
    setAiQuestion('');
  };

  const getActivationColor = (activation: number) => {
    const intensity = Math.abs(activation);
    if (activation > 0) {
      return `rgba(59, 130, 246, ${intensity})`;  // Blue for positive
    } else {
      return `rgba(239, 68, 68, ${intensity})`;   // Red for negative
    }
  };

  const getConnectionOpacity = (weight: number, active: boolean) => {
    const baseOpacity = Math.abs(weight) * 0.5 + 0.1;
    return active ? Math.min(1, baseOpacity * 2) : baseOpacity;
  };

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
                <HelpCircle size={16} className="mr-2" />
                AI Coach
              </button>
              <button
                onClick={() => setShow3D(!show3D)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  show3D ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Cpu size={16} className="mr-2" />
                3D View
              </button>
              <button
                onClick={() => setCollaborationMode(!collaborationMode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  collaborationMode ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Users size={16} className="mr-2" />
                {collaborationMode ? 'Live' : 'Solo'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar - Network Builder */}
        <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col overflow-y-auto">
          {/* Dataset Selection */}
          <div className="p-6 border-b border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Database size={20} className="mr-2 text-green-400" />
              Dataset
            </h3>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {datasets.map((dataset) => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name} ({dataset.samples} samples)
                </option>
              ))}
            </select>
            
            {selectedDataset === 'custom' && (
              <div className="mt-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Upload size={16} className="mr-2" />
                  Upload CSV
                </button>
              </div>
            )}
          </div>

          {/* Layer Builder */}
          <div className="p-6 border-b border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Layers size={20} className="mr-2 text-blue-400" />
              Network Architecture
            </h3>
            
            <div className="space-y-3 mb-4">
              {layers.map((layer, index) => (
                <div key={layer.id} className="bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{layer.name}</span>
                    {layer.type !== 'input' && layer.type !== 'output' && (
                      <button
                        onClick={() => removeLayer(layer.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                  
                  {layer.type !== 'dropout' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Neurons:</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={layer.neurons}
                        onChange={(e) => updateLayerNeurons(layer.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={layer.type === 'input'}
                      />
                    </div>
                  )}
                  
                  {layer.activationFunction && (
                    <div className="mt-2">
                      <select
                        value={layer.activationFunction}
                        onChange={(e) => setLayers(prev => prev.map(l => 
                          l.id === layer.id ? { ...l, activationFunction: e.target.value } : l
                        ))}
                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {activationFunctions.map((fn) => (
                          <option key={fn.id} value={fn.id}>{fn.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {layer.type === 'dropout' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Rate:</span>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={layer.dropoutRate}
                        onChange={(e) => setLayers(prev => prev.map(l => 
                          l.id === layer.id ? { ...l, dropoutRate: parseFloat(e.target.value) } : l
                        ))}
                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Add Layer:</h4>
              <div className="grid grid-cols-2 gap-2">
                {layerTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => addLayer(type.id)}
                    className="flex flex-col items-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-600/30 transition-colors group"
                  >
                    <type.icon size={20} className="text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-300">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Training Controls */}
          <div className="p-6 border-b border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target size={20} className="mr-2 text-orange-400" />
              Training
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Learning Rate
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Epochs
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={maxEpochs}
                  onChange={(e) => setMaxEpochs(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Batch Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="256"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
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
            </div>
          </div>

          {/* AI Coach */}
          {explainMode && (
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Sparkles size={20} className="mr-2 text-purple-400" />
                AI Coach
              </h3>
              
              <div className="space-y-3">
                <textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Ask about neural networks: 'Why did accuracy drop?' or 'What's ReLU?'"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={askAI}
                  disabled={!aiQuestion}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center justify-center disabled:opacity-50"
                >
                  <Brain className="mr-2" size={16} />
                  Ask AI Coach
                </button>
              </div>
              
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Quick Questions:</h4>
                {[
                  "What's backpropagation?",
                  "Why use ReLU activation?",
                  "How to prevent overfitting?"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setAiQuestion(question)}
                    className="w-full text-left text-xs px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded text-gray-300 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col">
          {/* Controls */}
          <div className="bg-gray-800/30 border-b border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Play size={16} className="mr-2" />
                  {isTraining ? 'Training...' : 'Start Training'}
                </button>
                
                <button
                  onClick={animateForwardProp}
                  disabled={isTraining || isForwardProp}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Zap size={16} className="mr-2" />
                  Forward Pass
                </button>
                
                <button
                  onClick={() => {
                    setIsTraining(false);
                    setCurrentEpoch(0);
                    setTrainingMetrics([]);
                  }}
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">
                  Epoch: {currentEpoch} / {maxEpochs}
                </div>
                
                <button
                  onClick={() => setShowMetrics(!showMetrics)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    showMetrics ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <BarChart3 size={16} className="mr-2" />
                  Metrics
                </button>
              </div>
            </div>
          </div>

          {/* Network Visualization */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <div
              ref={networkRef}
              className="relative w-full h-full bg-white"
            >
              {/* SVG Network */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Connections */}
                {connections.map((connection) => {
                  const fromNeuron = neurons.find(n => n.id === connection.from);
                  const toNeuron = neurons.find(n => n.id === connection.to);
                  
                  if (!fromNeuron || !toNeuron) return null;
                  
                  const strokeWidth = Math.abs(connection.weight) * 3 + 1;
                  const strokeColor = connection.weight > 0 ? '#3B82F6' : '#EF4444';
                  const opacity = getConnectionOpacity(connection.weight, connection.active);
                  
                  return (
                    <line
                      key={connection.id}
                      x1={fromNeuron.x + 20}
                      y1={fromNeuron.y + 20}
                      x2={toNeuron.x + 20}
                      y2={toNeuron.y + 20}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      opacity={opacity}
                      className={connection.active ? 'animate-pulse' : ''}
                    />
                  );
                })}
                
                {/* Neurons */}
                {neurons.map((neuron) => (
                  <g key={neuron.id}>
                    <circle
                      cx={neuron.x + 20}
                      cy={neuron.y + 20}
                      r={18}
                      fill={getActivationColor(neuron.activation)}
                      stroke={selectedNeuron === neuron.id ? '#F59E0B' : '#374151'}
                      strokeWidth={selectedNeuron === neuron.id ? 3 : 2}
                      className="cursor-pointer hover:stroke-blue-500 transition-colors"
                      onClick={() => setSelectedNeuron(neuron.id)}
                    />
                    <text
                      x={neuron.x + 20}
                      y={neuron.y + 25}
                      textAnchor="middle"
                      className="text-xs font-medium fill-white pointer-events-none"
                    >
                      {neuron.activation.toFixed(2)}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Layer Labels */}
              {layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className="absolute top-4 bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium"
                  style={{ left: 100 + index * 200 - 40 }}
                >
                  {layer.name}
                  <div className="text-xs text-gray-300">
                    {layer.neurons} neurons
                  </div>
                </div>
              ))}

              {/* Neuron Details */}
              {selectedNeuron && (
                <div className="absolute top-20 right-4 bg-gray-800/90 backdrop-blur-sm text-white p-4 rounded-xl border border-gray-600 max-w-xs">
                  <h4 className="font-semibold mb-2">Neuron Details</h4>
                  {(() => {
                    const neuron = neurons.find(n => n.id === selectedNeuron);
                    if (!neuron) return null;
                    
                    return (
                      <div className="space-y-2 text-sm">
                        <div>ID: {neuron.id}</div>
                        <div>Value: {neuron.value.toFixed(4)}</div>
                        <div>Activation: {neuron.activation.toFixed(4)}</div>
                        <div>Bias: {neuron.bias.toFixed(4)}</div>
                        <div>Layer: {neuron.layer}</div>
                        <div>Type: {neuron.type}</div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Metrics & Export */}
        {showMetrics && (
          <div className="w-96 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 flex flex-col">
            {/* Training Metrics */}
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2 text-green-400" />
                Training Metrics
              </h3>
              
              {trainingMetrics.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {trainingMetrics[trainingMetrics.length - 1]?.accuracy.toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-red-400">
                        {trainingMetrics[trainingMetrics.length - 1]?.loss.toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-400">Loss</div>
                    </div>
                  </div>
                  
                  {/* Mini Chart */}
                  <div className="h-32 bg-gray-700/30 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-2">Loss Over Time</div>
                    <div className="relative h-20">
                      <svg className="w-full h-full">
                        <polyline
                          points={trainingMetrics.map((metric, index) => 
                            `${(index / (trainingMetrics.length - 1)) * 100},${(1 - metric.loss) * 80}`
                          ).join(' ')}
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2"
                        />
                        <polyline
                          points={trainingMetrics.map((metric, index) => 
                            `${(index / (trainingMetrics.length - 1)) * 100},${(1 - metric.accuracy) * 80}`
                          ).join(' ')}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Model Export */}
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Code size={20} className="mr-2 text-purple-400" />
                Export Model
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => exportModel('tensorflow')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  TensorFlow
                </button>
                <button
                  onClick={() => exportModel('pytorch')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  PyTorch
                </button>
                <button
                  onClick={() => exportModel('json')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  JSON Config
                </button>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Award size={20} className="mr-2 text-yellow-400" />
                Learn
              </h3>
              
              <div className="space-y-3">
                {[
                  { title: "How Backpropagation Works", duration: "5 min" },
                  { title: "CNN vs RNN Explained", duration: "8 min" },
                  { title: "Understanding Overfitting", duration: "6 min" },
                  { title: "Activation Functions Guide", duration: "4 min" }
                ].map((tutorial, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/30 rounded-lg p-3 cursor-pointer hover:bg-gray-600/30 transition-colors"
                  >
                    <div className="font-medium text-white text-sm">{tutorial.title}</div>
                    <div className="text-xs text-gray-400 flex items-center mt-1">
                      <Clock size={12} className="mr-1" />
                      {tutorial.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collaboration Panel */}
      <AnimatePresence>
        {collaborationMode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl max-w-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Live Collaboration</h4>
              <button
                onClick={() => setCollaborationMode(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-300">3 researchers online</span>
              </div>
              
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Share2 size={16} className="mr-2" />
                Share Network
              </button>
              
              <div className="text-xs text-gray-400">
                Collaborate on neural network design in real-time
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralNetworkViz;