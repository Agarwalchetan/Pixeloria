import React, { createContext, useContext, useState, useEffect } from 'react';

interface ChatAnalytics {
  sessionId: string;
  startTime: Date;
  messagesCount: number;
  userEngagement: 'low' | 'medium' | 'high';
  leadCaptured: boolean;
  pageContext: string;
}

interface ChatAnalyticsContextType {
  analytics: ChatAnalytics;
  updateAnalytics: (updates: Partial<ChatAnalytics>) => void;
  trackEvent: (event: string, data?: any) => void;
}

const ChatAnalyticsContext = createContext<ChatAnalyticsContextType | undefined>(undefined);

export const ChatAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<ChatAnalytics>({
    sessionId: Date.now().toString(),
    startTime: new Date(),
    messagesCount: 0,
    userEngagement: 'low',
    leadCaptured: false,
    pageContext: window.location.pathname
  });

  const updateAnalytics = (updates: Partial<ChatAnalytics>) => {
    setAnalytics(prev => ({ ...prev, ...updates }));
  };

  const trackEvent = (event: string, data?: any) => {
    // In a real implementation, this would send data to your analytics service
    console.log('Chat Event:', event, data, analytics);
    
    // Update engagement based on activity
    if (event === 'message_sent') {
      updateAnalytics({ 
        messagesCount: analytics.messagesCount + 1,
        userEngagement: analytics.messagesCount > 5 ? 'high' : analytics.messagesCount > 2 ? 'medium' : 'low'
      });
    }
    
    if (event === 'lead_captured') {
      updateAnalytics({ leadCaptured: true });
    }
  };

  return (
    <ChatAnalyticsContext.Provider value={{ analytics, updateAnalytics, trackEvent }}>
      {children}
    </ChatAnalyticsContext.Provider>
  );
};

export const useChatAnalytics = () => {
  const context = useContext(ChatAnalyticsContext);
  if (!context) {
    throw new Error('useChatAnalytics must be used within ChatAnalyticsProvider');
  }
  return context;
};