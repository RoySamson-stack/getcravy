import React, { createContext, useContext } from 'react';

export type CartItem = {
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartSummary = {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  summary: CartSummary;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (menuItemId: string, quantity: number) => Promise<void>;
  removeItem: (menuItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const emptySummary: CartSummary = { subtotal: 0, deliveryFee: 0, tax: 0, total: 0 };
const noopCart: CartContextType = {
  items: [],
  loading: false,
  summary: emptySummary,
  addItem: async () => undefined,
  updateQuantity: async () => undefined,
  removeItem: async () => undefined,
  clearCart: async () => undefined,
};

const CartContext = createContext<CartContextType>(noopCart);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  return <CartContext.Provider value={noopCart}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
