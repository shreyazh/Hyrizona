import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function InitialScreen() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = false; // This would come from AsyncStorage
    const isAuthenticated = false; // This would come from auth state

    if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else if (!isAuthenticated) {
      router.replace('/auth');
    } else {
      router.replace('/(tabs)');
    }
  }, []);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
  },
});