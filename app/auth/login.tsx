import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import { useAuthRequest } from 'expo-auth-session';
import { ArrowLeft } from 'lucide-react-native';

const auth0ClientId = 'HHkjs4uACOc1O27m3v865SJqbMdAcEfZ';
const auth0Domain = 'dev-jbrriuc5vyjmiwtx.us.auth0.com';

export default function LoginScreen() {
  const router = useRouter();
  const discovery = AuthSession.useAutoDiscovery(`https://${auth0Domain}`);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: auth0ClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri(),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      Alert.alert('Login Success', 'You are logged in!');
      router.replace('/(tabs)');
    } else if (response?.type === 'error') {
      Alert.alert('Login failed', response.error?.message || 'Unexpected error');
    }
  }, [response]);

  const handleLoginWithAuth0 = () => {
    if (!discovery) {
      Alert.alert('Discovery Error', 'Auth0 discovery document not loaded.');
      return;
    }
    promptAsync();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#2563EB" />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Back ABC</Text>
        <Text style={styles.subtitle}>Sign in with your account</Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLoginWithAuth0}
        >
          <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            style={styles.loginButtonGradient}
          >
            <Text style={styles.loginButtonText}>Sign In with Auth0</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  backButton: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  form: {
    marginTop: 24,
  },
  loginButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
