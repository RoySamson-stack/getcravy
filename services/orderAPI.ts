import { apiRequest } from './api';

export type CreateOrderPayload = {
  restaurantId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  paymentMethod: 'card' | 'paypal' | 'cash';
  deliveryAddress: string;
  deliveryInstructions?: string;
  contactPhone?: string;
};

export const orderAPI = {
  createOrder: async (payload: CreateOrderPayload) => {
    const response = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, order: data.data.order, checkout: data.data.checkout };
    }

    return { success: false, message: data.message || 'Failed to create order' };
  },

  verifyPayment: async (orderId: string, reference?: string) => {
    const response = await apiRequest(`/orders/${orderId}/verify-payment`, {
      method: 'POST',
      body: JSON.stringify(reference ? { reference } : {}),
    });
    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, order: data.data.order, verification: data.data.verification };
    }

    return { success: false, message: data.message || 'Failed to verify payment' };
  },

  getMyOrders: async () => {
    const response = await apiRequest('/orders');
    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, orders: data.data.orders };
    }

    return { success: false, message: data.message || 'Failed to fetch orders' };
  },
};
