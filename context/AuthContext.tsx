import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.log('Error loading user data', e);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const login = async (email:any, password: any) => {
    // This is a mock function - in a real app, you'd connect to an API
    if (email === 'test@example.com' && password === 'password') {
      const testUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        favorites: ['1', '3', '5']
      };
      await AsyncStorage.setItem('user', JSON.stringify(testUser));
      setUser(testUser);
      return true;
    }
    return false;
  };

interface SignupUser {
    id: string;
    name: string;
    email: string;
    favorites: string[];
}

const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup function
    const newUser: SignupUser = {
        id: Math.floor(Math.random() * 1000).toString(),
        name,
        email,
        favorites: []
    };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
};

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
