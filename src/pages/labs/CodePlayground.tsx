import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Download, Share2, ArrowLeft, Copy, RotateCcw, 
  Code, Eye, Settings, Maximize2, Minimize2, Save
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  category: string;
}

const CodePlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('basic');
  const [code, setCode] = useState({
    html: '',
    css: '',
    js: ''
  });
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const templates: CodeTemplate[] = [
    {
      id: 'basic',
      name: 'Basic HTML',
      description: 'Simple HTML structure',
      category: 'HTML',
      html: `<div class="container">
  <h1>Hello World!</h1>
  <p>Welcome to the code playground.</p>
  <button onclick="changeColor()">Change Color</button>
</div>`,
      css: `.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #3B82F6;
  margin-bottom: 20px;
}

button {
  background: #3B82F6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #2563EB;
}`,
      js: `function changeColor() {
  const h1 = document.querySelector('h1');
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  h1.style.color = randomColor;
}`
    },
    {
      id: 'animation',
      name: 'CSS Animation',
      description: 'Animated elements with CSS',
      category: 'CSS',
      html: `<div class="animation-container">
  <div class="box bounce">Bounce</div>
  <div class="box slide">Slide</div>
  <div class="box rotate">Rotate</div>
  <div class="box pulse">Pulse</div>
</div>`,
      css: `.animation-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.box {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.bounce {
  animation: bounce 2s infinite;
}

.slide {
  animation: slide 3s infinite;
}

.rotate {
  animation: rotate 2s linear infinite;
}

.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes slide {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}`,
      js: `// Add click interactions
document.querySelectorAll('.box').forEach(box => {
  box.addEventListener('click', function() {
    this.style.animationPlayState = 
      this.style.animationPlayState === 'paused' ? 'running' : 'paused';
  });
});`
    },
    {
      id: 'interactive',
      name: 'Interactive Dashboard',
      description: 'Dynamic dashboard with JavaScript',
      category: 'JavaScript',
      html: `<div class="dashboard">
  <header>
    <h1>Interactive Dashboard</h1>
    <div class="stats">
      <div class="stat">
        <span class="value" id="users">0</span>
        <span class="label">Users</span>
      </div>
      <div class="stat">
        <span class="value" id="sales">$0</span>
        <span class="label">Sales</span>
      </div>
      <div class="stat">
        <span class="value" id="orders">0</span>
        <span class="label">Orders</span>
      </div>
    </div>
  </header>
  
  <main>
    <div class="chart-container">
      <canvas id="chart" width="400" height="200"></canvas>
    </div>
    
    <div class="controls">
      <button onclick="updateData()">Update Data</button>
      <button onclick="resetData()">Reset</button>
    </div>
  </main>
</div>`,
      css: `.dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f8fafc;
  border-radius: 10px;
}

header h1 {
  text-align: center;
  color: #1e293b;
  margin-bottom: 30px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.value {
  display: block;
  font-size: 2em;
  font-weight: bold;
  color: #3b82f6;
}

.label {
  color: #64748b;
  font-size: 0.9em;
}

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.controls {
  text-align: center;
}

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #2563eb;
}`,
      js: `let data = {
  users: 1250,
  sales: 45000,
  orders: 89
};

function updateStats() {
  document.getElementById('users').textContent = data.users.toLocaleString();
  document.getElementById('sales').textContent = '$' + data.sales.toLocaleString();
  document.getElementById('orders').textContent = data.orders.toLocaleString();
}

function updateData() {
  data.users += Math.floor(Math.random() * 100);
  data.sales += Math.floor(Math.random() * 5000);
  data.orders += Math.floor(Math.random() * 20);
  
  updateStats();
  drawChart();
}

function resetData() {
  data = { users: 1250, sales: 45000, orders: 89 };
  updateStats();
  drawChart();
}

function drawChart() {
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Simple bar chart
  const values = [data.users/50, data.sales/1000, data.orders*2];
  const colors = ['#3b82f6', '#10b981', '#f59e0b'];
  const labels = ['Users', 'Sales', 'Orders'];
  
  values.forEach((value, index) => {
    const x = 50 + index * 120;
    const height = Math.min(value, 150);
    const y = 180 - height;
    
    ctx.fillStyle = colors[index];
    ctx.fillRect(x, y, 80, height);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(labels[index], x + 40, 195);
  });
}

// Initialize
updateStats();
drawChart();`
    },
    {
      id: 'responsive',
      name: 'Responsive Grid',
      description: 'Modern CSS Grid layout',
      category: 'CSS',
      html: `<div class="grid-container">
  <header class="header">
    <h1>Responsive Grid Layout</h1>
  </header>
  
  <nav class="sidebar">
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  
  <main class="main">
    <div class="card">
      <h3>Card 1</h3>
      <p>This is a responsive grid layout using CSS Grid.</p>
    </div>
    <div class="card">
      <h3>Card 2</h3>
      <p>Resize the window to see how it adapts.</p>
    </div>
    <div class="card">
      <h3>Card 3</h3>
      <p>Perfect for modern web layouts.</p>
    </div>
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 Responsive Grid Demo</p>
  </footer>
</div>`,
      css: `.grid-container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 20px;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  grid-area: header;
  background: #3b82f6;
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.sidebar {
  grid-area: sidebar;
  background: #f1f5f9;
  padding: 20px;
  border-radius: 8px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar a {
  text-decoration: none;
  color: #334155;
  padding: 8px 12px;
  display: block;
  border-radius: 4px;
  transition: background 0.3s;
}

.sidebar a:hover {
  background: #e2e8f0;
}

.main {
  grid-area: main;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
}

.footer {
  grid-area: footer;
  background: #1e293b;
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-areas:
      "header"
      "sidebar"
      "main"
      "footer";
    grid-template-columns: 1fr;
  }
  
  .main {
    grid-template-columns: 1fr;
  }
}`,
      js: `// Add some interactivity
document.querySelectorAll('.card').forEach((card, index) => {
  card.addEventListener('click', function() {
    this.style.transform = this.style.transform === 'scale(1.05)' ? 'scale(1)' : 'scale(1.05)';
    this.style.transition = 'transform 0.3s ease';
  });
});

// Highlight active navigation
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Remove active class from all links
    document.querySelectorAll('.sidebar a').forEach(l => l.classList.remove('active'));
    
    // Add active class to clicked link
    this.classList.add('active');
    this.style.background = '#3b82f6';
    this.style.color = 'white';
  });
});`
    }
  ];

  const categories = ['All', ...new Set(templates.map(t => t.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  useEffect(() => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      setCode({
        html: template.html,
        css: template.css,
        js: template.js
      });
    }
  }, [selectedTemplate]);

  const runCode = () => {
    setIsRunning(true);
    
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>${code.css}</style>
            </head>
            <body>
              ${code.html}
              <script>${code.js}</script>
            </body>
          </html>
        `;
        
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
    
    setTimeout(() => setIsRunning(false), 500);
  };

  const downloadCode = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Playground Export</title>
    <style>
${code.css}
    </style>
</head>
<body>
${code.html}
    <script>
${code.js}
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-export.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    const fullCode = `HTML:\n${code.html}\n\nCSS:\n${code.css}\n\nJavaScript:\n${code.js}`;
    navigator.clipboard.writeText(fullCode);
  };

  const resetCode = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      setCode({
        html: template.html,
        css: template.css,
        js: template.js
      });
    }
  };

  useEffect(() => {
    runCode();
  }, [code]);

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
                <Code className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Code Playground</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Play size={16} className="mr-2" />
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={resetCode}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset
              </button>
              <button
                onClick={copyCode}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Copy size={16} className="mr-2" />
                Copy
              </button>
              <button
                onClick={downloadCode}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Templates Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Templates</h3>
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-blue-600/20 border border-blue-500'
                        : 'hover:bg-gray-700/50 border border-transparent'
                    }`}
                  >
                    <div className="font-medium text-white">{template.name}</div>
                    <div className="text-sm text-gray-400">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : 'lg:col-span-3'}`}>
            <div className={`${isFullscreen ? 'h-full' : 'h-[800px]'} grid grid-rows-[auto_1fr] gap-4`}>
              {/* Code Editor */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-700/50">
                  {(['html', 'css', 'js'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Code Area */}
                <div className="p-4">
                  <textarea
                    value={code[activeTab]}
                    onChange={(e) => setCode(prev => ({ ...prev, [activeTab]: e.target.value }))}
                    className="w-full h-64 bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Eye size={20} className="mr-2" />
                    Preview
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
                
                <div className="h-full bg-white">
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="Code Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;