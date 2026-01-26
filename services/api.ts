import AsyncStorage from '@react-native-async-storage/async-storage';
import { endpoints } from '../endpoints/endpoints';

// Get base URL from environment or use default
// Use IP address instead of localhost for mobile device access
const BASE_URL = process.env.API_BASE_URL || 'http://192.168.100.4:5000/api';

// Get stored token
const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Store token
const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Remove token
const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// API request wrapper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token refresh if needed
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          await setToken(data.data.token);
          // Retry original request
          headers['Authorization'] = `Bearer ${data.data.token}`;
          return fetch(url, { ...options, headers });
        }
      }
      // Refresh failed, remove tokens
      await removeToken();
    }

    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      await setToken(data.data.token);
      await AsyncStorage.setItem('refreshToken', data.data.refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
      return { success: true, user: data.data.user };
    }
    
    return { success: false, message: data.message || 'Login failed' };
  },

  register: async (name: string, email: string, password: string, phone?: string) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      await setToken(data.data.token);
      await AsyncStorage.setItem('refreshToken', data.data.refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
      return { success: true, user: data.data.user };
    }
    
    return { success: false, message: data.message || 'Registration failed' };
  },

  logout: async () => {
    await removeToken();
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userData');
  },

  getCurrentUser: async () => {
    const response = await apiRequest('/auth/me');
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, user: data.data.user };
    }
    
    return { success: false, message: data.message || 'Failed to get user' };
  },
};

// Export apiRequest for other API modules
export { apiRequest };

// Create axios-like API client for videoAPI
const api = {
  get: async (url: string, config?: { params?: any }) => {
    const queryString = config?.params 
      ? '?' + new URLSearchParams(
          Object.entries(config.params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : '';
    const response = await apiRequest(`${url}${queryString}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return { data };
  },
  post: async (url: string, body?: any) => {
    const response = await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return { data };
  },
};

export default api;

// Restaurant API
export const restaurantAPI = {
  getAll: async (filters?: {
    page?: number;
    limit?: number;
    category?: string;
    city?: string;
    neighborhood?: string;
    search?: string;
    minRating?: number;
    featured?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/restaurants${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, restaurants: data.data.restaurants, pagination: data.data.pagination };
    }
    
    return { success: false, message: data.message || 'Failed to fetch restaurants' };
  },

  getById: async (id: string) => {
    const response = await apiRequest(`/restaurants/${id}`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, restaurant: data.data.restaurant };
    }
    
    return { success: false, message: data.message || 'Failed to fetch restaurant' };
  },

  getFeatured: async () => {
    const response = await apiRequest('/restaurants/featured');
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, restaurants: data.data.restaurants };
    }
    
    return { success: false, message: data.message || 'Failed to fetch featured restaurants' };
  },

  getNearby: async (latitude: number, longitude: number, radius?: number) => {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
    if (radius) {
      params.append('radius', radius.toString());
    }
    
    const response = await apiRequest(`/restaurants/nearby?${params.toString()}`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, restaurants: data.data.restaurants };
    }
    
    return { success: false, message: data.message || 'Failed to fetch nearby restaurants' };
  },

  search: async (query: string, filters?: any) => {
    return restaurantAPI.getAll({ ...filters, search: query });
  },
};

