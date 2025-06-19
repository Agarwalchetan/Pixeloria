import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, Minimize2, Maximize2,
  Sparkles, ArrowRight, Calculator, Palette, Code, Mail,
  Phone, Clock, Star, Zap, HelpCircle, ThumbsUp, ThumbsDown,
  Copy, Download, ExternalLink, Lightbulb, Target, Coffee
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  quickReplies?: string[];
  isTyping?: boolean;
  confidence?: number;
  intent?: string;
  suggestions?: Array<{
    text: string;
    action: string;
    icon?: React.ComponentType<any>;
  }>;
}

interface ChatWidgetProps {
  mode?: 'live' | 'ai';
  position?: 'bottom-right' | 'bottom-left';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  mode = 'ai', 
  position = 'bottom-right' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', projectType: '' });
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'chat' | 'lead'>('welcome');
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [userIntent, setUserIntent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced AI Knowledge Base
  const knowledgeBase = {
    services: {
      keywords: ['service', 'what do you do', 'offerings', 'capabilities', 'help with'],
      response: "We're a full-service web development agency specializing in modern, scalable solutions. Our core services include:",
      details: [
        "🎨 **Custom Web Design** - Beautiful, conversion-focused designs",
        "🛒 **E-commerce Development** - Shopify, WooCommerce, custom stores", 
        "⚡ **Web Applications** - React, Next.js, full-stack solutions",
        "📱 **Mobile-First Development** - Responsive, fast-loading sites",
        "🔧 **CMS Integration** - Easy content management systems",
        "🚀 **Performance Optimization** - Speed & SEO improvements"
      ],
      suggestions: [
        { text: "View Our Portfolio", action: "portfolio", icon: ExternalLink },
        { text: "Get Custom Quote", action: "quote", icon: Calculator },
        { text: "See Our Process", action: "process", icon: Target }
      ]
    },
    pricing: {
      keywords: ['price', 'cost', 'how much', 'budget', 'expensive', 'cheap', 'affordable'],
      response: "Our pricing is transparent and based on project complexity. Here's our typical range:",
      details: [
        "💼 **Business Websites**: $2,500 - $8,000",
        "🛍️ **E-commerce Stores**: $5,000 - $15,000+", 
        "⚙️ **Web Applications**: $10,000 - $50,000+",
        "🔧 **Maintenance Plans**: $200 - $800/month",
        "",
        "💡 **What affects pricing:**",
        "• Number of pages and features",
        "• Custom design complexity", 
        "• Third-party integrations",
        "• Timeline requirements"
      ],
      suggestions: [
        { text: "Try Cost Calculator", action: "calculator", icon: Calculator },
        { text: "View Packages", action: "packages", icon: Star },
        { text: "Book Free Consultation", action: "consultation", icon: Phone }
      ]
    },
    process: {
      keywords: ['process', 'how do you work', 'methodology', 'timeline', 'steps'],
      response: "We follow a proven 5-phase methodology that ensures quality results and keeps you informed every step of the way:",
      details: [
        "🔍 **1. Discovery & Strategy** (1-2 weeks)",
        "   • Requirements gathering & competitor analysis",
        "   • User research & technical planning",
        "",
        "🎨 **2. Design & Prototyping** (2-3 weeks)", 
        "   • Wireframes, mockups & interactive prototypes",
        "   • Brand integration & user experience design",
        "",
        "⚡ **3. Development** (3-6 weeks)",
        "   • Frontend & backend development",
        "   • CMS setup & third-party integrations",
        "",
        "🧪 **4. Testing & Optimization** (1 week)",
        "   • Cross-browser testing & performance optimization",
        "   • Security audits & accessibility compliance",
        "",
        "🚀 **5. Launch & Support** (Ongoing)",
        "   • Deployment, training & documentation",
        "   • Ongoing maintenance & support options"
      ],
      suggestions: [
        { text: "See Timeline Details", action: "timeline", icon: Clock },
        { text: "View Past Projects", action: "portfolio", icon: ExternalLink },
        { text: "Start Discovery Call", action: "consultation", icon: Phone }
      ]
    },
    labs: {
      keywords: ['lab', 'experiment', 'tool', 'playground', 'demo', 'try'],
      response: "Pixeloria Labs is our innovation playground where we experiment with cutting-edge web technologies! Here's what you can explore:",
      details: [
        "🎨 **AI Color Generator** - Machine learning-powered color palettes",
        "⚡ **Animation Tester** - Interactive micro-interaction library",
        "💻 **Code Playground** - Live HTML/CSS/JS editor with templates",
        "📊 **A/B Testing Lab** - Compare UI variations and measure performance",
        "",
        "🔬 **Why we built Labs:**",
        "• Test new technologies before client projects",
        "• Share knowledge with the developer community", 
        "• Demonstrate our technical capabilities",
        "• Provide free tools for designers & developers"
      ],
      suggestions: [
        { text: "Explore Labs", action: "labs", icon: Palette },
        { text: "Try Color Generator", action: "color-tool", icon: Palette },
        { text: "Use in My Project", action: "implement", icon: Code }
      ]
    },
    technology: {
      keywords: ['tech', 'technology', 'stack', 'framework', 'language', 'platform'],
      response: "We use modern, battle-tested technologies that ensure your project is fast, secure, and scalable:",
      details: [
        "⚛️ **Frontend**: React, Next.js, TypeScript, Tailwind CSS",
        "🔧 **Backend**: Node.js, Express, Python, PostgreSQL, MongoDB",
        "☁️ **Cloud & DevOps**: AWS, Vercel, Netlify, Docker",
        "🛒 **E-commerce**: Shopify, WooCommerce, Stripe, PayPal",
        "📱 **Mobile**: React Native, Progressive Web Apps",
        "🎨 **Design**: Figma, Adobe Creative Suite",
        "",
        "🎯 **Why these choices:**",
        "• Proven reliability in production environments",
        "• Strong community support & documentation",
        "• Excellent performance & security features",
        "• Future-proof and actively maintained"
      ],
      suggestions: [
        { text: "See Tech in Action", action: "portfolio", icon: ExternalLink },
        { text: "Discuss Your Stack", action: "consultation", icon: Phone },
        { text: "View Case Studies", action: "cases", icon: Star }
      ]
    }
  };

  // Enhanced intent detection
  const detectIntent = (input: string): { intent: string; confidence: number; category?: any } => {
    const lowercaseInput = input.toLowerCase();
    let bestMatch = { intent: 'general', confidence: 0, category: null };

    for (const [categoryName, category] of Object.entries(knowledgeBase)) {
      for (const keyword of category.keywords) {
        if (lowercaseInput.includes(keyword)) {
          const confidence = keyword.length / input.length * 100;
          if (confidence > bestMatch.confidence) {
            bestMatch = { intent: categoryName, confidence, category };
          }
        }
      }
    }

    // Context-aware intent boosting
    if (conversationContext.length > 0) {
      const lastContext = conversationContext[conversationContext.length - 1];
      if (lastContext === bestMatch.intent) {
        bestMatch.confidence += 20; // Boost confidence for follow-up questions
      }
    }

    return bestMatch;
  };

  // Enhanced response generation
  const generateAIResponse = (input: string) => {
    const { intent, confidence, category } = detectIntent(input);
    
    if (confidence > 30 && category) {
      setConversationContext(prev => [...prev.slice(-2), intent]); // Keep last 3 contexts
      
      return {
        text: category.response,
        details: category.details,
        suggestions: category.suggestions,
        confidence,
        intent
      };
    }

    // Fallback responses with helpful suggestions
    const fallbackResponses = [
      {
        text: "I'd be happy to help! I'm Pixel, your AI assistant, and I can provide detailed information about:",
        suggestions: [
          { text: "Our Services & Capabilities", action: "services", icon: Zap },
          { text: "Pricing & Packages", action: "pricing", icon: Calculator },
          { text: "Development Process", action: "process", icon: Target },
          { text: "Technology Stack", action: "technology", icon: Code }
        ]
      }
    ];

    return fallbackResponses[0];
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsTyping(true);
    }, 800);

