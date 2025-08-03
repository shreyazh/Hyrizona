import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import jwtDecode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

const clientId = 'HHkjs4uACOc1O27m3v865SJqbMdAcEfZ';
const auth0Domain = 'dev-jbrriuc5vyjmiwtx.us.auth0.com';


const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/v2/logout`,
};

const getUserInfo = async (accessToken: string): Promise<any | null> => {
  try {
    const res = await fetch(`https://${auth0Domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user info');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const LoginScreen: React.FC = () => {
    const { setUser } = useUser();
  const router = useRouter();
  const navigation = useNavigation();
  const promptedRef = useRef(false);
  const executedRef = useRef(false);

  const redirectUri = makeRedirectUri({
    useProxy: Platform.select({ web: false, default: true }),
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Token,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    const checkOnboardingAndPromptLogin = async () => {
      if (promptedRef.current) return;

      const hasCompleted = await SecureStore.getItemAsync('hasCompletedOnboarding');
      if (!hasCompleted || hasCompleted !== 'true') {
        console.log('User has NOT completed onboarding, navigating...');
        router.push('/onboarding');
      } else if (request && promptAsync) {
        promptedRef.current = true;
        console.log('User has completed onboarding, prompting login...');
        await promptAsync({ useProxy: Platform.select({ web: false, default: true }) });
      }
    };

    checkOnboardingAndPromptLogin();
  }, [request]);

  useEffect(() => {
    const handleResponse = async () => {
      if (executedRef.current || response?.type !== 'success') return;

      executedRef.current = true;
      let accessToken: string | null = response.params.access_token;

      if (Platform.OS === 'web' && !accessToken) {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        accessToken = params.get('access_token');
      }

      if (accessToken) {
        await SecureStore.setItemAsync('accessToken', accessToken);
        console.log('Access Token saved:', accessToken);

        const userInfo = await getUserInfo(accessToken);

        if (userInfo) {
          const user_id = userInfo?.email || userInfo?.sub;
          console.log('Mock Profile Exists:', user_id);

        await SecureStore.setItemAsync('userId', user_id);
        await SecureStore.setItemAsync('accessToken', accessToken);
        setUser(userInfo); // ✅ This is what sets isAuthenticated = true
        //console.log('User info set:', userInfo);
        if (user_id) {
            router.push('/(tabs)/profile');
          } else {
            navigation.navigate('/(tabs)/dashboard' as never);
          }
         }
      }
    };

    handleResponse();
  }, [response]);

  return (
    <View style={styles.container}>
    
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
