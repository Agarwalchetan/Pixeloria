import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, RefreshCw, Copy, Download, Heart, Share2, 
  Sparkles, Eye, Lock, Unlock, ArrowLeft, Save
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name: string;
  locked: boolean;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  likes: number;
  tags: string[];
}

const ColorGenerator: React.FC = () => {
  const [currentPalette, setCurrentPalette] = useState<Color[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'random' | 'complementary' | 'analogous' | 'triadic'>('random');
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colorModes = [
    { id: 'random', name: 'Random', description: 'AI-generated random colors' },
    { id: 'complementary', name: 'Complementary', description: 'Opposite colors on color wheel' },
    { id: 'analogous', name: 'Analogous', description: 'Adjacent colors on color wheel' },
    { id: 'triadic', name: 'Triadic', description: 'Three evenly spaced colors' }
  ];

  const colorNames = [
    'Midnight Blue', 'Ocean Breeze', 'Sunset Orange', 'Forest Green', 'Lavender Dream',
    'Coral Pink', 'Golden Hour', 'Deep Purple', 'Mint Fresh', 'Cherry Red',
    'Sky Blue', 'Emerald', 'Amber', 'Rose Gold', 'Teal', 'Crimson'
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

  const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  };

  const generateComplementaryColors = (base: string): string[] => {
    const rgb = hexToRgb(base);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [base];
    
    for (let i = 1; i < 5; i++) {
      const newHue = (hsl.h + 180 + (i * 30)) % 360;
      const newSat = Math.max(20, hsl.s + (i * 10));
      const newLight = Math.max(20, Math.min(80, hsl.l + (i * 15)));
      colors.push(hslToHex(newHue, newSat, newLight));
    }
    
    return colors;
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalette = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let newColors: string[] = [];
      
      switch (selectedMode) {
        case 'complementary':
          newColors = generateComplementaryColors(baseColor);
          break;
        case 'analogous':
          const rgb = hexToRgb(baseColor);
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          newColors = [baseColor];
          for (let i = 1; i < 5; i++) {
            const newHue = (hsl.h + (i * 30)) % 360;
            newColors.push(hslToHex(newHue, hsl.s, hsl.l));
          }
          break;
        case 'triadic':
          const rgbTriadic = hexToRgb(baseColor);
          const hslTriadic = rgbToHsl(rgbTriadic.r, rgbTriadic.g, rgbTriadic.b);
          newColors = [baseColor];
          for (let i = 1; i < 5; i++) {
            const newHue = (hslTriadic.h + (i * 120)) % 360;
            newColors.push(hslToHex(newHue, hslTriadic.s, hslTriadic.l));
          }
          break;
        default:
          newColors = Array.from({ length: 5 }, () => generateRandomColor());
      }

      const palette: Color[] = newColors.map((hex, index) => {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const existingColor = currentPalette[index];
        
        return {
          hex: existingColor?.locked ? existingColor.hex : hex,
          rgb: existingColor?.locked ? existingColor.rgb : rgb,
          hsl: existingColor?.locked ? existingColor.hsl : hsl,
          name: existingColor?.locked ? existingColor.name : colorNames[Math.floor(Math.random() * colorNames.length)],
          locked: existingColor?.locked || false
        };
      });

      setCurrentPalette(palette);
      setIsGenerating(false);
    }, 800);
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
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: `Palette ${savedPalettes.length + 1}`,
      colors: currentPalette,
      likes: 0,
      tags: [selectedMode, 'generated']
    };
    setSavedPalettes(prev => [...prev, newPalette]);
  };

  const exportPalette = (format: 'css' | 'json' | 'ase') => {
    let content = '';
    
    switch (format) {
      case 'css':
        content = `:root {\n${currentPalette.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join('\n')}\n}`;
        break;
      case 'json':
        content = JSON.stringify(currentPalette.map(c => ({ hex: c.hex, name: c.name })), null, 2);
        break;
      case 'ase':
        content = 'Adobe Swatch Exchange format not supported in browser';
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

  useEffect(() => {
    generatePalette();
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
                <Palette className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">AI Color Generator</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={savePalette}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
              <div className="relative">
                <select
                  onChange={(e) => exportPalette(e.target.value as 'css' | 'json' | 'ase')}
                  className="appearance-none bg-gray-700 text-white px-4 py-2 rounded-lg pr-8 hover:bg-gray-600 transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Export</option>
                  <option value="css">CSS Variables</option>
                  <option value="json">JSON</option>
                  <option value="ase">Adobe ASE</option>
                </select>
                <Download size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
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
                    <div>
                      <div className="text-white font-medium">{mode.name}</div>
                      <div className="text-gray-400 text-sm">{mode.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Base Color</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-full h-12 rounded-lg border-2 border-gray-600 bg-transparent cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <motion.button
              onClick={generatePalette}
              disabled={isGenerating}
              className="w-full btn-primary flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} size={20} />
              {isGenerating ? 'Generating...' : 'Generate Palette'}
            </motion.button>
          </div>

          {/* Main Palette */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Generated Palette</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Heart size={20} />
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
                          <div 
                            className="flex items-center justify-between text-xs text-gray-400 cursor-pointer hover:text-white transition-colors"
                            onClick={() => copyToClipboard(`${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%`, 'hsl')}
                          >
                            <span>HSL</span>
                            <span className="font-mono">{color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Palette Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden" style={{ backgroundColor: currentPalette[0]?.hex }}>
                    <div className="p-6" style={{ backgroundColor: currentPalette[1]?.hex }}>
                      <h4 className="text-white font-bold mb-2">Website Header</h4>
                      <p className="text-white/80 text-sm">This is how your palette might look in a real design.</p>
                      <button 
                        className="mt-3 px-4 py-2 rounded text-white font-medium"
                        style={{ backgroundColor: currentPalette[2]?.hex }}
                      >
                        Call to Action
                      </button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg p-6" style={{ backgroundColor: currentPalette[3]?.hex }}>
                    <div className="space-y-3">
                      {currentPalette.slice(0, 3).map((color, index) => (
                        <div 
                          key={index}
                          className="h-4 rounded"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{palette.name}</span>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Heart size={16} />
                      <span className="text-sm">{palette.likes}</span>
                    </div>
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
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
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