import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Download, Share2, ArrowLeft, Copy, RotateCcw, 
  Code, Eye, Settings, Maximize2, Minimize2, Save,
  FileText, Folder, Plus, X, Users, Link2, Zap,
  Monitor, Smartphone, Tablet, BarChart3, Activity,
  Brain, Lightbulb, ExternalLink, Upload, GitBranch,
  MessageSquare, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript' | 'json';
  modified: boolean;
}

interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  files: CodeFile[];
  category: string;
  tags: string[];
  preview?: string;
}

interface VersionSnapshot {
  id: string;
  timestamp: Date;
  files: CodeFile[];
  message: string;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  cursor?: { x: number; y: number };
  selection?: { start: number; end: number };
}

const CodePlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'json'>('html');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('nextjs-landing');
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState<VersionSnapshot[]>([]);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showPerformance, setShowPerformance] = useState(false);
  const [folderStructure, setFolderStructure] = useState<any>({});
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const templates: CodeTemplate[] = [
    {
      id: 'nextjs-landing',
      name: 'Next.js Landing Page',
      description: 'Modern landing page with Next.js and Tailwind',
      category: 'React',
      tags: ['Next.js', 'Tailwind', 'Landing Page'],
      files: [
        {
          id: 'index.html',
          name: 'index.html',
          language: 'html',
          modified: false,
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Next.js Landing Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <nav class="container mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="text-xl font-bold">NextApp</div>
                    <div class="hidden md:flex space-x-6">
                        <a href="#" class="hover:text-blue-200">Home</a>
                        <a href="#" class="hover:text-blue-200">About</a>
                        <a href="#" class="hover:text-blue-200">Services</a>
                        <a href="#" class="hover:text-blue-200">Contact</a>
                    </div>
                    <button class="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50">
                        Get Started
                    </button>
                </div>
            </nav>
        </header>

        <main>
            <section class="hero bg-gradient-to-br from-blue-50 to-purple-50 py-20">
                <div class="container mx-auto px-6 text-center">
                    <h1 class="text-5xl font-bold text-gray-900 mb-6">
                        Build Amazing Apps with Next.js
                    </h1>
                    <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Create fast, scalable web applications with the power of React and Next.js
                    </p>
                    <div class="flex justify-center space-x-4">
                        <button class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
                            Start Building
                        </button>
                        <button class="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            <section class="features py-20">
                <div class="container mx-auto px-6">
                    <h2 class="text-3xl font-bold text-center mb-12">Why Choose Next.js?</h2>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="feature-card text-center p-6">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span class="text-2xl">⚡</span>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
                            <p class="text-gray-600">Optimized performance with automatic code splitting</p>
                        </div>
                        <div class="feature-card text-center p-6">
                            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span class="text-2xl">🔧</span>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Developer Friendly</h3>
                            <p class="text-gray-600">Great developer experience with hot reloading</p>
                        </div>
                        <div class="feature-card text-center p-6">
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span class="text-2xl">📈</span>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">SEO Optimized</h3>
                            <p class="text-gray-600">Built-in SEO optimization and server-side rendering</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="bg-gray-900 text-white py-12">
            <div class="container mx-auto px-6 text-center">
                <p>&copy; 2024 NextApp. Built with Next.js and Tailwind CSS.</p>
            </div>
        </footer>
    </div>

    <script src="script.js"></script>
</body>
</html>`
        },
        {
          id: 'styles.css',
          name: 'styles.css',
          language: 'css',
          modified: false,
          content: `/* Custom styles for Next.js Landing Page */

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom button animations */
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Responsive navigation */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1.1rem;
  }
}

/* Loading animation */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Code syntax highlighting */
.code-block {
  background: #1a1a1a;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  overflow-x: auto;
}

.code-block .keyword {
  color: #66d9ef;
}

.code-block .string {
  color: #a6e22e;
}

.code-block .comment {
  color: #75715e;
  font-style: italic;
}`
        },
        {
          id: 'script.js',
          name: 'script.js',
          language: 'javascript',
          modified: false,
          content: `// Next.js Landing Page JavaScript

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Add loading state to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                const originalText = this.textContent;
                this.innerHTML = '<span class="loading"></span> Loading...';
                this.classList.add('loading');
                
                // Simulate async operation
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.className = 'md:hidden text-white text-2xl';
    
    const nav = document.querySelector('nav .flex');
    const navLinks = nav.querySelector('.hidden.md\\:flex');
    
    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('hidden');
        navLinks.classList.toggle('flex');
        navLinks.classList.toggle('flex-col');
        navLinks.classList.toggle('absolute');
        navLinks.classList.toggle('top-full');
        navLinks.classList.toggle('left-0');
        navLinks.classList.toggle('w-full');
        navLinks.classList.toggle('bg-blue-600');
        navLinks.classList.toggle('p-4');
    });

    // Insert mobile menu button
    nav.appendChild(mobileMenuButton);

    // Form validation and submission
    function createContactForm() {
        const form = document.createElement('form');
        form.className = 'max-w-md mx-auto mt-8';
        form.innerHTML = \`
            <div class="mb-4">
                <input type="email" placeholder="Enter your email" 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       required>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Subscribe to Updates
            </button>
        \`;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate API call
            console.log('Subscribing email:', email);
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'text-green-600 text-center mt-4';
            successMsg.textContent = 'Thank you for subscribing!';
            
            this.appendChild(successMsg);
            this.querySelector('input').value = '';
            
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        });

        return form;
    }

    // Add contact form to hero section
    const heroSection = document.querySelector('.hero .container');
    const contactForm = createContactForm();
    heroSection.appendChild(contactForm);

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }

    // Dark mode toggle
    function addDarkModeToggle() {
        const toggle = document.createElement('button');
        toggle.innerHTML = '🌙';
        toggle.className = 'fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700';
        
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            toggle.innerHTML = document.body.classList.contains('dark') ? '☀️' : '🌙';
        });

        document.body.appendChild(toggle);
    }

    addDarkModeToggle();
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Local storage helpers
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage not available');
            }
        },
        get: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('LocalStorage not available');
                return null;
            }
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}`
        },
        {
          id: 'package.json',
          name: 'package.json',
          language: 'json',
          modified: false,
          content: `{
  "name": "nextjs-landing-page",
  "version": "1.0.0",
  "description": "Modern landing page built with Next.js and Tailwind CSS",
  "main": "index.html",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "postcss": "^8.4.0",
    "typescript": "^5.0.0"
  },
  "keywords": [
    "nextjs",
    "react",
    "tailwindcss",
    "landing-page",
    "modern",
    "responsive"
  ],
  "author": "Pixeloria Labs",
  "license": "MIT"
}`
        }
      ]
    },
    {
      id: 'html-email',
      name: 'HTML Email Template',
      description: 'Responsive email template with inline CSS',
      category: 'HTML',
      tags: ['Email', 'HTML', 'Responsive'],
      files: [
        {
          id: 'email.html',
          name: 'email.html',
          language: 'html',
          modified: false,
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        /* Email-safe CSS */
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .content { padding: 40px 20px; }
        .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <table class="container">
        <tr>
            <td class="header" style="padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to Our Platform!</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
                <h2>Thanks for joining us!</h2>
                <p>We're excited to have you on board. Here's what you can do next:</p>
                <ul>
                    <li>Complete your profile</li>
                    <li>Explore our features</li>
                    <li>Connect with other users</li>
                </ul>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="#" class="button">Get Started</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`
        }
      ]
    },
    {
      id: 'three-scene',
      name: 'Three.js Scene',
      description: 'Interactive 3D scene with Three.js',
      category: '3D',
      tags: ['Three.js', '3D', 'WebGL'],
      files: [
        {
          id: 'scene.html',
          name: 'scene.html',
          language: 'html',
          modified: false,
          content: `<!DOCTYPE html>
<html>
<head>
    <title>Three.js Scene</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // Create scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        
        // Create a rotating cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        camera.position.z = 5;
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>`
        }
      ]
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
      setFiles(template.files);
      setActiveFile(template.files[0]?.id || '');
    }
  }, [selectedTemplate]);

  const runCode = () => {
    setIsRunning(true);
    
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const htmlFile = files.find(f => f.language === 'html');
        const cssFile = files.find(f => f.language === 'css');
        const jsFile = files.find(f => f.language === 'javascript');
        
        let htmlContent = htmlFile?.content || '';
        
        // Inject CSS and JS
        if (cssFile) {
          htmlContent = htmlContent.replace('</head>', `<style>${cssFile.content}</style></head>`);
        }
        if (jsFile) {
          htmlContent = htmlContent.replace('</body>', `<script>${jsFile.content}</script></body>`);
        }
        
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
    
    setTimeout(() => setIsRunning(false), 500);
  };

  const saveSnapshot = (message: string) => {
    const snapshot: VersionSnapshot = {
      id: Date.now().toString(),
      timestamp: new Date(),
      files: JSON.parse(JSON.stringify(files)),
      message
    };
    setVersionHistory(prev => [snapshot, ...prev.slice(0, 9)]); // Keep last 10 versions
  };

  const loadSnapshot = (snapshot: VersionSnapshot) => {
    setFiles(snapshot.files);
    setActiveFile(snapshot.files[0]?.id || '');
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    // Simulate AI code generation
    const aiResponse = `// AI Generated Code for: ${aiPrompt}
function aiGeneratedFunction() {
    console.log('This code was generated by AI based on your prompt: ${aiPrompt}');
    
    // Example implementation
    const element = document.createElement('div');
    element.textContent = 'AI Generated Content';
    element.style.cssText = \`
        padding: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border-radius: 8px;
        margin: 20px;
        text-align: center;
        font-family: Arial, sans-serif;
    \`;
    
    
    document.body.appendChild(element);
}

// Auto-execute the AI generated function
aiGeneratedFunction();`;

    const activeFileObj = files.find(f => f.id === activeFile);
    if (activeFileObj) {
      const updatedFiles = files.map(f => 
        f.id === activeFile 
          ? { ...f, content: f.content + '\n\n' + aiResponse, modified: true }
          : f
      );
      setFiles(updatedFiles);
    }
    
    setAiPrompt('');
    setAiAssistantOpen(false);
  };

  const updateFileContent = (content: string) => {
    const updatedFiles = files.map(f => 
      f.id === activeFile 
        ? { ...f, content, modified: true }
        : f
    );
    setFiles(updatedFiles);
  };

  const createNewFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      const language = extension === 'html' ? 'html' :
                      extension === 'css' ? 'css' :
                      extension === 'js' ? 'javascript' : 'html';
      
      const newFile: CodeFile = {
        id: fileName,
        name: fileName,
        content: '',
        language,
        modified: false
      };
      
      setFiles(prev => [...prev, newFile]);
      setActiveFile(newFile.id);
    }
  };

  const deleteFile = (fileId: string) => {
    if (files.length > 1) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      if (activeFile === fileId) {
        setActiveFile(files.find(f => f.id !== fileId)?.id || '');
      }
    }
  };

  const exportProject = () => {
    const projectData = {
      name: selectedTemplate,
      files,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}-project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProject = () => {
    // Generate shareable link (would normally use a backend service)
    const shareData = {
      files,
      template: selectedTemplate
    };
    
    const shareUrl = `${window.location.origin}/playground/shared/${btoa(JSON.stringify(shareData))}`;
    navigator.clipboard.writeText(shareUrl);
    
    // Show notification
    alert('Share link copied to clipboard!');
  };

  useEffect(() => {
    runCode();
  }, [files]);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (files.some(f => f.modified)) {
        saveSnapshot('Auto-save');
        // Reset modified flags
        setFiles(prev => prev.map(f => ({ ...f, modified: false })));
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [files]);

  const activeFileObj = files.find(f => f.id === activeFile);

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
                <Code className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Code Playground Pro</h1>
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
                onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  aiAssistantOpen ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Brain size={16} className="mr-2" />
                AI Assistant
              </button>
              <button
                onClick={() => setShowPerformance(!showPerformance)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showPerformance ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Activity size={16} className="mr-2" />
                Performance
              </button>
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showVersionHistory ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <GitBranch size={16} className="mr-2" />
                History
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
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Library */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Templates</h3>
              <div className="space-y-2 mb-4">
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
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* File Explorer */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Files</h3>
                <button
                  onClick={createNewFile}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      activeFile === file.id
                        ? 'bg-blue-600/20 border border-blue-500'
                        : 'hover:bg-gray-700/50'
                    }`}
                    onClick={() => setActiveFile(file.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText size={14} className="text-gray-400" />
                      <span className="text-white text-sm">{file.name}</span>
                      {file.modified && (
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      )}
                    </div>
                    {files.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Play size={16} className="mr-2" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                
                <button
                  onClick={() => saveSnapshot('Manual save')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  Save Snapshot
                </button>
                
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                    showConsole ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Code size={16} className="mr-2" />
                  {showConsole ? 'Hide Console' : 'Show Console'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : 'lg:col-span-3'}`}>
            <div className={`${isFullscreen ? 'h-full' : 'h-[800px]'} grid ${showConsole ? 'grid-rows-[auto_1fr_200px]' : 'grid-rows-[auto_1fr]'} gap-4`}>
              {/* Editor Header */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-white">
                      {activeFileObj?.name || 'No file selected'}
                    </h3>
                    {activeFileObj?.modified && (
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                        Modified
                      </span>
                    )}
                  </div>
                  
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
              </div>

              {/* Editor and Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Code Editor */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="p-4 border-b border-gray-700/50">
                    <h4 className="font-semibold text-white">Editor</h4>
                  </div>
                  <div className="h-full">
                    <textarea
                      ref={editorRef}
                      value={activeFileObj?.content || ''}
                      onChange={(e) => updateFileContent(e.target.value)}
                      className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-4 border-none outline-none resize-none"
                      placeholder="Start coding..."
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                    <h4 className="font-semibold text-white">Preview</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`h-full bg-white transition-all duration-300 ${
                    activeDevice === 'mobile' ? 'max-w-sm mx-auto' :
                    activeDevice === 'tablet' ? 'max-w-md mx-auto' : 'max-w-full'
                  }`}>
                    <iframe
                      ref={iframeRef}
                      className="w-full h-full border-none"
                      title="Code Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              </div>

              {/* Console */}
              {showConsole && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                    <h4 className="font-semibold text-white">Console</h4>
                    <button
                      onClick={() => setConsoleOutput([])}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="p-4 h-full overflow-y-auto bg-gray-900 font-mono text-sm">
                    {consoleOutput.length === 0 ? (
                      <div className="text-gray-500">Console output will appear here...</div>
                    ) : (
                      consoleOutput.map((output, index) => (
                        <div key={index} className="text-gray-300 mb-1">
                          {output}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <AnimatePresence>
          {aiAssistantOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white flex items-center">
                  <Brain size={20} className="mr-2 text-purple-400" />
                  AI Code Assistant
                </h4>
                <button
                  onClick={() => setAiAssistantOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe what you want to build..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                />
                
                <div className="flex space-x-2">
                  <button
                    onClick={generateWithAI}
                    disabled={!aiPrompt.trim()}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <Zap size={16} className="mr-2" />
                    Generate
                  </button>
                  <button
                    onClick={() => setAiPrompt('')}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="text-xs text-gray-400">
                  AI will generate code based on your description and add it to the current file.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version History Panel */}
        <AnimatePresence>
          {showVersionHistory && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-gray-800 border-l border-gray-700 shadow-xl z-40"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-white flex items-center">
                    <GitBranch size={20} className="mr-2 text-blue-400" />
                    Version History
                  </h4>
                  <button
                    onClick={() => setShowVersionHistory(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {versionHistory.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      No saved versions yet
                    </div>
                  ) : (
                    versionHistory.map((version) => (
                      <div
                        key={version.id}
                        className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={() => loadSnapshot(version)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{version.message}</span>
                          <Clock size={14} className="text-gray-400" />
                        </div>
                        <div className="text-xs text-gray-400">
                          {version.timestamp.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {version.files.length} files
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Performance Monitor */}
        <AnimatePresence>
          {showPerformance && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl z-40"
            >
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Activity size={16} className="text-green-400" />
                  <span className="text-white text-sm">Performance</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">60</div>
                    <div className="text-xs text-gray-400">FPS</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">2.1</div>
                    <div className="text-xs text-gray-400">MB</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">0.8s</div>
                    <div className="text-xs text-gray-400">Load</div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowPerformance(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
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
              className="fixed bottom-4 left-4 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl max-w-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">Live Collaboration</h4>
                <button
                  onClick={() => setCollaborationMode(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">2 users coding</span>
                </div>
                
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                    JD
                  </div>
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                    AS
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Link2 size={16} className="mr-2" />
                  Invite Others
                </button>
                
                <div className="text-xs text-gray-400">
                  Real-time collaborative coding
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CodePlayground;