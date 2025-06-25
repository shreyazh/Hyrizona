import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { 
  Bell, 
  MapPin, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Globe,
  Moon,
  Smartphone,
  CreditCard,
  FileText,
  Star,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    messages: true,
    marketing: false,
    push: true
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    locationSharing: true
  });

  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  // Load saved settings on component mount
  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedPreferences = await AsyncStorage.getItem('preferences');
      
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (type: 'notifications' | 'preferences', data: any) => {
    try {
      await AsyncStorage.setItem(type, JSON.stringify(data));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const checkPermissions = async () => {
    // Check location permission
    const locationStatus = await Location.getForegroundPermissionsAsync();
    setLocationPermission(locationStatus.status);

    // Check notification permission
    const notificationStatus = await Notifications.getPermissionsAsync();
    setNotificationPermission(notificationStatus.status);
  };

  const handleNotificationToggle = async (key: keyof typeof notifications) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    await saveSettings('notifications', newNotifications);

    // If enabling push notifications, request permission
    if (key === 'push' && newNotifications.push) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive job alerts.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        // Revert the toggle if permission denied
        setNotifications(notifications);
        await saveSettings('notifications', notifications);
      }
    }
  };

  const handlePreferenceToggle = async (key: keyof typeof preferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    await saveSettings('preferences', newPreferences);

    // Handle location sharing toggle
    if (key === 'locationSharing') {
      if (newPreferences.locationSharing) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Location Permission Required',
            'Location access is needed to show you nearby job opportunities.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
          // Revert the toggle if permission denied
          setPreferences(preferences);
          await saveSettings('preferences', preferences);
        }
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            try {
              // Clear stored data
              await AsyncStorage.multiRemove([
                'notifications',
                'preferences',
                'userToken',
                'userData'
              ]);
              // Navigate to auth
              router.replace('/auth');
            } catch (error) {
              console.log('Error during logout:', error);
              router.replace('/auth');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              // Clear all stored data
              await AsyncStorage.clear();
              Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
              router.replace('/auth');
            } catch (error) {
              console.log('Error deleting account:', error);
              router.replace('/auth');
            }
          }
        }
      ]
    );
  };

  const openExternalLink = (url: string, title: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${title}`);
      }
    });
  };

  const handleRateApp = () => {
    const storeUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/hyrizona/id123456789'
      : 'https://play.google.com/store/apps/details?id=com.hyrizona.app';
    
    openExternalLink(storeUrl, 'App Store');
  };

  const handleHelpCenter = () => {
    openExternalLink('https://help.hyrizona.com', 'Help Center');
  };

  const handleTermsPrivacy = () => {
    openExternalLink('https://hyrizona.com/terms', 'Terms & Privacy');
  };

  const handleLanguageSelect = () => {
    Alert.alert(
      'Language',
      'Select your preferred language',
      [
        { text: 'English (US)', onPress: () => console.log('Language: English') },
        { text: 'Spanish', onPress: () => console.log('Language: Spanish') },
        { text: 'French', onPress: () => console.log('Language: French') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleAppPreferences = () => {
    Alert.alert(
      'App Preferences',
      'Customize your app experience',
      [
        { text: 'Clear Cache', onPress: () => Alert.alert('Success', 'Cache cleared successfully') },
        { text: 'Reset Settings', onPress: () => {
          Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all settings to default?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', onPress: () => {
                setNotifications({
                  jobAlerts: true,
                  messages: true,
                  marketing: false,
                  push: true
                });
                setPreferences({
                  darkMode: false,
                  locationSharing: true
                });
                Alert.alert('Success', 'Settings reset to default');
              }}
            ]
          );
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePaymentMethods = () => {
    Alert.alert(
      'Payment Methods',
      'Manage your payment and payout methods',
      [
        { text: 'Add Payment Method', onPress: () => Alert.alert('Coming Soon', 'Payment method management will be available soon') },
        { text: 'View Transactions', onPress: () => Alert.alert('Coming Soon', 'Transaction history will be available soon') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePrivacySecurity = () => {
    Alert.alert(
      'Privacy & Security',
      'Manage your privacy settings and security',
      [
        { text: 'Change Password', onPress: () => Alert.alert('Coming Soon', 'Password change will be available soon') },
        { text: 'Two-Factor Auth', onPress: () => Alert.alert('Coming Soon', 'Two-factor authentication will be available soon') },
        { text: 'Data Export', onPress: () => Alert.alert('Coming Soon', 'Data export will be available soon') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightElement,
    showPermissionStatus = false,
    permissionStatus
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
    showPermissionStatus?: boolean;
    permissionStatus?: 'granted' | 'denied' | 'undetermined';
  }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon size={20} color="#2563EB" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          {showPermissionStatus && permissionStatus && (
            <View style={styles.permissionStatus}>
              {permissionStatus === 'granted' ? (
                <CheckCircle size={14} color="#10B981" />
              ) : (
                <XCircle size={14} color="#EF4444" />
              )}
              <Text style={[
                styles.permissionText,
                { color: permissionStatus === 'granted' ? '#10B981' : '#EF4444' }
              ]}>
                {permissionStatus === 'granted' ? 'Permission granted' : 'Permission required'}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {rightElement}
        {showChevron && onPress && (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingItem
            icon={Bell}
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => Alert.alert('Notifications', 'Notification settings are managed below')}
          />
          
          <SettingItem
            icon={MapPin}
            title="Location Services"
            subtitle="Control location sharing and job discovery"
            showChevron={false}
            showPermissionStatus={true}
            permissionStatus={locationPermission}
            rightElement={
              <Switch
                value={preferences.locationSharing}
                onValueChange={() => handlePreferenceToggle('locationSharing')}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={preferences.locationSharing ? '#2563EB' : '#9CA3AF'}
              />
            }
          />
          
          <SettingItem
            icon={Shield}
            title="Privacy & Security"
            subtitle="Manage your privacy settings and security"
            onPress={handlePrivacySecurity}
          />
          
          <SettingItem
            icon={CreditCard}
            title="Payment Methods"
            subtitle="Manage your payment and payout methods"
            onPress={handlePaymentMethods}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <SettingItem
            icon={Moon}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            showChevron={false}
            rightElement={
              <Switch
                value={preferences.darkMode}
                onValueChange={() => handlePreferenceToggle('darkMode')}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={preferences.darkMode ? '#2563EB' : '#9CA3AF'}
              />
            }
          />
          
          <SettingItem
            icon={Globe}
            title="Language"
            subtitle="English (US)"
            onPress={handleLanguageSelect}
          />
          
          <SettingItem
            icon={Smartphone}
            title="App Preferences"
            subtitle="Customize your app experience"
            onPress={handleAppPreferences}
          />
        </View>

        {/* Notification Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          
          <SettingItem
            icon={Bell}
            title="Job Alerts"
            subtitle="Get notified about new job opportunities"
            showChevron={false}
            rightElement={
              <Switch
                value={notifications.jobAlerts}
                onValueChange={() => handleNotificationToggle('jobAlerts')}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={notifications.jobAlerts ? '#2563EB' : '#9CA3AF'}
              />
            }
          />
          
          <SettingItem
            icon={Bell}
            title="Messages"
            subtitle="Get notified about new messages"
            showChevron={false}
            rightElement={
              <Switch
                value={notifications.messages}
                onValueChange={() => handleNotificationToggle('messages')}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={notifications.messages ? '#2563EB' : '#9CA3AF'}
              />
            }
          />
          
          <SettingItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive push notifications on your device"
            showChevron={false}
            showPermissionStatus={true}
            permissionStatus={notificationPermission}
            rightElement={
              <Switch
                value={notifications.push}
                onValueChange={() => handleNotificationToggle('push')}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={notifications.push ? '#2563EB' : '#9CA3AF'}
              />
            }
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon={HelpCircle}
            title="Help Center"
            subtitle="Get help and find answers to common questions"
            onPress={handleHelpCenter}
          />
          
          <SettingItem
            icon={Star}
            title="Rate Hyrizona"
            subtitle="Share your feedback on the app store"
            onPress={handleRateApp}
          />
          
          <SettingItem
            icon={FileText}
            title="Terms & Privacy"
            subtitle="Read our terms of service and privacy policy"
            onPress={handleTermsPrivacy}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Hyrizona v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 Hyrizona. All rights reserved to MatrixAI.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  permissionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  permissionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginLeft: 12,
  },
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  deleteText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    textAlign: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});