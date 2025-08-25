// API Configuration
const getApiUrl = (): string => {
  // In production, use the Railway backend URL (you'll set this in Vercel env vars)
  // In development, use localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = {
  // Chat endpoints
  CHAT_INITIALIZE: `${API_BASE_URL}/api/chat/initialize`,
  CHAT_SEND: `${API_BASE_URL}/api/chat/send`,
  CHAT_HISTORY: `${API_BASE_URL}/api/chat/history`,
  
  // Admin endpoints
  ADMIN_AI_CONFIG: `${API_BASE_URL}/api/admin/dashboard/ai-config`,
  ADMIN_AI_CONFIG_TEST: `${API_BASE_URL}/api/admin/dashboard/ai-config/test`,
  ADMIN_AI_CONFIG_ENABLED: `${API_BASE_URL}/api/admin/dashboard/ai-config/enabled`,
  
  // Contact endpoints
  CONTACT_SUBMIT: `${API_BASE_URL}/api/contact`,
  
  // Other endpoints can be added here
};

export default API_BASE_URL;
