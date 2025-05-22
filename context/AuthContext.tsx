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