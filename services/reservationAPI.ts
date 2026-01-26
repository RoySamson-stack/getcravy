import { apiRequest } from './api';

export const reservationAPI = {
  createReservation: async (restaurantId: string, reservationData: {
    date: string;
    time: string;
    partySize: number;
    specialRequests?: string;
  }) => {
    const response = await apiRequest(`/reservations/restaurants/${restaurantId}/reservations`, {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, reservation: data.data.reservation };
    }
    
    return { success: false, message: data.message || 'Failed to create reservation' };
  },

  getUserReservations: async (filters?: { status?: string; upcoming?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.upcoming) params.append('upcoming', 'true');
    
    const queryString = params.toString();
    const endpoint = `/reservations${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, reservations: data.data.reservations };
    }
    
    return { success: false, message: data.message || 'Failed to fetch reservations' };
  },

  getAvailability: async (restaurantId: string, date: string) => {
    const response = await apiRequest(`/reservations/restaurants/${restaurantId}/availability?date=${date}`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { 
        success: true, 
        availableSlots: data.data.availableSlots,
        date: data.data.date
      };
    }
    
    return { success: false, message: data.message || 'Failed to fetch availability' };
  },

  updateReservation: async (reservationId: string, reservationData: any) => {
    const response = await apiRequest(`/reservations/${reservationId}`, {
      method: 'PUT',
      body: JSON.stringify(reservationData),
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, reservation: data.data.reservation };
    }
    
    return { success: false, message: data.message || 'Failed to update reservation' };
  },

  cancelReservation: async (reservationId: string) => {
    const response = await apiRequest(`/reservations/${reservationId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true };
    }
    
    return { success: false, message: data.message || 'Failed to cancel reservation' };
  },
};








