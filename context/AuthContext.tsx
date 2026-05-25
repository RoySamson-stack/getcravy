import React, { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '../types/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const makePreviewUser = (email: string, name?: string): User => ({
  id: 'preview-user',
  name: name?.trim() || email.split('@')[0] || 'Preview User',
  email,
  favorites: [],
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const loading = false;

  const login = async (email: string): Promise<boolean> => {
    const safeEmail = String(email || 'preview@cravyapp.com').trim() || 'preview@cravyapp.com';
    setUser(makePreviewUser(safeEmail));
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    const safeEmail = String(email || 'preview@cravyapp.com').trim() || 'preview@cravyapp.com';
    setUser(makePreviewUser(safeEmail, String(name || 'Preview User')));
    return true;
  };

  const logout = async (): Promise<void> => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>): void => {
    setUser((currentUser) => (currentUser ? { ...currentUser, ...userData } : currentUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context) return context;

  return {
    user: null,
    loading: false,
    login: async () => true,
    signup: async () => true,
    logout: async () => undefined,
    updateUser: () => undefined,
  };
};
