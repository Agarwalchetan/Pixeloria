import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, RefreshCw, Copy, Download, Heart, Share2, 
  Sparkles, Eye, Lock, Unlock, ArrowLeft, Save, Brain,
  Zap, Target, Users, FileText, Settings, BarChart3,
  Lightbulb, Wand2, Sliders, Monitor, Smartphone, Tablet,
  Star, Shield, AlertTriangle, CheckCircle, Camera,
  MessageSquare, Link2, Code, Layers, Grid, Contrast
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name: string;
  locked: boolean;
  accessibility?: {
    wcagAA: boolean;
    wcagAAA: boolean;
    contrast: number;
  };
}

interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  likes: number;
  tags: string[];
  score: {
    accessibility: number;
    harmony: number;
    emotion: string;
    overall: number;
  };
  prompt?: string;
  aiModel?: string;
}

interface MockupComponent {
  id: string;
  name: string;
  component: React.ComponentType<{ colors: Color[] }>;
}

const ColorGenerator: React.FC = () => {
  const [currentPalette, setCurrentPalette] = useState<Color[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'ai' | 'harmony' | 'brand' | 'accessibility'>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiModel, setAiModel] = useState<'gpt-4' | 'custom'>('gpt-4');
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedMockup, setSelectedMockup] = useState<string>('landing');
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [paletteFormat, setPaletteFormat] = useState<'flat' | 'material' | 'tailwind' | 'brand'>('flat');

  // Landing Page Mockup
  const LandingPageMockup: React.FC<{ colors: Color[] }> = ({ colors }) => (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
      <div style={{ backgroundColor: colors[0]?.hex }} className="h-16 flex items-center px-6">
        <div className="w-8 h-8 rounded" style={{ backgroundColor: colors[1]?.hex }}></div>
        <div className="ml-auto flex space-x-2">
          {colors.slice(2, 4).map((color, i) => (
            <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: color.hex }}></div>
          ))}
        </div>
      </div>
      <div style={{ backgroundColor: colors[1]?.hex }} className="h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-4 rounded mb-2" style={{ backgroundColor: colors[0]?.hex }}></div>
          <div className="w-24 h-8 rounded" style={{ backgroundColor: colors[2]?.hex }}></div>
        </div>
      </div>
      <div style={{ backgroundColor: colors[2]?.hex }} className="h-16 flex items-center justify-center space-x-4">
        {colors.slice(3, 5).map((color, i) => (
          <div key={i} className="w-12 h-6 rounded" style={{ backgroundColor: color.hex }}></div>
        ))}
      </div>
    </div>
  );

  // Dashboard Mockup
  const DashboardMockup: React.FC<{ colors: Color[] }> = ({ colors }) => (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg flex">
      <div style={{ backgroundColor: colors[0]?.hex }} className="w-16 flex flex-col items-center py-4 space-y-2">
        {colors.slice(1, 4).map((color, i) => (
          <div key={i} className="w-8 h-8 rounded" style={{ backgroundColor: color.hex }}></div>
        ))}
      </div>
      <div className="flex-1" style={{ backgroundColor: colors[1]?.hex }}>
        <div style={{ backgroundColor: colors[2]?.hex }} className="h-12 flex items-center px-4">
          <div className="w-24 h-4 rounded" style={{ backgroundColor: colors[0]?.hex }}></div>
        </div>
        <div className="p-4 grid grid-cols-3 gap-2">
          {colors.slice(3, 6).map((color, i) => (
            <div key={i} className="h-16 rounded" style={{ backgroundColor: color.hex }}></div>
          ))}
        </div>
      </div>
    </div>
  );

  // Mobile App Mockup
  const MobileAppMockup: React.FC<{ colors: Color[] }> = ({ colors }) => (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
      <div style={{ backgroundColor: colors[0]?.hex }} className="h-12 flex items-center justify-between px-4">
        <div className="w-6 h-6 rounded" style={{ backgroundColor: colors[1]?.hex }}></div>
        <div className="w-16 h-4 rounded" style={{ backgroundColor: colors[1]?.hex }}></div>
        <div className="w-6 h-6 rounded" style={{ backgroundColor: colors[1]?.hex }}></div>
      </div>
      <div style={{ backgroundColor: colors[1]?.hex }} className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {colors.slice(2, 6).map((color, i) => (
            <div key={i} className="h-20 rounded-lg" style={{ backgroundColor: color.hex }}></div>
          ))}
        </div>
      </div>
      <div style={{ backgroundColor: colors[2]?.hex }} className="h-16 flex items-center justify-around">
        {colors.slice(3, 6).map((color, i) => (
          <div key={i} className="w-8 h-8 rounded-full" style={{ backgroundColor: color.hex }}></div>
        ))}
      </div>
    </div>
  );

  const mockupComponents: MockupComponent[] = [
    { id: 'landing', name: 'Landing Page', component: LandingPageMockup },
    { id: 'dashboard', name: 'Dashboard', component: DashboardMockup },
    { id: 'mobile', name: 'Mobile App', component: MobileAppMockup }
  ];

  const colorModes = [
    { 
      id: 'ai', 
      name: 'AI Prompt', 
      description: 'Generate with AI prompts',
      icon: Brain
    },
    { 
      id: 'harmony', 
      name: 'Color Harmony', 
      description: 'Based on color theory',
      icon: Target
    },
    { 
      id: 'brand', 
      name: 'Brand-Centric', 
      description: 'Logo and brand colors',
      icon: Star
    },
    { 
      id: 'accessibility', 
      name: 'Accessibility First', 
      description: 'WCAG compliant palettes',
      icon: Shield
    }
  ];

  const aiPrompts = [
    "Design a palette for a Zen meditation app in fall colors",
    "Create energetic colors for a fitness tracking app",
    "Generate calming colors for a healthcare platform",
    "Design vibrant colors for a creative portfolio",
    "Create professional colors for a fintech dashboard"
  ];

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const calculateContrast = (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const generateAIPalette = async (prompt: string, model: string): Promise<string[]> => {
    // Simulate AI generation
    setIsGenerating(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock AI-generated colors based on prompt keywords
        let colors: string[] = [];
        
        if (prompt.toLowerCase().includes('zen') || prompt.toLowerCase().includes('meditation')) {
          colors = ['#8B7355', '#D4B896', '#F5E6D3', '#E8DCC6', '#A0937D'];
        } else if (prompt.toLowerCase().includes('fitness') || prompt.toLowerCase().includes('energetic')) {
          colors = ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2'];
        } else if (prompt.toLowerCase().includes('healthcare') || prompt.toLowerCase().includes('calming')) {
          colors = ['#4A90E2', '#7ED321', '#F5A623', '#D0021B', '#9013FE'];
        } else {
          colors = Array.from({ length: 5 }, () => 
            '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
          );
        }
        
        resolve(colors);
        setIsGenerating(false);
      }, 2000);
    });
  };

  const generatePalette = async () => {
    setIsGenerating(true);
    
    let newColors: string[] = [];
    
    if (selectedMode === 'ai' && aiPrompt) {
      newColors = await generateAIPalette(aiPrompt, aiModel);
    } else {
      // Fallback to random generation
      newColors = Array.from({ length: 5 }, () => 
        '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      );
    }

    const palette: Color[] = newColors.map((hex, index) => {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const existingColor = currentPalette[index];
      
      // Calculate accessibility
      const whiteContrast = calculateContrast(hex, '#FFFFFF');
      const blackContrast = calculateContrast(hex, '#000000');
      const maxContrast = Math.max(whiteContrast, blackContrast);
      
      return {
        hex: existingColor?.locked ? existingColor.hex : hex,
        rgb: existingColor?.locked ? existingColor.rgb : rgb,
        hsl: existingColor?.locked ? existingColor.hsl : hsl,
        name: existingColor?.locked ? existingColor.name : `Color ${index + 1}`,
        locked: existingColor?.locked || false,
        accessibility: {
          wcagAA: maxContrast >= 4.5,
          wcagAAA: maxContrast >= 7,
          contrast: Math.round(maxContrast * 100) / 100
        }
      };
    });

    setCurrentPalette(palette);
    setIsGenerating(false);
  };

  const scorePalette = (palette: Color[]): ColorPalette['score'] => {
    const accessibilityScore = palette.reduce((acc, color) => {
      return acc + (color.accessibility?.wcagAA ? 20 : 0);
    }, 0);

    const harmonyScore = 85; // Mock harmony calculation
    const emotion = aiPrompt.toLowerCase().includes('calm') ? 'Calming' : 
                   aiPrompt.toLowerCase().includes('energetic') ? 'Energetic' : 'Balanced';
    
    const overall = Math.round((accessibilityScore + harmonyScore) / 2);

    return {
      accessibility: accessibilityScore,
      harmony: harmonyScore,
      emotion,
      overall
    };
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(`${type}:${text}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const toggleLock = (index: number) => {
    setCurrentPalette(prev => prev.map((color, i) => 
      i === index ? { ...color, locked: !color.locked } : color
    ));
  };

  const savePalette = () => {
    const score = scorePalette(currentPalette);
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: aiPrompt || `Palette ${savedPalettes.length + 1}`,
      colors: currentPalette,
      likes: 0,
      tags: [selectedMode, paletteFormat],
      score,
      prompt: aiPrompt,
      aiModel
    };
    setSavedPalettes(prev => [...prev, newPalette]);
  };

  const exportPalette = (format: 'css' | 'json' | 'figma' | 'adobe') => {
    let content = '';
    
    switch (format) {
      case 'css':
        content = `:root {\n${currentPalette.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join('\n')}\n}`;
        break;
      case 'json':
        content = JSON.stringify({
          palette: currentPalette.map(c => ({ hex: c.hex, name: c.name })),
          metadata: { prompt: aiPrompt, model: aiModel, format: paletteFormat }
        }, null, 2);
        break;
      case 'figma':
        content = 'Figma plugin format - Copy this JSON to Figma Color Palette plugin';
        break;
      case 'adobe':
        content = 'Adobe Swatch Exchange format - Use Adobe Color CC';
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateAccessibilityReport = () => {
    const report = {
      palette: currentPalette,
      summary: {
        totalColors: currentPalette.length,
        wcagAACompliant: currentPalette.filter(c => c.accessibility?.wcagAA).length,
        wcagAAACompliant: currentPalette.filter(c => c.accessibility?.wcagAAA).length,
        averageContrast: currentPalette.reduce((acc, c) => acc + (c.accessibility?.contrast || 0), 0) / currentPalette.length
      },
      recommendations: [
        'Consider using darker shades for better text contrast',
        'Test color combinations in different lighting conditions',
        'Verify colors work for colorblind users'
      ]
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accessibility-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (currentPalette.length === 0) {
      generatePalette();
    }
  }, []);

  const currentMockup = mockupComponents.find(m => m.id === selectedMockup);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Enhanced Header */}
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
                <Palette className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">AI Color Generator Pro</h1>
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
                onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showAccessibilityPanel ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Shield size={16} className="mr-2" />
                A11y
              </button>
              <button
                onClick={savePalette}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
              <div className="relative">
                <select
                  onChange={(e) => exportPalette(e.target.value as any)}
                  className="appearance-none bg-gray-700 text-white px-4 py-2 rounded-lg pr-8 hover:bg-gray-600 transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Export</option>
                  <option value="css">CSS Variables</option>
                  <option value="json">JSON</option>
                  <option value="figma">Figma Plugin</option>
                  <option value="adobe">Adobe CC</option>
                </select>
                <Download size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Prompt Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-400" />
                AI Generation
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setAiModel('gpt-4')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        aiModel === 'gpt-4' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      GPT-4
                    </button>
                    <button
                      onClick={() => setAiModel('custom')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        aiModel === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe your desired palette..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quick Prompts</label>
                  <div className="space-y-1">
                    {aiPrompts.slice(0, 3).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setAiPrompt(prompt)}
                        className="w-full text-left text-xs px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded text-gray-300 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Mode */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Generation Mode</h3>
              <div className="space-y-3">
                {colorModes.map((mode) => (
                  <label key={mode.id} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value={mode.id}
                      checked={selectedMode === mode.id}
                      onChange={(e) => setSelectedMode(e.target.value as any)}
                      className="mt-1 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <mode.icon size={16} className="text-blue-400" />
                        <span className="text-white font-medium">{mode.name}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{mode.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Palette Format */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Format Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {['flat', 'material', 'tailwind', 'brand'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setPaletteFormat(format as any)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      paletteFormat === format ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {format.charAt(0).toUpperCase() + format.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={generatePalette}
              disabled={isGenerating}
              className="w-full btn-primary flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2" size={20} />
                  Generate Palette
                </>
              )}
            </motion.button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Palette Score Card */}
            {currentPalette.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Palette Analysis</h3>
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={16} className="text-blue-400" />
                    <span className="text-blue-400 font-bold">
                      {scorePalette(currentPalette).overall}/100
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {scorePalette(currentPalette).accessibility}%
                    </div>
                    <div className="text-sm text-gray-400">Accessibility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {scorePalette(currentPalette).harmony}%
                    </div>
                    <div className="text-sm text-gray-400">Harmony</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {scorePalette(currentPalette).emotion}
                    </div>
                    <div className="text-sm text-gray-400">Emotion</div>
                  </div>
                </div>
              </div>
            )}

            {/* Color Palette */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {aiPrompt || 'Generated Palette'}
                </h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCollaborationMode(!collaborationMode)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Users size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <AnimatePresence mode="wait">
                  {currentPalette.map((color, index) => (
                    <motion.div
                      key={`${color.hex}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div
                        className="aspect-square rounded-xl shadow-lg cursor-pointer relative overflow-hidden"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                        
                        {/* Accessibility Indicator */}
                        <div className="absolute top-2 left-2">
                          {color.accessibility?.wcagAAA ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : color.accessibility?.wcagAA ? (
                            <AlertTriangle size={16} className="text-yellow-400" />
                          ) : (
                            <AlertTriangle size={16} className="text-red-400" />
                          )}
                        </div>

                        <button
                          onClick={() => toggleLock(index)}
                          className="absolute top-2 right-2 p-1.5 bg-black/20 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {color.locked ? (
                            <Lock size={16} className="text-white" />
                          ) : (
                            <Unlock size={16} className="text-white" />
                          )}
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => copyToClipboard(color.hex, 'hex')}
                              className="flex-1 bg-white/20 backdrop-blur-sm text-white text-xs py-1 rounded hover:bg-white/30 transition-colors"
                            >
                              HEX
                            </button>
                            <button
                              onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'rgb')}
                              className="flex-1 bg-white/20 backdrop-blur-sm text-white text-xs py-1 rounded hover:bg-white/30 transition-colors"
                            >
                              RGB
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="text-white font-medium text-sm">{color.name}</div>
                        <div className="space-y-1">
                          <div 
                            className="flex items-center justify-between text-xs text-gray-400 cursor-pointer hover:text-white transition-colors"
                            onClick={() => copyToClipboard(color.hex, 'hex')}
                          >
                            <span>HEX</span>
                            <span className="font-mono">{color.hex}</span>
                          </div>
                          <div 
                            className="flex items-center justify-between text-xs text-gray-400 cursor-pointer hover:text-white transition-colors"
                            onClick={() => copyToClipboard(`${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`, 'rgb')}
                          >
                            <span>RGB</span>
                            <span className="font-mono">{color.rgb.r}, {color.rgb.g}, {color.rgb.b}</span>
                          </div>
                          {color.accessibility && (
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Contrast</span>
                              <span className="font-mono">{color.accessibility.contrast}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Live Component Mockups */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                <div className="flex items-center space-x-2">
                  {/* Device Toggle */}
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

              {/* Mockup Tabs */}
              <div className="flex space-x-2 mb-6">
                {mockupComponents.map((mockup) => (
                  <button
                    key={mockup.id}
                    onClick={() => setSelectedMockup(mockup.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedMockup === mockup.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {mockup.name}
                  </button>
                ))}
              </div>

              {/* Mockup Display */}
              <div className={`mx-auto transition-all duration-300 ${
                activeDevice === 'mobile' ? 'max-w-sm' :
                activeDevice === 'tablet' ? 'max-w-md' : 'max-w-full'
              }`}>
                {currentMockup && <currentMockup.component colors={currentPalette} />}
              </div>
            </div>

            {/* Accessibility Panel */}
            <AnimatePresence>
              {showAccessibilityPanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <Shield size={20} className="mr-2 text-green-400" />
                        Accessibility Audit
                      </h3>
                      <button
                        onClick={generateAccessibilityReport}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FileText size={16} className="mr-2" />
                        Export Report
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">WCAG AA</h4>
                        <div className="text-2xl font-bold text-green-400">
                          {currentPalette.filter(c => c.accessibility?.wcagAA).length}/{currentPalette.length}
                        </div>
                        <div className="text-sm text-gray-400">Colors compliant</div>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">WCAG AAA</h4>
                        <div className="text-2xl font-bold text-blue-400">
                          {currentPalette.filter(c => c.accessibility?.wcagAAA).length}/{currentPalette.length}
                        </div>
                        <div className="text-sm text-gray-400">Colors compliant</div>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">Avg Contrast</h4>
                        <div className="text-2xl font-bold text-purple-400">
                          {Math.round(currentPalette.reduce((acc, c) => acc + (c.accessibility?.contrast || 0), 0) / currentPalette.length * 10) / 10}
                        </div>
                        <div className="text-sm text-gray-400">Contrast ratio</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-white mb-3">Recommendations</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-center">
                          <Lightbulb size={14} className="mr-2 text-yellow-400" />
                          Consider using darker shades for better text contrast
                        </li>
                        <li className="flex items-center">
                          <Lightbulb size={14} className="mr-2 text-yellow-400" />
                          Test color combinations in different lighting conditions
                        </li>
                        <li className="flex items-center">
                          <Lightbulb size={14} className="mr-2 text-yellow-400" />
                          Verify colors work for colorblind users
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                  <span className="text-sm text-gray-300">2 users online</span>
                </div>
                
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Link2 size={16} className="mr-2" />
                  Share Link
                </button>
                
                <div className="text-xs text-gray-400">
                  Share this link to collaborate in real-time
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Palettes */}
        {savedPalettes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-6">Saved Palettes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPalettes.map((palette) => (
                <div key={palette.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex space-x-1 mb-3">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 h-12 rounded"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{palette.name}</span>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Heart size={16} />
                      <span className="text-sm">{palette.likes}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {palette.score.overall}/100
                      </span>
                      {palette.aiModel && (
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                          {palette.aiModel}
                        </span>
                      )}
                    </div>
                    <button className="text-xs text-blue-400 hover:text-blue-300">
                      Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy Notification */}
      <AnimatePresence>
        {copiedColor && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
          >
            <Copy size={16} className="mr-2" />
            Copied {copiedColor}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorGenerator;