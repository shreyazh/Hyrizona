import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="_notifications-settings" />
      <Stack.Screen name="_privacy-security" />
    </Stack>
  );
} 