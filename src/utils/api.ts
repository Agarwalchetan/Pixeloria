const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchApiWithFormData<T>(
  endpoint: string,
  formData: FormData,
  options?: Omit<RequestInit, 'body'>
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

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
};

export const labsApi = {
  getAll: (params?: { category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    
    const queryString = searchParams.toString();
    return fetchApi<{ labs: any[]; total: number }>(`/labs${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => fetchApi<{ lab: any }>(`/labs/${id}`),
};

export const servicesApi = {
  getAll: (params?: { category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    
    const queryString = searchParams.toString();
    return fetchApi<{ services: any[]; total: number }>(`/services${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => fetchApi<{ service: any }>(`/services/${id}`),
};

export const contactApi = {
  submit: (contactData: any, file?: File) => {
    const formData = new FormData();
    
    // Add all contact fields to FormData
    Object.keys(contactData).forEach(key => {
      if (contactData[key]) {
        formData.append(key, contactData[key]);
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
  
  getFeatures: () => 
    fetchApi<{ features: any[]; projectTypes: any[]; timelines: any[] }>('/estimate/features'),
};