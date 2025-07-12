import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // For demo purposes - in production, never store passwords in plain text
  userType: 'seeker' | 'poster';
  location?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  skills?: string[];
  address?: string;
  profilePhoto?: string;
  idProof?: string;
  phone?: string;
  jobRole?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'seeker' | 'poster';
  address?: string;
  profilePhoto?: string;
  idProof?: string;
  phone?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserToStorage = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const saveUserToJSON = async (userData: User) => {
    try {
      // Get existing users
      const existingUsersData = await AsyncStorage.getItem('users');
      const existingUsers: User[] = existingUsersData ? JSON.parse(existingUsersData) : [];
      
      // Check if user already exists
      const existingUserIndex = existingUsers.findIndex(u => u.email === userData.email);
      
      if (existingUserIndex >= 0) {
        // Update existing user
        existingUsers[existingUserIndex] = userData;
      } else {
        // Add new user
        existingUsers.push(userData);
      }
      
      // Save updated users list
      await AsyncStorage.setItem('users', JSON.stringify(existingUsers));
    } catch (error) {
      console.error('Error saving user to JSON:', error);
    }
  };

  const getUserFromJSON = async (email: string, password: string): Promise<User | null> => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      if (!usersData) return null;
      
      const users: User[] = JSON.parse(usersData);
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      return foundUser || null;
    } catch (error) {
      console.error('Error getting user from JSON:', error);
      return null;
    }
  };

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      if (!usersData) return false;
      
      const users: User[] = JSON.parse(usersData);
      return users.some(u => u.email === email);
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Check if user exists in JSON database
      const foundUser = await getUserFromJSON(email, password);
      
      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      setUser(foundUser);
      await saveUserToStorage(foundUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const userExists = await checkUserExists(userData.email);
      if (userExists) {
        return { success: false, error: 'User with this email already exists' };
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // In production, hash this password
        userType: userData.userType,
        location: 'Unknown',
        isVerified: false,
        createdAt: new Date().toISOString(),
        address: userData.address,
        profilePhoto: userData.profilePhoto,
        idProof: userData.idProof,
        phone: userData.phone,
      };

      // Save to JSON database
      await saveUserToJSON(newUser);
      
      // Set as current user
      setUser(newUser);
      await saveUserToStorage(newUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        await saveUserToStorage(updatedUser);
        await saveUserToJSON(updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    }
  };

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 