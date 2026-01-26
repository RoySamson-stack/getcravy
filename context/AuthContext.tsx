import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/navigation';
import { authAPI } from '../services/api';

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const lastActivityRef = React.useRef<number>(Date.now());

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const token = await AsyncStorage.getItem('authToken');
        
        if (userData && token) {
          // Verify token is still valid by getting current user
          const result = await authAPI.getCurrentUser();
          if (result.success && result.user) {
            setUser(result.user);
          } else {
            // Token invalid, clear storage
            await authAPI.logout();
          }
        }
      } catch (e) {
        console.log('Error loading user data', e);
        // Clear invalid data
        await authAPI.logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authAPI.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const result = await authAPI.register(name, email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await authAPI.logout();
    setUser(null);
    lastActivityRef.current = Date.now();
  };

  // Track user activity
  const updateActivity = React.useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};




// import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { endpoints } from '../endpoints/endpoints';

// export const AuthContext = createContext({
//   isLoading: true,
//   userToken: null,
//   userData: null,
//   login: async (email: string, password: string) => false,
//   signup: async (name: string, email: string, password: string, phone: string) => ({ success: false, message: '' }),
//   logout: async () => {},
// });

// export const AuthProvider = ({ children }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [userToken, setUserToken] = useState(null);
//   const [userData, setUserData] = useState(null);

//   // Check if user is logged in on app startup
//   useEffect(() => {
//     const bootstrapAsync = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const user = await AsyncStorage.getItem('userData');
        
//         if (token && user) {
//           setUserToken(token);
//           setUserData(JSON.parse(user));
//         }
//       } catch (e) {
//         console.error('Failed to load auth data', e);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     bootstrapAsync();
//   }, []);

//   interface LoginResponse {
//     token: string;
//     user: Record<string, any>;
//   }

//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       const response = await fetch(endpoints.login, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       const data: LoginResponse = await response.json();

//       if (response.ok) {
//         const { token, user } = data;
//         // Store user token and data
//         await AsyncStorage.setItem('userToken', token);
//         await AsyncStorage.setItem('userData', JSON.stringify(user));
        
//         setUserToken(token);
//         setUserData(user);
//         return true;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       return false;
//     }
//   };

//   const signup = async (name, email, password, phone) => {
//     try {
//       const response = await fetch(endpoints.signup, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           phone
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         return { success: true, data };
//       } else {
//         return { success: false, message: data.message || 'Signup failed' };
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//       return { success: false, message: 'Network error' };
//     }
//   };

//   const logout = async () => {
//     try {
//       // Remove user data from storage
//       await AsyncStorage.removeItem('userToken');
//       await AsyncStorage.removeItem('userData');
//       setUserToken(null);
//       setUserData(null);
//     } catch (e) {
//       console.error('Logout error:', e);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoading,
//         userToken,
//         userData,
//         login,
//         signup,
//         logout
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };