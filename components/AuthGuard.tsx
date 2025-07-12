import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.replace('/auth/login');
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
} 