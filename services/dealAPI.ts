import { apiRequest } from './api';

export interface Deal {
  id: string;
  title: string;
  description?: string;
  discount?: string;
  dayOfWeek?: number | null; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday, null = daily
  startTime?: string;
  endTime?: string;
  validFrom?: string;
  validUntil?: string;
  restaurantId: string;
  isActive: boolean;
  featured: boolean;
  restaurant?: {
    id: string;
    name: string;
    imageUrl?: string;
    neighborhood?: string;
    address?: string;
    phone?: string;
  };
}

export interface DealResponse {
  success: boolean;
  data: Deal[];
}

export const dealAPI = {
  getToday: async (): Promise<DealResponse> => {
    const response = await apiRequest('/deals/today');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch today\'s deals');
    }
    
    return data;
  },

  getThisWeek: async (): Promise<DealResponse> => {
    const response = await apiRequest('/deals/this-week');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch this week\'s deals');
    }
    
    return data;
  },

  getByRestaurant: async (restaurantId: string): Promise<DealResponse> => {
    const response = await apiRequest(`/deals/restaurants/${restaurantId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch restaurant deals');
    }
    
    return data;
  }
};



