
// Simple API client for making requests
const API_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    // For development/demo purposes, add delay to simulate network latency
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body: data }),
  put: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: data }),
  patch: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body: data }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
