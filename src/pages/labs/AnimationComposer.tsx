import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Settings, ArrowLeft, Copy, 
  Zap, MousePointer, Eye, Code, Download, Save,
  Layers, Grid, Monitor, Smartphone, Tablet, Clock,
  BarChart3, Cpu, Activity, AlertTriangle, CheckCircle,
  Share2, Users, Link2, FileText, Sliders, Target,
  Plus, Minus, ChevronDown, ChevronRight, Sparkles,
  Brain, Wand2, Package, Tag, Folder, GitFork,
  MessageSquare, ThumbsUp, Image, Video, Type,
  Square, Circle, Triangle, Star, Heart, Zap as ZapIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnimationElement {
  id: string;
  type: 'card' | 'text' | 'image' | 'svg' | 'button';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style: {
    backgroundColor?: string;
    color?: string;
    borderRadius?: number;
    fontSize?: number;
  };
  animations: AnimationKeyframe[];
}

interface AnimationKeyframe {
  id: string;
  time: number;
  property: string;
  value: any;
  easing: string;
  duration: number;
}

interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  keyframes: AnimationKeyframe[];
  preview: string;
  author: string;
  likes: number;
  downloads: number;
}

const AnimationComposer: React.FC = () => {
  const [elements, setElements] = useState<AnimationElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(5);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showTimeline, setShowTimeline] = useState(true);
  const [showPresets, setShowPresets] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState<'framer' | 'gsap' | 'css'>('framer');
  const [showCode, setShowCode] = useState(false);
  const [collaborationMode, setCollaborationMode] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const elementTypes = [
    { type: 'card', icon: Square, label: 'Card' },
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'button', icon: Package, label: 'Button' },
    { type: 'svg', icon: Star, label: 'SVG' }
  ];

  const animationProperties = [
    { property: 'x', label: 'X Position', unit: 'px' },
    { property: 'y', label: 'Y Position', unit: 'px' },
    { property: 'scale', label: 'Scale', unit: '' },
    { property: 'rotate', label: 'Rotation', unit: 'deg' },
    { property: 'opacity', label: 'Opacity', unit: '' },
    { property: 'backgroundColor', label: 'Background', unit: '' },
    { property: 'borderRadius', label: 'Border Radius', unit: 'px' }
  ];

  const easingOptions = [
    'linear', 'easeIn', 'easeOut', 'easeInOut', 'circIn', 'circOut', 
    'backIn', 'backOut', 'anticipate', 'bounceIn', 'bounceOut'
  ];

  const animationPresets: AnimationPreset[] = [
    {
      id: 'fade-in',
      name: 'Fade In',
      description: 'Smooth fade in animation',
      category: 'Entrance',
      keyframes: [
        { id: '1', time: 0, property: 'opacity', value: 0, easing: 'easeOut', duration: 0.5 }
      ],
      preview: 'fade-preview.gif',
      author: 'Motion Team',
      likes: 245,
      downloads: 1200
    },
    {
      id: 'slide-up',
      name: 'Slide Up',
      description: 'Slide up from bottom with bounce',
      category: 'Entrance',
      keyframes: [
        { id: '1', time: 0, property: 'y', value: 50, easing: 'bounceOut', duration: 0.8 },
        { id: '2', time: 0, property: 'opacity', value: 0, easing: 'easeOut', duration: 0.3 }
      ],
      preview: 'slide-preview.gif',
      author: 'Design Studio',
      likes: 189,
      downloads: 890
    },
    {
      id: 'scale-bounce',
      name: 'Scale Bounce',
      description: 'Bouncy scale animation',
      category: 'Attention',
      keyframes: [
        { id: '1', time: 0, property: 'scale', value: 0.8, easing: 'backOut', duration: 0.6 }
      ],
      preview: 'bounce-preview.gif',
      author: 'Motion Lab',
      likes: 156,
      downloads: 670
    },
    {
      id: 'rotate-fade',
      name: 'Rotate & Fade',
      description: 'Rotation with fade effect',
      category: 'Complex',
      keyframes: [
        { id: '1', time: 0, property: 'rotate', value: -180, easing: 'easeInOut', duration: 1.2 },
        { id: '2', time: 0.5, property: 'opacity', value: 0, easing: 'easeIn', duration: 0.3 }
      ],
      preview: 'rotate-preview.gif',
      author: 'Creative Dev',
      likes: 203,
      downloads: 450
    }
  ];

  const addElement = (type: string) => {
    const newElement: AnimationElement = {
      id: Date.now().toString(),
      type: type as any,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${elements.length + 1}`,
      x: 100 + elements.length * 20,
      y: 100 + elements.length * 20,
      width: type === 'text' ? 200 : 120,
      height: type === 'text' ? 40 : 80,
      content: type === 'text' ? 'Sample Text' : undefined,
      style: {
        backgroundColor: type === 'card' ? '#3B82F6' : type === 'button' ? '#10B981' : undefined,
        color: type === 'text' ? '#1F2937' : '#FFFFFF',
        borderRadius: 8,
        fontSize: type === 'text' ? 16 : undefined
      },
      animations: []
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const addKeyframe = (elementId: string, property: string, value: any, time: number) => {
    const keyframe: AnimationKeyframe = {
      id: Date.now().toString(),
      time,
      property,
      value,
      easing: 'easeOut',
      duration: 0.5
    };

    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, animations: [...el.animations, keyframe] }
        : el
    ));
  };

  const generateAIAnimation = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      // Parse prompt and generate keyframes
      const mockKeyframes: AnimationKeyframe[] = [];
      
      if (aiPrompt.toLowerCase().includes('slide')) {
        mockKeyframes.push({
          id: Date.now().toString(),
          time: 0,
          property: 'y',
          value: 50,
          easing: 'easeOut',
          duration: 0.6
        });
      }
      
      if (aiPrompt.toLowerCase().includes('fade')) {
        mockKeyframes.push({
          id: (Date.now() + 1).toString(),
          time: 0,
          property: 'opacity',
          value: 0,
          easing: 'easeOut',
          duration: 0.4
        });
      }
      
      if (aiPrompt.toLowerCase().includes('bounce')) {
        mockKeyframes.push({
          id: (Date.now() + 2).toString(),
          time: 0.2,
          property: 'scale',
          value: 1.1,
          easing: 'bounceOut',
          duration: 0.3
        });
      }

      // Apply to selected element or create new one
      if (selectedElement && mockKeyframes.length > 0) {
        setElements(prev => prev.map(el => 
          el.id === selectedElement 
            ? { ...el, animations: [...el.animations, ...mockKeyframes] }
            : el
        ));
      }
      
      setIsGenerating(false);
      setAiPrompt('');
    }, 2000);
  };

  const playAnimation = () => {
    setIsPlaying(true);
    setCurrentTime(0);
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= totalDuration) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const exportCode = () => {
    const selectedEl = elements.find(el => el.id === selectedElement);
    if (!selectedEl) return '';

    switch (exportFormat) {
      case 'framer':
        return `<motion.div
  initial={{ 
    ${selectedEl.animations.map(anim => `${anim.property}: ${anim.value}`).join(', ')}
  }}
  animate={{ 
    ${selectedEl.animations.map(anim => `${anim.property}: ${getAnimatedValue(anim)}`).join(', ')}
  }}
  transition={{ 
    duration: ${selectedEl.animations[0]?.duration || 0.5},
    ease: "${selectedEl.animations[0]?.easing || 'easeOut'}"
  }}
>
  {children}
</motion.div>`;

      case 'gsap':
        return `gsap.fromTo(element, 
  { 
    ${selectedEl.animations.map(anim => `${anim.property}: ${anim.value}`).join(', ')}
  }, 
  { 
    ${selectedEl.animations.map(anim => `${anim.property}: ${getAnimatedValue(anim)}`).join(', ')},
    duration: ${selectedEl.animations[0]?.duration || 0.5},
    ease: "${selectedEl.animations[0]?.easing || 'power2.out'}"
  }
);`;

      case 'css':
        return `@keyframes ${selectedEl.name.toLowerCase().replace(/\s+/g, '-')} {
  from { 
    ${selectedEl.animations.map(anim => `${getCSSProperty(anim.property)}: ${anim.value}${getCSSUnit(anim.property)}`).join('; ')}
  }
  to { 
    ${selectedEl.animations.map(anim => `${getCSSProperty(anim.property)}: ${getAnimatedValue(anim)}${getCSSUnit(anim.property)}`).join('; ')}
  }
}

.${selectedEl.name.toLowerCase().replace(/\s+/g, '-')} {
  animation: ${selectedEl.name.toLowerCase().replace(/\s+/g, '-')} ${selectedEl.animations[0]?.duration || 0.5}s ${selectedEl.animations[0]?.easing || 'ease-out'};
}`;

      default:
        return '';
    }
  };

  const getAnimatedValue = (anim: AnimationKeyframe) => {
    switch (anim.property) {
      case 'opacity':
      case 'scale':
        return 1;
      case 'x':
      case 'y':
        return 0;
      case 'rotate':
        return 0;
      default:
        return anim.value;
    }
  };

  const getCSSProperty = (property: string) => {
    switch (property) {
      case 'x':
      case 'y':
      case 'scale':
      case 'rotate':
        return 'transform';
      default:
        return property;
    }
  };

  const getCSSUnit = (property: string) => {
    switch (property) {
      case 'x':
      case 'y':
      case 'borderRadius':
        return 'px';
      case 'rotate':
        return 'deg';
      case 'opacity':
      case 'scale':
        return '';
      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportCode());
  };

  const applyPreset = (preset: AnimationPreset) => {
    if (selectedElement) {
      setElements(prev => prev.map(el => 
        el.id === selectedElement 
          ? { ...el, animations: [...el.animations, ...preset.keyframes] }
          : el
      ));
    }
    setShowPresets(false);
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
                <Zap className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Animation Composer</h1>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">BETA</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCollaborationMode(!collaborationMode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  collaborationMode ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Users size={16} className="mr-2" />
                {collaborationMode ? 'Live' : 'Solo'}
              </button>
              <button
                onClick={() => setShowPresets(!showPresets)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showPresets ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Package size={16} className="mr-2" />
                Presets
              </button>
              <button
                onClick={() => setShowCode(!showCode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showCode ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Code size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar - Elements & Properties */}
        <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col">
          {/* AI Generator */}
          <div className="p-6 border-b border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Brain size={20} className="mr-2 text-purple-400" />
              AI Animation Generator
            </h3>
            <div className="space-y-3">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your animation: 'slide in from left with bounce'"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
              />
              <button
                onClick={generateAIAnimation}
                disabled={isGenerating || !aiPrompt}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center justify-center disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 animate-spin" size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2" size={16} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Element Library */}
          <div className="p-6 border-b border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Elements</h3>
            <div className="grid grid-cols-2 gap-3">
              {elementTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => addElement(type.type)}
                  className="flex flex-col items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-600/30 transition-colors group"
                >
                  <type.icon size={24} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-300">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Element Properties */}
          {selectedElement && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>
              <div className="space-y-4">
                {animationProperties.map((prop) => (
                  <div key={prop.property}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {prop.label}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Value"
                      />
                      <button
                        onClick={() => addKeyframe(selectedElement, prop.property, 0, currentTime)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Controls */}
          <div className="bg-gray-800/30 border-b border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Playback Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={playAnimation}
                    disabled={isPlaying}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Play size={16} className="mr-2" />
                    Play
                  </button>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Pause size={16} className="mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={() => setCurrentTime(0)}
                    className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Reset
                  </button>
                </div>

                {/* Timeline Toggle */}
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    showTimeline ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <BarChart3 size={16} className="mr-2" />
                  Timeline
                </button>
              </div>

              {/* Device Preview */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveDevice('desktop')}
                  className={`p-2 rounded ${activeDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  <Monitor size={16} />
                </button>
                <button
                  onClick={() => setActiveDevice('tablet')}
                  className={`p-2 rounded ${activeDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  <Tablet size={16} />
                </button>
                <button
                  onClick={() => setActiveDevice('mobile')}
                  className={`p-2 rounded ${activeDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  <Smartphone size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <div
              ref={canvasRef}
              className={`relative mx-auto bg-white shadow-2xl transition-all duration-300 ${
                activeDevice === 'mobile' ? 'w-80 h-[600px]' :
                activeDevice === 'tablet' ? 'w-[768px] h-[600px]' : 'w-full h-full'
              }`}
              style={{ minHeight: '600px' }}
            >
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
              </div>

              {/* Elements */}
              <AnimatePresence>
                {elements.map((element) => (
                  <motion.div
                    key={element.id}
                    className={`absolute cursor-pointer border-2 transition-colors ${
                      selectedElement === element.id ? 'border-blue-500' : 'border-transparent hover:border-gray-400'
                    }`}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      backgroundColor: element.style.backgroundColor,
                      color: element.style.color,
                      borderRadius: element.style.borderRadius,
                      fontSize: element.style.fontSize
                    }}
                    onClick={() => setSelectedElement(element.id)}
                    animate={isPlaying ? {
                      // Apply animations based on current time
                      ...element.animations.reduce((acc, anim) => {
                        if (currentTime >= anim.time) {
                          acc[anim.property] = getAnimatedValue(anim);
                        }
                        return acc;
                      }, {} as any)
                    } : {}}
                    transition={{ duration: 0.1 }}
                  >
                    {element.type === 'text' && (
                      <div className="w-full h-full flex items-center justify-center">
                        {element.content}
                      </div>
                    )}
                    {element.type === 'card' && (
                      <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                        Card
                      </div>
                    )}
                    {element.type === 'button' && (
                      <div className="w-full h-full flex items-center justify-center text-white font-semibold rounded-lg">
                        Button
                      </div>
                    )}
                    {element.type === 'svg' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <Star size={32} className="text-yellow-500" />
                      </div>
                    )}
                    {element.type === 'image' && (
                      <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center">
                        <Image size={32} className="text-gray-500" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Selection Indicator */}
              {selectedElement && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  {elements.find(el => el.id === selectedElement)?.name}
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          {showTimeline && (
            <div className="h-48 bg-gray-800/50 border-t border-gray-700/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Timeline</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    {currentTime.toFixed(1)}s / {totalDuration}s
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={totalDuration}
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                    className="w-32 accent-blue-600"
                  />
                </div>
              </div>
              
              <div ref={timelineRef} className="relative h-24 bg-gray-700/30 rounded-lg overflow-x-auto">
                {/* Timeline ruler */}
                <div className="absolute top-0 left-0 right-0 h-6 border-b border-gray-600">
                  {Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-l border-gray-600 text-xs text-gray-400 pl-1"
                      style={{ left: `${(i / totalDuration) * 100}%` }}
                    >
                      {i}s
                    </div>
                  ))}
                </div>

                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                />

                {/* Keyframes */}
                {elements.map((element, elementIndex) => (
                  <div
                    key={element.id}
                    className="absolute h-6 bg-blue-600/20 border border-blue-600/50 rounded"
                    style={{
                      top: 24 + elementIndex * 28,
                      left: 0,
                      right: 0,
                      height: 24
                    }}
                  >
                    <span className="text-xs text-white px-2 py-1">{element.name}</span>
                    {element.animations.map((anim) => (
                      <div
                        key={anim.id}
                        className="absolute top-0 bottom-0 w-2 bg-blue-600 rounded cursor-pointer hover:bg-blue-500"
                        style={{ left: `${(anim.time / totalDuration) * 100}%` }}
                        title={`${anim.property}: ${anim.value}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Code Export */}
        {showCode && (
          <div className="w-96 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 flex flex-col">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Export Code</h3>
              <div className="flex space-x-2 mb-4">
                {(['framer', 'gsap', 'css'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      exportFormat === format
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {format === 'framer' ? 'Framer Motion' : format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="relative">
                <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  <code>{exportCode()}</code>
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700/50">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                <Download size={16} className="mr-2" />
                Export Animation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Presets Modal */}
      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPresets(false)}
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
                  <h3 className="text-2xl font-bold text-white">Animation Presets</h3>
                  <button
                    onClick={() => setShowPresets(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {animationPresets.map((preset) => (
                    <motion.div
                      key={preset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-700/30 rounded-xl p-6 cursor-pointer hover:bg-gray-600/30 transition-colors"
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="aspect-video bg-gray-600 rounded-lg mb-4 flex items-center justify-center">
                        <Play size={32} className="text-gray-400" />
                      </div>
                      
                      <h4 className="font-semibold text-white mb-2">{preset.name}</h4>
                      <p className="text-gray-400 text-sm mb-4">{preset.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{preset.category}</span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <ThumbsUp size={12} className="mr-1" />
                            {preset.likes}
                          </span>
                          <span className="flex items-center">
                            <Download size={12} className="mr-1" />
                            {preset.downloads}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <span className="text-sm text-gray-300">2 users online</span>
              </div>
              
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Link2 size={16} className="mr-2" />
                Share Session
              </button>
              
              <div className="text-xs text-gray-400">
                Collaborate on animations in real-time
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimationComposer;