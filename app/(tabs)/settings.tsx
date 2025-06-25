import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  MapPin, 
  Shield, 
  HelpCirc, 
  LogOut,
  ChevronRight,
  Globe,
  Moon,
  Smartphone,
  CreditCard,
  FileText,
  Star
} from 'lucide-react-native';

export default function SettingsScreen() {
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

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Logout') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete account') }
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightElement 
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
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
            onPress={() => console.log('Notifications')}
          />
          
          <SettingItem
            icon={MapPin}
            title="Location Services"
            subtitle="Control location sharing and job discovery"
            showChevron={false}
            rightElement={
              <Switch
                value={preferences.locationSharing}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, locationSharing: value }))
                }
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={preferences.locationSharing ? '#2563EB' : '#9CA3AF'}
              />
            }
          />
          
          <SettingItem
            icon={Shield}
            title="Privacy & Security"
            subtitle="Manage your privacy settings and security"
            onPress={() => console.log('Privacy')}
          />
          
          <SettingItem
            icon={CreditCard}
            title="Payment Methods"
            subtitle="Manage your payment and payout methods"
            onPress={() => console.log('Payment')}
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
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, darkMode: value }))
                }
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={preferences.darkMode ? '#2563EB' : '#9CA3AF'}
              />
            }
          />
          
          <SettingItem
            icon={Globe}
            title="Language"
            subtitle="English (US)"
            onPress={() => console.log('Language')}
          />
          
          <SettingItem
            icon={Smartphone}
            title="App Preferences"
            subtitle="Customize your app experience"
            onPress={() => console.log('App preferences')}
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
                onValueChange={(value) => 
                  setNotifications(prev => ({ ...prev, jobAlerts: value }))
                }
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
                onValueChange={(value) => 
                  setNotifications(prev => ({ ...prev, messages: value }))
                }
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
            rightElement={
              <Switch
                value={notifications.push}
                onValueChange={(value) => 
                  setNotifications(prev => ({ ...prev, push: value }))
                }
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
            icon={HelpCirc}
            title="Help Center"
            subtitle="Get help and find answers to common questions"
            onPress={() => console.log('Help')}
          />
          
          <SettingItem
            icon={Star}
            title="Rate Hyrizona"
            subtitle="Share your feedback on the app store"
            onPress={() => console.log('Rate app')}
          />
          
          <SettingItem
            icon={FileText}
            title="Terms & Privacy"
            subtitle="Read our terms of service and privacy policy"
            onPress={() => console.log('Terms')}
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