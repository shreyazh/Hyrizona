import React from 'react';
import { Slot } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { ToastProvider } from '../contexts/ToastContext';
import Toast from '../components/Toast';
import { UserProvider, useUser } from '../contexts/UserContext'; // ✅ add UserProvider

export default function Layout() {
  return (
    <UserProvider> {/* ✅ Wrap everything in UserProvider */}
      <ToastProvider>
        <LayoutContent />
        <Toast />
      </ToastProvider>
    </UserProvider>
  );
}

function LayoutContent() {
  const { isAuthenticated, user, logout } = useUser();

  return (
    <View style={{ flex: 1 }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#2563EB',
        alignItems: 'center'
      }}>
        {isAuthenticated ? (
          <>
            <Text style={{ color: 'white', fontSize: 16 }}>
             <Text style={{ color: 'white', fontSize: 16 }}>
  Hello, {String(user?.email || 'User')}!
</Text>
            </Text>
            <TouchableOpacity onPress={logout}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
                padding: 6,
                backgroundColor: '#1E40AF',
                borderRadius: 6
              }}>
                Logout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ color: 'white', fontSize: 16 }}>Welcome to the App</Text>
        )}
      </View>

      <Slot />
    </View>
  );
}
