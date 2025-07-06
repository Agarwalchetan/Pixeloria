import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Save, Share2, Download, Copy, 
  Code, FileText, Settings, Users, Sparkles, Brain,
  Monitor, Smartphone, Tablet, Maximize2, Minimize2,
  RotateCcw, Upload, Folder, GitFork, Star, Eye,
  Zap, Coffee, MessageSquare, HelpCircle, Target,
  Plus, Minus, ChevronDown, ChevronRight, Search,
  Package, Tag, Link2, ExternalLink, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isActive: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  files: Omit<CodeFile, 'id' | 'isActive'>[];
  preview: string;
  tags: string[];
  author: string;
  likes: number;
  forks: number;
}

interface AIAssistant {
  isActive: boolean;
  suggestions: string[];
  currentSuggestion: string;
}

const CodePlayground: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Code Playground</h1>
        <p>Start building something amazing!</p>
        <button onclick="handleClick()">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      isActive: true
    },
    {
      id: '2',
      name: 'style.css',
      language: 'css',
      content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
    max-width: 400px;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}

p {
    color: #666;
    margin-bottom: 2rem;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s ease;
}

button:hover {
    background: #5a6fd8;
}`,
      isActive: false
    },
    {
      id: '3',
      name: 'script.js',
      language: 'javascript',
      content: `function handleClick() {
    const button = document.querySelector('button');
    const container = document.querySelector('.container');
    
    button.textContent = 'Clicked!';
    container.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        button.textContent = 'Click Me';
        container.style.transform = 'scale(1)';
    }, 1000);
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    console.log('Code Playground loaded successfully!');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            console.log('Save shortcut triggered');
        }
    });
});`,
      isActive: false
    }
  ]);

  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [aiAssistant, setAiAssistant] = useState<AIAssistant>({
    isActive: false,
    suggestions: [],
    currentSuggestion: ''
  });
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const templates: Template[] = [
    {
      id: 'react-starter',
      name: 'React Starter',
      description: 'Basic React component with hooks',
      category: 'React',
      files: [
        {
          name: 'App.jsx',
          language: 'javascript',
          content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>React Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;`
        }
      ],
      preview: 'react-preview.jpg',
      tags: ['React', 'Hooks', 'Counter'],
      author: 'Pixeloria Team',
      likes: 245,
      forks: 67
    },
    {
      id: 'css-animations',
      name: 'CSS Animations',
      description: 'Beautiful CSS animations and transitions',
      category: 'CSS',
      files: [
        {
          name: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html>
<head>
    <title>CSS Animations</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="animation-container">
        <div class="floating-card">
            <h2>Floating Card</h2>
            <p>Hover me for animation!</p>
        </div>
    </div>
</body>
</html>`
        },
        {
          name: 'style.css',
          language: 'css',
          content: `@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.floating-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: float 3s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.floating-card:hover {
  transform: scale(1.1) translateY(-10px);
}`
        }
      ],
      preview: 'css-preview.jpg',
      tags: ['CSS', 'Animations', 'Keyframes'],
      author: 'Design Team',
      likes: 189,
      forks: 43
    },
    {
      id: 'js-game',
      name: 'Simple Game',
      description: 'Interactive JavaScript game',
      category: 'JavaScript',
      files: [
        {
          name: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html>
<head>
    <title>Simple Game</title>
    <style>
        canvas { border: 2px solid #333; display: block; margin: 20px auto; }
        body { text-align: center; font-family: Arial; }
    </style>
</head>
<body>
    <h1>Catch the Dots!</h1>
    <canvas id="gameCanvas" width="400" height="300"></canvas>
    <p>Score: <span id="score">0</span></p>
    <script src="game.js"></script>
</body>
</html>`
        },
        {
          name: 'game.js',
          language: 'javascript',
          content: `const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let score = 0;
let dots = [];

function createDot() {
    return {
        x: Math.random() * (canvas.width - 20),
        y: Math.random() * (canvas.height - 20),
        radius: 10,
        color: \`hsl(\${Math.random() * 360}, 70%, 50%)\`
    };
}

function drawDot(dot) {
    ctx.beginPath();
    ctx.arc(dot.x + dot.radius, dot.y + dot.radius, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = dot.color;
    ctx.fill();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (dots.length < 3) {
        dots.push(createDot());
    }
    
    dots.forEach(drawDot);
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    dots = dots.filter(dot => {
        const distance = Math.sqrt((x - (dot.x + dot.radius))**2 + (y - (dot.y + dot.radius))**2);
        if (distance < dot.radius) {
            score++;
            scoreElement.textContent = score;
            return false;
        }
        return true;
    });
});

gameLoop();`
        }
      ],
      preview: 'game-preview.jpg',
      tags: ['JavaScript', 'Canvas', 'Game'],
      author: 'Game Dev',
      likes: 156,
      forks: 89
    }
  ];

  const activeFile = files.find(file => file.isActive);

  const updateFileContent = (content: string) => {
    setFiles(prev => prev.map(file => 
      file.isActive ? { ...file, content } : file
    ));
  };

  const switchFile = (fileId: string) => {
    setFiles(prev => prev.map(file => ({
      ...file,
      isActive: file.id === fileId
    })));
  };

  const addNewFile = () => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: 'new-file.js',
      language: 'javascript',
      content: '// New file\n',
      isActive: true
    };
    
    setFiles(prev => [
      ...prev.map(file => ({ ...file, isActive: false })),
      newFile
    ]);
  };

  const deleteFile = (fileId: string) => {
    if (files.length <= 1) return;
    
    setFiles(prev => {
      const filtered = prev.filter(file => file.id !== fileId);
      if (prev.find(file => file.id === fileId)?.isActive && filtered.length > 0) {
        filtered[0].isActive = true;
      }
      return filtered;
    });
  };

  const runCode = () => {
    setIsRunning(true);
    setConsoleOutput(['Running code...']);
    
    // Simulate code execution
    setTimeout(() => {
      const htmlFile = files.find(f => f.language === 'html');
      const cssFile = files.find(f => f.language === 'css');
      const jsFile = files.find(f => f.language === 'javascript');
      
      if (iframeRef.current && htmlFile) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          let htmlContent = htmlFile.content;
          
          if (cssFile) {
            htmlContent = htmlContent.replace(
              '<link rel="stylesheet" href="style.css">',
              `<style>${cssFile.content}</style>`
            );
          }
          
          if (jsFile) {
            htmlContent = htmlContent.replace(
              '<script src="script.js"></script>',
              `<script>${jsFile.content}</script>`
            );
          }
          
          doc.open();
          doc.write(htmlContent);
          doc.close();
        }
      }
      
      setConsoleOutput(['Code executed successfully!']);
      setIsRunning(false);
    }, 1000);
  };

  const loadTemplate = (template: Template) => {
    const newFiles: CodeFile[] = template.files.map((file, index) => ({
      id: Date.now().toString() + index,
      name: file.name,
      language: file.language,
      content: file.content,
      isActive: index === 0
    }));
    
    setFiles(newFiles);
    setShowTemplates(false);
    setSelectedTemplate(template.id);
  };

  const generateAICode = () => {
    setAiAssistant(prev => ({ ...prev, isActive: true }));
    
    // Simulate AI code generation
    setTimeout(() => {
      const suggestions = [
        "Add responsive design with CSS Grid",
        "Implement dark mode toggle",
        "Add form validation",
        "Create loading animations",
        "Add accessibility features"
      ];
      
      setAiAssistant({
        isActive: false,
        suggestions,
        currentSuggestion: suggestions[Math.floor(Math.random() * suggestions.length)]
      });
    }, 2000);
  };

  const exportProject = () => {
    const projectData = {
      name: 'My Code Playground Project',
      files: files.map(({ isActive, ...file }) => file),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-project.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProject = () => {
    // Simulate sharing functionality
    navigator.clipboard.writeText(window.location.href + '?shared=true');
    alert('Project link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="container-custom py-4">
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
                <Code className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Live Code Playground</h1>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">BETA</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showTemplates ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Package size={16} className="mr-2" />
                Templates
              </button>
              <button
                onClick={generateAICode}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  aiAssistant.isActive ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Brain size={16} className="mr-2" />
                AI Assist
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
              <button
                onClick={shareProject}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Share2 size={16} className="mr-2" />
                Share
              </button>
              <button
                onClick={exportProject}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        {showFileExplorer && (
          <div className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col">
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Files</h3>
                <button
                  onClick={addNewFile}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      file.isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                    onClick={() => switchFile(file.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText size={16} />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    {files.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.id);
                        }}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Panel */}
            {aiAssistant.suggestions.length > 0 && (
              <div className="p-4 border-b border-gray-700/50">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Sparkles size={16} className="mr-2 text-purple-400" />
                  AI Suggestions
                </h4>
                <div className="space-y-2">
                  {aiAssistant.suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left text-xs p-2 bg-gray-700/30 hover:bg-gray-600/30 rounded text-gray-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Console Output */}
            <div className="flex-1 p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Target size={16} className="mr-2 text-green-400" />
                Console
              </h4>
              <div className="bg-gray-900/50 rounded-lg p-3 text-xs font-mono">
                {consoleOutput.map((line, index) => (
                  <div key={index} className="text-green-400 mb-1">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor and Preview */}
        <div className="flex-1 flex flex-col">
          {/* Editor Controls */}
          <div className="bg-gray-800/30 border-b border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Play size={16} className="mr-2" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                
                <button
                  onClick={() => setShowFileExplorer(!showFileExplorer)}
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Folder size={16} className="mr-2" />
                  {showFileExplorer ? 'Hide' : 'Show'} Files
                </button>
              </div>

              <div className="flex items-center space-x-4">
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

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Editor and Preview Split */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              {/* File Tabs */}
              <div className="flex bg-gray-800/30 border-b border-gray-700/50">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => switchFile(file.id)}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-r border-gray-700/50 ${
                      file.isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>

              {/* Editor */}
              <div className="flex-1 relative">
                <textarea
                  ref={editorRef}
                  value={activeFile?.content || ''}
                  onChange={(e) => updateFileContent(e.target.value)}
                  className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                  placeholder="Start coding..."
                  spellCheck={false}
                />
                
                {/* Line Numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800/50 border-r border-gray-700/50 p-4 text-xs text-gray-500 font-mono">
                  {activeFile?.content.split('\n').map((_, index) => (
                    <div key={index} className="leading-5">
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 border-l border-gray-700/50 bg-white">
              <div className="h-full flex flex-col">
                <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Preview</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                <div className={`flex-1 transition-all duration-300 ${
                  activeDevice === 'mobile' ? 'max-w-sm mx-auto' :
                  activeDevice === 'tablet' ? 'max-w-md mx-auto' : 'w-full'
                }`}>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-0"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplates(false)}
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
                  <h3 className="text-2xl font-bold text-white">Code Templates</h3>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-700/30 rounded-xl p-6 cursor-pointer hover:bg-gray-600/30 transition-colors"
                      onClick={() => loadTemplate(template)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white">{template.name}</h4>
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          {template.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>by {template.author}</span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Star size={12} className="mr-1" />
                            {template.likes}
                          </span>
                          <span className="flex items-center">
                            <GitFork size={12} className="mr-1" />
                            {template.forks}
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
                <span className="text-sm text-gray-300">2 developers online</span>
              </div>
              
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Link2 size={16} className="mr-2" />
                Share Session
              </button>
              
              <div className="text-xs text-gray-400">
                Code together in real-time
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodePlayground;