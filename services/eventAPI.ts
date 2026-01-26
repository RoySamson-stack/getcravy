import { apiRequest } from './api';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  price?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  attendeesCount: number;
  eventType: 'restaurant_event' | 'festival' | 'popup' | 'special' | 'entertainment';
  imageUrl?: string;
  restaurantId?: string;
  userId: string;
  featured: boolean;
  isActive: boolean;
  restaurant?: {
    id: string;
    name: string;
    imageUrl?: string;
    neighborhood?: string;
  };
  creator?: {
    id: string;
    name: string;
  };
  userAttendance?: {
    status: 'going' | 'interested';
  } | null;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  eventType?: string;
  dateFrom?: string;
  dateTo?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  featured?: boolean;
  restaurantId?: string;
  search?: string;
  sortBy?: 'date' | 'attendees' | 'price';
  sortOrder?: 'ASC' | 'DESC';
}

export interface EventResponse {
  success: boolean;
  data: Event[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const eventAPI = {
  getAll: async (filters: EventFilters = {}): Promise<EventResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiRequest(`/events?${params.toString()}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }
    
    return data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Event }> => {
    const response = await apiRequest(`/events/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch event');
    }
    
    return data;
  },

  attend: async (eventId: string, status: 'going' | 'interested'): Promise<{ success: boolean; data: any }> => {
    const response = await apiRequest(`/events/${eventId}/attend`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to attend event');
    }
    
    return data;
  },

  removeAttendance: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiRequest(`/events/${eventId}/attend`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove attendance');
    }
    
    return data;
  },

  getAttendees: async (eventId: string, page: number = 1, limit: number = 20, status?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) {
      params.append('status', status);
    }

    const response = await apiRequest(`/events/${eventId}/attendees?${params.toString()}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch attendees');
    }
    
    return data;
  }
};



