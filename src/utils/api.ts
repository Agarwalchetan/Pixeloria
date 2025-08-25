// Function to detect backend port dynamically (only for development)
async function detectBackendPort(): Promise<number> {
  // Try to read port from backend-generated file
  try {
    const response = await fetch('/port.json');
    if (response.ok) {
      const data = await response.json();
      return data.port;
    }
  } catch (error) {
    // File doesn't exist or can't be read, fallback to port detection
  }

  // Try common ports in order
  const portsToTry = [5000, 5001, 5002, 5003];
  
  for (const port of portsToTry) {
    try {
      const response = await fetch(`http://localhost:${port}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      if (response.ok) {
        return port;
      }
    } catch (error) {
      // Port not available, try next
      continue;
    }
  }
  
  // Default fallback
  return 5000;
}

// Cache the detected port
let cachedPort: number | null = null;

// Get API base URL with proper environment variable support
export async function getApiBaseUrl(): Promise<string> {
  // Check for environment variable first (production)
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl) {
    return `${envApiUrl}/api`;
  }
  
  // Fallback to dynamic port detection (development only)
  if (cachedPort === null) {
    cachedPort = await detectBackendPort();
  }
  return `http://localhost:${cachedPort}/api`;
}

// Legacy export for backward compatibility - use environment variable if available
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const authHeaders = getAuthHeaders();
    const baseUrl = await getApiBaseUrl(); // Use dynamic URL detection
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers,
      },
      ...options,
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      data = { success: false, message: text || 'Invalid response format' };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    // Return a proper error response instead of throwing
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function fetchApiWithFormData<T>(
  endpoint: string,
  formData: FormData,
  options?: Omit<RequestInit, 'body'>
): Promise<ApiResponse<T>> {
  try {
    const authHeaders = getAuthHeaders();
    const baseUrl = await getApiBaseUrl(); // Use dynamic URL detection
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: {
        ...authHeaders,
        ...options?.headers,
      },
      ...options,
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: false, message: text || 'Invalid response format' };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Admin API functions
export const adminApi = {
  getDashboardOverview: () => fetchApi<{
    statistics: any;
    charts: any;
    recent: any;
  }>('/admin/dashboard/overview'),
  
  getAnalytics: () => fetchApi<any>('/admin/dashboard/analytics'),
  
  getContacts: (params?: { status?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    return fetchApi<{ contacts: any[]; total: number }>(`/admin/dashboard/contact-inquiries${queryString ? `?${queryString}` : ''}`);
  },
  
  updateContactStatus: (id: string, status: string) => 
    fetchApi<{ contact: any }>(`/admin/dashboard/contact-inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  getUsers: () => fetchApi<{ users: any[]; total: number }>('/admin/dashboard/users'),
  
  updateUser: (id: string, updates: any) => 
    fetchApi<{ user: any }>(`/admin/dashboard/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  deleteUser: (id: string) => 
    fetchApi<{}>(`/admin/dashboard/users/${id}`, {
      method: 'DELETE',
    }),
  
  getTestimonials: () => fetchApi<{ testimonials: any[]; total: number }>('/admin/dashboard/testimonials'),
  
  createTestimonial: (testimonialData: any) => 
    fetchApi<{ testimonial: any }>('/admin/dashboard/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    }),
  
  updateTestimonial: (id: string, updates: any) => 
    fetchApi<{ testimonial: any }>(`/admin/dashboard/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  deleteTestimonial: (id: string) => 
    fetchApi<{}>(`/admin/dashboard/testimonials/${id}`, {
      method: 'DELETE',
    }),
  
  getNewsletterSubscribers: () => fetchApi<{ subscribers: any[]; total: number }>('/admin/dashboard/newsletter'),
  
  sendNewsletter: (emailData: { subject: string; content: string }) => 
    fetchApi<{ totalSubscribers: number; successfulSends: number }>('/admin/dashboard/newsletter/send', {
      method: 'POST',
      body: JSON.stringify(emailData),
    }),
  
  deleteNewsletterSubscriber: (id: string) => 
    fetchApi<{}>(`/admin/dashboard/newsletter/${id}`, {
      method: 'DELETE',
    }),
  
  bulkDelete: (type: string, ids: string[]) => 
    fetchApi<{ deletedCount: number }>('/admin/dashboard/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ type, ids }),
    }),
  
  updateSettings: (type: string, settings: any) => 
    fetchApi<{ settings: any }>('/admin/dashboard/settings', {
      method: 'PUT',
      body: JSON.stringify({ type, settings }),
    }),

  // Home Page Content Management (public endpoint)
  getHomeSettings: async () => {
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}/admin/dashboard/home-settings`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: false, message: text || 'Invalid response format' };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  },
  
  updateHomeSettings: (settings: any) => {
    console.log('=== API updateHomeSettings called ===');
    console.log('Settings to update:', settings);
    return fetchApi<{ homeSettings: any }>('/admin/dashboard/home-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // About Page Content Management
  getAboutSettings: () => fetchApi<{ aboutSettings: any }>('/admin/dashboard/about-settings'),
  
  updateAboutSettings: (settings: any) => 
    fetchApi<{ aboutSettings: any }>('/admin/dashboard/about-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  createTeamMember: (memberData: any, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.keys(memberData).forEach(key => {
        if (key === 'skills' && Array.isArray(memberData[key])) {
          formData.append(key, memberData[key].join(','));
        } else if (key === 'social' && typeof memberData[key] === 'object') {
          formData.append(key, JSON.stringify(memberData[key]));
        } else {
          formData.append(key, memberData[key]);
        }
      });
      formData.append('image', image);
      return fetchApiWithFormData<{ aboutSettings: any }>('/admin/dashboard/about-settings/team', formData);
    } else {
      return fetchApi<{ aboutSettings: any }>('/admin/dashboard/about-settings/team', {
        method: 'POST',
        body: JSON.stringify(memberData),
      });
    }
  },

  updateTeamMember: (id: string, memberData: any, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.keys(memberData).forEach(key => {
        if (key === 'skills' && Array.isArray(memberData[key])) {
          formData.append(key, memberData[key].join(','));
        } else if (key === 'social' && typeof memberData[key] === 'object') {
          formData.append(key, JSON.stringify(memberData[key]));
        } else {
          formData.append(key, memberData[key]);
        }
      });
      formData.append('image', image);
      return fetchApiWithFormData<{ aboutSettings: any }>(`/admin/dashboard/about-settings/team/${id}`, formData, {
        method: 'PUT',
      });
    } else {
      return fetchApi<{ aboutSettings: any }>(`/admin/dashboard/about-settings/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(memberData),
      });
    }
  },

  deleteTeamMember: (id: string) => 
    fetchApi<{ aboutSettings: any }>(`/admin/dashboard/about-settings/team/${id}`, {
      method: 'DELETE',
    }),

  createJourneyMilestone: (milestoneData: any) => 
    fetchApi<{ aboutSettings: any }>('/admin/dashboard/about-settings/journey', {
      method: 'POST',
      body: JSON.stringify(milestoneData),
    }),

  updateJourneyMilestone: (id: string, milestoneData: any) => 
    fetchApi<{ aboutSettings: any }>(`/admin/dashboard/about-settings/journey/${id}`, {
      method: 'PUT',
      body: JSON.stringify(milestoneData),
    }),

  deleteJourneyMilestone: (id: string) => 
    fetchApi<{ aboutSettings: any }>(`/admin/dashboard/about-settings/journey/${id}`, {
      method: 'DELETE',
    }),

  // Calculator API functions
  getCalculatorSubmissions: () => fetchApi<{ submissions: any[]; total: number }>('/admin/dashboard/calculator/submissions'),
  
  exportCalculatorPDF: (id: string) => fetchApi<{ pdfUrl: string }>(`/admin/dashboard/calculator/submissions/${id}/pdf`),
  
  updateCalculatorSubmissionStatus: (id: string, status: string) => 
    fetchApi<{ submission: any }>(`/admin/dashboard/calculator/submissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Calculator Configuration
  getCalculatorConfig: () => fetchApi<{
    projectTypes: any[];
    features: any[];
    designOptions: any[];
    timelineOptions: any[];
  }>('/admin/dashboard/calculator/config'),

  createProjectType: (data: any) => 
    fetchApi<{ projectType: any }>('/admin/dashboard/calculator/project-types', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProjectType: (id: string, data: any) => 
    fetchApi<{ projectType: any }>(`/admin/dashboard/calculator/project-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProjectType: (id: string) => 
    fetchApi<{}>(`/admin/dashboard/calculator/project-types/${id}`, {
      method: 'DELETE',
    }),

  createFeature: (data: any) => 
    fetchApi<{ feature: any }>('/admin/dashboard/calculator/features', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateFeature: (id: string, data: any) => 
    fetchApi<{ feature: any }>(`/admin/dashboard/calculator/features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteFeature: (id: string) => 
    fetchApi<{}>(`/admin/dashboard/calculator/features/${id}`, {
      method: 'DELETE',
    }),

  createDesignOption: (data: any) => 
    fetchApi<{ designOption: any }>('/admin/dashboard/calculator/design-options', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateDesignOption: (id: string, data: any) => 
    fetchApi<{ designOption: any }>(`/admin/dashboard/calculator/design-options/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteDesignOption: (id: string) => 
    fetchApi<{}>(`/admin/dashboard/calculator/design-options/${id}`, {
      method: 'DELETE',
    }),

  createTimelineOption: (data: any) => 
    fetchApi<{ timelineOption: any }>('/admin/dashboard/calculator/timeline-options', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTimelineOption: (id: string, data: any) => 
    fetchApi<{ timelineOption: any }>(`/admin/dashboard/calculator/timeline-options/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteTimelineOption: (id: string) => 
    fetchApi<{}>(`/admin/dashboard/calculator/timeline-options/${id}`, {
      method: 'DELETE',
    }),
};
// API endpoint functions
export const blogApi = {
  getAll: (params?: { category?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    return fetchApi<{ posts: any[]; total: number }>(`/blogs${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => fetchApi<{ post: any }>(`/blogs/${id}`),
  
  create: (blogData: any, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.keys(blogData).forEach(key => {
        formData.append(key, blogData[key]);
      });
      formData.append('image', image);
      return fetchApiWithFormData<{ post: any }>('/admin/dashboard/blog', formData);
    } else {
      return fetchApi<{ post: any }>('/admin/dashboard/blog', {
        method: 'POST',
        body: JSON.stringify(blogData),
      });
    }
  },
  
  update: (id: string, blogData: any, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.keys(blogData).forEach(key => {
        formData.append(key, blogData[key]);
      });
      formData.append('image', image);
      return fetchApiWithFormData<{ post: any }>(`/admin/dashboard/blog/${id}`, formData, {
        method: 'PUT',
      });
    } else {
      return fetchApi<{ post: any }>(`/admin/dashboard/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(blogData),
      });
    }
  },
  
  delete: (id: string) => fetchApi<{}>(`/admin/dashboard/blog/${id}`, {
    method: 'DELETE',
  }),
};

export const portfolioApi = {
  getAll: (params?: { category?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    return fetchApi<{ projects: any[]; total: number }>(`/portfolio${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => fetchApi<{ project: any }>(`/portfolio/${id}`),
  
  create: (projectData: any, images?: File[]) => {
    const formData = new FormData();
    Object.keys(projectData).forEach(key => {
      formData.append(key, projectData[key]);
    });
    if (images) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    return fetchApiWithFormData<{ project: any }>('/admin/dashboard/portfolio', formData);
  },
  
  update: (id: string, projectData: any, images?: File[]) => {
    const formData = new FormData();
    Object.keys(projectData).forEach(key => {
      formData.append(key, projectData[key]);
    });
    if (images) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    return fetchApiWithFormData<{ project: any }>(`/admin/dashboard/portfolio/${id}`, formData, {
      method: 'PUT',
    });
  },
  
  delete: (id: string) => fetchApi<{}>(`/admin/dashboard/portfolio/${id}`, {
    method: 'DELETE',
  }),
};

export const labsApi = {
  getAll: (params?: { category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    
    const queryString = searchParams.toString();
    return fetchApi<{ labs: any[]; total: number }>(`/labs${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => fetchApi<{ lab: any }>(`/labs/${id}`),
  
  create: (labData: any, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.keys(labData).forEach(key => {
        formData.append(key, labData[key]);
      });
      formData.append('image', image);
      return fetchApiWithFormData<{ lab: any }>('/admin/dashboard/labs', formData);
    } else {
      return fetchApi<{ lab: any }>('/admin/dashboard/labs', {
        method: 'POST',
        body: JSON.stringify(labData),
      });
    }
  },
  
  update: (id: string, labData: any, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.keys(labData).forEach(key => {
        formData.append(key, labData[key]);
      });
      formData.append('image', image);
      return fetchApiWithFormData<{ lab: any }>(`/admin/dashboard/labs/${id}`, formData, {
        method: 'PUT',
      });
    } else {
      return fetchApi<{ lab: any }>(`/admin/dashboard/labs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(labData),
      });
    }
  },
  
  delete: (id: string) => fetchApi<{}>(`/admin/dashboard/labs/${id}`, {
    method: 'DELETE',
  }),
};

export const servicesApi = {
  getAll: (params?: { category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    
    const queryString = searchParams.toString();
    return fetchApi<{ services: any[]; total: number }>(`/services${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => fetchApi<{ service: any }>(`/services/${id}`),
  
  create: (serviceData: any) => 
    fetchApi<{ service: any }>('/admin/dashboard/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    }),
  
  update: (id: string, serviceData: any) => 
    fetchApi<{ service: any }>(`/admin/dashboard/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    }),
  
  delete: (id: string) => fetchApi<{}>(`/admin/dashboard/services/${id}`, {
    method: 'DELETE',
  }),
};

export const contactApi = {
  submit: (contactData: any, file?: File) => {
    const formData = new FormData();
    
    // Map frontend field names to backend field names
    const fieldMapping = {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      company: 'company',
      phone: 'phone',
      projectType: 'project_type',
      budget: 'budget',
      message: 'message'
    };
    
    // Add all contact fields to FormData with correct field names
    Object.keys(contactData).forEach(key => {
      if (contactData[key]) {
        const backendKey = fieldMapping[key as keyof typeof fieldMapping] || key;
        formData.append(backendKey, contactData[key]);
      }
    });
    
    // Add file if provided
    if (file) {
      formData.append('file', file);
    }
    
    return fetchApiWithFormData<{ contact: any }>('/contact', formData);
  },
  
  subscribeNewsletter: (email: string) => 
    fetchApi<{}>('/contact/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const estimateApi = {
  calculate: (estimateData: any) => 
    fetchApi<{ estimate: any; projectData: any }>('/estimate', {
      method: 'POST',
      body: JSON.stringify(estimateData),
    }),
  
  submitCalculator: (calculatorData: any) => 
    fetchApi<{ submissionId: string; pdfGenerated: boolean }>('/estimate/calculator', {
      method: 'POST',
      body: JSON.stringify(calculatorData),
    }),
  
  getFeatures: () => 
    fetchApi<{ features: any[]; projectTypes: any[]; timelines: any[] }>('/estimate/features'),
};

export const calculatorApi = {
  getSubmissions: () => adminApi.getCalculatorSubmissions(),
  exportPDF: (id: string) => adminApi.exportCalculatorPDF(id),
  updateSubmissionStatus: (id: string, status: string) => adminApi.updateCalculatorSubmissionStatus(id, status),
  
  getConfig: () => adminApi.getCalculatorConfig(),
  
  getProjectTypes: () => fetchApi<{ projectTypes: any[] }>('/admin/dashboard/calculator/project-types'),
  createProjectType: (data: any) => adminApi.createProjectType(data),
  updateProjectType: (id: string, data: any) => adminApi.updateProjectType(id, data),
  deleteProjectType: (id: string) => adminApi.deleteProjectType(id),
  
  getFeatures: () => fetchApi<{ features: any[] }>('/admin/dashboard/calculator/features'),
  createFeature: (data: any) => adminApi.createFeature(data),
  updateFeature: (id: string, data: any) => adminApi.updateFeature(id, data),
  deleteFeature: (id: string) => adminApi.deleteFeature(id),
  
  getDesignOptions: () => fetchApi<{ designOptions: any[] }>('/admin/dashboard/calculator/design-options'),
  createDesignOption: (data: any) => adminApi.createDesignOption(data),
  updateDesignOption: (id: string, data: any) => adminApi.updateDesignOption(id, data),
  deleteDesignOption: (id: string) => adminApi.deleteDesignOption(id),
  
  getTimelineOptions: () => fetchApi<{ timelineOptions: any[] }>('/admin/dashboard/calculator/timeline-options'),
  createTimelineOption: (data: any) => adminApi.createTimelineOption(data),
  updateTimelineOption: (id: string, data: any) => adminApi.updateTimelineOption(id, data),
  deleteTimelineOption: (id: string) => adminApi.deleteTimelineOption(id),
};

// Chat API functions
export async function getFileUrl(filePath: string): Promise<string> {
  const baseUrl = await getApiBaseUrl();
  // Remove '/api' from base URL for file serving
  const serverUrl = baseUrl.replace('/api', '');
  return `${serverUrl}${filePath}`;
}

export const chatApi = {
  initialize: (userInfo: any, chatType: 'ai' | 'admin', aiConfig?: any) =>
    fetchApi<{
      session_id: string;
      chat_type: string;
      admin_available: boolean;
      ai_models: any[];
    }>('/chat/initialize', {
      method: 'POST',
      body: JSON.stringify({
        user_info: userInfo,
        chat_type: chatType,
        ai_config: aiConfig
      }),
    }),

  sendMessage: (sessionId: string, content: string, sender: string, aiModel?: string) =>
    fetchApi<{
      message: any;
      ai_response?: any;
    }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        content,
        sender,
        ai_model: aiModel
      }),
    }),

  getChatHistory: (sessionId: string) =>
    fetchApi<{ chat: any }>(`/chat/${sessionId}/history`),

  getAdminChats: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return fetchApi<{ chats: any[]; total: number }>(`/chat/admin/chats${params}`);
  },

  updateAdminStatus: (isOnline: boolean, statusMessage?: string) =>
    fetchApi<{ adminStatus: any }>('/chat/admin/status', {
      method: 'POST',
      body: JSON.stringify({
        is_online: isOnline,
        status_message: statusMessage
      }),
    }),

  getAdminStatus: () =>
    fetchApi<{ adminStatuses: any[] }>('/chat/admin/status'),

  closeChat: (sessionId: string) =>
    fetchApi<{ chat: any }>(`/chat/${sessionId}/close`, {
      method: 'PATCH',
    }),

  exportChatPDF: (sessionId: string) =>
    fetchApi<{ pdfUrl: string }>(`/chat/${sessionId}/export`),
};