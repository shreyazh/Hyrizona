import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
const AUTH0_CLIENT_ID = 'HHkjs4uACOc1O27m3v865SJqbMdAcEfZ';
const AUTH0_DOMAIN = 'dev-jbrriuc5vyjmiwtx.us.auth0.com';
const AUTH0_LOGOUT_REDIRECT_URI = AuthSession.makeRedirectUri();
import { useRouter } from 'expo-router';

interface User {
  email: string;
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
const router = useRouter();
  useEffect(() => {
    const loadUserFromStore = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        const userId = await SecureStore.getItemAsync('userId');

        if (token && userId) {
          setUser({ email: userId });
        }
      } catch (err) {
        console.error('Failed to load user from SecureStore:', err);
      }
    };

    loadUserFromStore();
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('userId');
    setUser(null);
    const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(AUTH0_LOGOUT_REDIRECT_URI)}`;
    
    await WebBrowser.openAuthSessionAsync(logoutUrl);
    router.push('/logout')

  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
