import { apiRequest } from './api';

export const menuAPI = {
  getRestaurantMenu: async (restaurantId: string, filters?: { category?: string; available?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.available !== undefined) params.append('available', filters.available.toString());
    
    const queryString = params.toString();
    const endpoint = `/menu/restaurants/${restaurantId}/menu${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, menuItems: data.data.menuItems };
    }
    
    return { success: false, message: data.message || 'Failed to fetch menu' };
  },

  getMenuItemById: async (id: string) => {
    const response = await apiRequest(`/menu/${id}`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, menuItem: data.data.menuItem };
    }
    
    return { success: false, message: data.message || 'Failed to fetch menu item' };
  },
};








