import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';

const auth0ClientId = 'HHkjs4uACOc1O27m3v865SJqbMdAcEfZ';
const auth0Domain = 'dev-jbrriuc5vyjmiwtx.us.auth0.com';

const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
};

export default function InitialScreen() {
  const router = useRouter();

  const redirectUri = makeRedirectUri({ useProxy: Platform.OS !== 'web' });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: auth0ClientId,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  useEffect(() => {
    const hasCompletedOnboarding = true; // You can replace this with AsyncStorage logic
    const isAuthenticated = false; // Replace with token-based check

    if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else if (!isAuthenticated && request) {
      promptAsync(); // works on both mobile and web
    } else if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [request]);

  useEffect(() => {
    if (response?.type === 'success') {
      Alert.alert('Login Success', 'Welcome!');
      router.replace('/(tabs)');
    } else if (response?.type === 'dismiss') {
      Alert.alert('Login Cancelled');
    } else if (response?.type === 'error') {
      Alert.alert('Login Failed', 'Something went wrong');
    }
  }, [response]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
  },
});
