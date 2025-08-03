import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, onboardingComplete } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const redirectRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !redirectRef.current) {
      redirectRef.current = true;

      if (!isAuthenticated) {
        router.replace('/');
      } else if (!onboardingComplete) {
        router.replace('/onboarding');
      } else {
        setChecking(false);
      }
    }
  }, [isLoading, isAuthenticated, onboardingComplete]);

  if (isLoading || checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <>{children}</>;
}
