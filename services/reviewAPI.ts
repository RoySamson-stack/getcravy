import { apiRequest } from './api';

export const reviewAPI = {
  getRestaurantReviews: async (restaurantId: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const endpoint = `/reviews/restaurants/${restaurantId}/reviews${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { 
        success: true, 
        reviews: data.data.reviews,
        pagination: data.data.pagination
      };
    }
    
    return { success: false, message: data.message || 'Failed to fetch reviews' };
  },

  createReview: async (restaurantId: string, reviewData: {
    rating: number;
    comment?: string;
    photos?: string[];
    foodRating?: number;
    serviceRating?: number;
    ambianceRating?: number;
    valueRating?: number;
    menuItemId?: string;
  }) => {
    const response = await apiRequest(`/reviews/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, review: data.data.review };
    }
    
    return { success: false, message: data.message || 'Failed to create review' };
  },

  updateReview: async (reviewId: string, reviewData: any) => {
    const response = await apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, review: data.data.review };
    }
    
    return { success: false, message: data.message || 'Failed to update review' };
  },

  deleteReview: async (reviewId: string) => {
    const response = await apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true };
    }
    
    return { success: false, message: data.message || 'Failed to delete review' };
  },
};








