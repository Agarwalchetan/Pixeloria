import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, DollarSign, Code, Users, ArrowLeft } from 'lucide-react';

interface FAQFlow {
  id: string;
  question: string;
  answer: string;
  visual?: React.ComponentType;
  followUp?: string[];
  category: string;
}

const SmartFAQFlow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentFAQ, setCurrentFAQ] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const faqFlows: FAQFlow[] = [
    {
      id: 'process',
      question: 'What is your development process?',
      answer: 'We follow a proven 5-step methodology that ensures quality results and transparent communication throughout your project.',
      category: 'Process',
      followUp: ['How long does each step take?', 'Can I see examples?', 'What if I need changes?']
    },
    {
      id: 'pricing',
      question: 'How much does a website cost?',
      answer: 'Our websites typically range from $2,500 to $15,000+ depending on complexity, features, and design requirements.',
      category: 'Pricing',
      followUp: ['What affects the price?', 'Do you offer payment plans?', 'Can I get a quote?']
    },
    {
      id: 'timeline',
      question: 'How long does a project take?',
      answer: 'Most websites take 4-8 weeks from start to launch, while complex applications can take 3-6 months.',
      category: 'Timeline',
      followUp: ['What affects timeline?', 'Can you work faster?', 'What about revisions?']
    },
    {
      id: 'technology',
      question: 'What technologies do you use?',
      answer: 'We use modern, proven technologies like React, Next.js, Node.js, and cloud platforms to ensure your site is fast, secure, and scalable.',
      category: 'Technology',
      followUp: ['Why these technologies?', 'Can you use others?', 'What about maintenance?']
    }
  ];

  const ProcessVisual = () => (
    <div className="grid grid-cols-5 gap-2 my-4">
      {['Discover', 'Design', 'Develop', 'Test', 'Launch'].map((step, index) => (
        <div key={step} className="text-center">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1">
            {index + 1}
          </div>
          <div className="text-xs text-gray-600">{step}</div>
        </div>
      ))}
    </div>
  );

  const handleFAQSelect = (faqId: string) => {
    setHistory(prev => [...prev, faqId]);
    setCurrentFAQ(faqId);
  };

  const handleBack = () => {
    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
    setCurrentFAQ(newHistory[newHistory.length - 1] || null);
  };

  const currentFAQData = faqFlows.find(faq => faq.id === currentFAQ);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {currentFAQ ? 'FAQ Details' : 'Frequently Asked Questions'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!currentFAQ ? (
            <motion.div
              key="faq-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {faqFlows.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleFAQSelect(faq.id)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">
                        {faq.question}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{faq.category}</div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="faq-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={handleBack}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to questions
              </button>

              <h4 className="font-bold text-gray-900 mb-3">
                {currentFAQData?.question}
              </h4>

              <p className="text-gray-700 mb-4">
                {currentFAQData?.answer}
              </p>

              {currentFAQData?.id === 'process' && <ProcessVisual />}

              {currentFAQData?.followUp && (
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900">Related questions:</h5>
                  {currentFAQData.followUp.map((question, index) => (
                    <button
                      key={index}
                      className="block w-full text-left text-sm text-blue-600 hover:text-blue-700 py-1"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Personalized Help
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SmartFAQFlow;