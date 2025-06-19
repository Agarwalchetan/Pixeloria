import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatWidget from './ChatWidget';

interface ContextualSuggestion {
  page: string;
  suggestions: string[];
  welcomeMessage: string;
}

const ContextAwareChatWidget: React.FC = () => {
  const location = useLocation();
  const [contextualData, setContextualData] = useState<ContextualSuggestion | null>(null);

  const contextualSuggestions: ContextualSuggestion[] = [
    {
      page: '/services',
      suggestions: ['Get a Quote', 'View Process', 'See Portfolio', 'Compare Packages'],
      welcomeMessage: "I see you're exploring our services! I can help you understand our offerings, get pricing estimates, or connect you with our team. What interests you most?"
    },
    {
      page: '/cost-estimator',
      suggestions: ['Explain Pricing', 'Book Consultation', 'View Examples', 'Get Help'],
      welcomeMessage: "Need help with the cost calculator? I can explain our pricing structure, help you choose the right features, or connect you with our team for a detailed quote."
    },
    {
      page: '/labs',
      suggestions: ['Try Tools', 'Learn More', 'Get Source Code', 'Collaborate'],
      welcomeMessage: "Welcome to Pixeloria Labs! I can help you navigate our experiments, explain how they work, or discuss how to implement similar features in your project."
    },
    {
      page: '/portfolio',
      suggestions: ['Similar Project', 'Get Quote', 'View Process', 'Tech Stack'],
      welcomeMessage: "Impressed by our work? I can help you understand how we built these projects, discuss similar solutions for your needs, or get you started with a quote."
    },
    {
      page: '/about',
      suggestions: ['Meet Team', 'Our Process', 'Get Started', 'View Work'],
      welcomeMessage: "Getting to know us? I'd love to help you learn more about our team, our approach to projects, or how we can help with your specific needs."
    },
    {
      page: '/contact',
      suggestions: ['Schedule Call', 'Get Quote', 'Ask Question', 'View Services'],
      welcomeMessage: "Ready to get in touch? I can help you choose the best way to connect with our team, prepare for your consultation, or answer any questions you have."
    }
  ];

  useEffect(() => {
    const currentContext = contextualSuggestions.find(context => 
      location.pathname.startsWith(context.page)
    );
    setContextualData(currentContext || null);
  }, [location.pathname]);

  return <ChatWidget mode="ai" position="bottom-right" />;
};

export default ContextAwareChatWidget;