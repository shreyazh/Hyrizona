import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

export default function Logout() {
 

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You're Logged out...</Text>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
});