    // Generate response
    setTimeout(() => {
      const response = generateAIResponse(text.toLowerCase());
      
      let responseText = response.text;
      if (response.details) {
        responseText += '\n\n' + response.details.join('\n');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
        timestamp: new Date(),
        confidence: response.confidence,
        intent: response.intent,
        suggestions: response.suggestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      setUserIntent(response.intent || '');
    }, 1500 + Math.random() * 1000);
  };

  const handleSuggestionClick = (action: string) => {
    const actionMap: Record<string, string> = {
      'portfolio': '/portfolio',
      'quote': '/cost-estimator', 
      'calculator': '/cost-estimator',
      'consultation': '/contact',
      'labs': '/labs',
      'services': '/services',
      'process': '/about',
      'contact': '/contact'
    };

    if (actionMap[action]) {
      window.location.href = actionMap[action];
    } else {
      handleSendMessage(`Tell me more about ${action}`);
    }
  };

  useEffect(() => {
    if (isOpen && currentStep === 'welcome') {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "👋 Hi there! I'm **Pixel**, your AI assistant at Pixeloria.\n\nI'm here to help you explore our services, understand our process, get pricing estimates, or answer any questions about web development.\n\n✨ **I can help you with:**\n• Service information & capabilities\n• Project pricing & timelines\n• Our development process\n• Technology recommendations\n• Pixeloria Labs experiments\n\nWhat would you like to know?",
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: [
          { text: "Explore Services", action: "services", icon: Zap },
          { text: "Get Pricing", action: "pricing", icon: Calculator },
          { text: "See Our Work", action: "portfolio", icon: ExternalLink },
          { text: "Try Labs", action: "labs", icon: Palette }
        ]
      };
      setMessages([welcomeMessage]);
      setCurrentStep('chat');
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-6 right-6' 
    : 'bottom-6 left-6';

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`fixed ${positionClasses} z-50`}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="relative w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-full shadow-2xl flex items-center justify-center text-white group overflow-hidden"
            >
              {/* Animated background */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 rounded-full"
              />
              
              <div className="relative z-10">
                <MessageCircle size={24} />
                {/* Pulse indicator */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </motion.div>
              </div>
              
              {/* Floating particles */}
              <motion.div
                animate={{ y: [-20, -40, -20], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                className="absolute top-0 left-2 w-1 h-1 bg-blue-300 rounded-full"
              />
              <motion.div
                animate={{ y: [-20, -40, -20], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute top-0 right-2 w-1 h-1 bg-purple-300 rounded-full"
              />
            </motion.button>
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
            >
              💬 Ask me anything!
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 600
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed ${positionClasses} z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm`}
          >
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-4 text-white relative overflow-hidden">
              <motion.div
                animate={{ x: [-100, 100] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <Bot size={20} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg">Pixel Assistant</h3>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                      <p className="text-xs text-blue-100">
                        AI-powered • Always learning
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Enhanced Messages Area */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs relative ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      } p-4 rounded-2xl`}>
                        {message.sender === 'assistant' && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Bot size={14} className="text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Pixel</span>
                            {message.confidence && (
                              <span className="text-xs text-gray-500">
                                {Math.round(message.confidence)}% confident
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="text-sm whitespace-pre-line leading-relaxed">
                          {message.text.split('**').map((part, i) => 
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </div>
                        
                        {message.suggestions && (
                          <div className="mt-4 space-y-2">
                            <div className="text-xs text-gray-500 mb-2">💡 Quick actions:</div>
                            {message.suggestions.map((suggestion, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSuggestionClick(suggestion.action)}
                                className="flex items-center space-x-2 w-full text-left text-xs px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                              >
                                {suggestion.icon && <suggestion.icon size={14} className="text-blue-600" />}
                                <span className="text-blue-700 font-medium">{suggestion.text}</span>
                                <ArrowRight size={12} className="text-blue-500 ml-auto" />
                              </motion.button>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-400 mt-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Enhanced Typing Indicator */}
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Bot size={14} className="text-blue-600" />
                          <span className="text-xs font-medium text-blue-600">Pixel</span>
                          <span className="text-xs text-gray-500">is analyzing...</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-2">
                          <Lightbulb size={14} className="text-yellow-500" />
                          <span className="text-xs text-gray-600">Understanding your question</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot size={14} className="text-blue-600" />
                          <span className="text-xs font-medium text-blue-600">Pixel</span>
                          <span className="text-xs text-gray-500">is typing...</span>
                        </div>
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                delay: i * 0.2 
                              }}
                              className="w-2 h-2 bg-blue-400 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        placeholder="Ask me anything about Pixeloria..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                      />
                      {inputValue && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Sparkles size={16} className="text-blue-400" />
                        </motion.div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      <Send size={16} />
                    </motion.button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setShowLeadCapture(true)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                      >
                        <Coffee size={12} />
                        <span>Get personal help</span>
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                        <Phone size={12} />
                        <span>Book a call</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Sparkles size={12} className="text-blue-400" />
                      <span>Powered by AI</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;