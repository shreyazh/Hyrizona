import React from 'react';
import { Tabs } from 'expo-router';
import { useUser } from '../../contexts/UserContext';

export default function TabsLayout() {
  const { role } = useUser();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        headerStyle: { backgroundColor: '#2563EB' },
        headerTintColor: 'white',
      }}
    >
      {role === 'employer' ? (
        <>
          <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
          <Tabs.Screen name="post-job" options={{ title: 'Post Job' }} />
          <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
        </>
      ) : (
        <>
          <Tabs.Screen name="search" options={{ title: 'Search Jobs' }} />
          <Tabs.Screen name="profile" options={{ title: 'My Profile' }} />
          <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
        </>
      )}
    </Tabs>
  );
}
