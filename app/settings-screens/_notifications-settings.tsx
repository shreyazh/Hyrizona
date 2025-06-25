import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { 
  Bell, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  MessageCircle,
  DollarSign,
  Shield,
  Users
} from 'lucide-react-native';

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    messages: true,
    marketing: false,
    push: true,
    nearbyJobs: true,
    applicationUpdates: true,
    paymentNotifications: true,
    securityAlerts: true,
    weeklyDigest: false,
    socialUpdates: false
  });

  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  });

  useEffect(() => {
    loadNotificationSettings();
    checkNotificationPermission();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedQuietHours = await AsyncStorage.getItem('quietHours');
      
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      if (savedQuietHours) {
        setQuietHours(JSON.parse(savedQuietHours));
      }
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (data: any) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(data));
    } catch (error) {
      console.log('Error saving notification settings:', error);
    }
  };

  const saveQuietHours = async (data: any) => {
    try {
      await AsyncStorage.setItem('quietHours', JSON.stringify(data));
    } catch (error) {
      console.log('Error saving quiet hours:', error);
    }
  };

  const checkNotificationPermission = async () => {
    const status = await Notifications.getPermissionsAsync();
    setNotificationPermission(status.status);
  };

  const handleNotificationToggle = async (key: keyof typeof notifications) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    await saveNotificationSettings(newNotifications);

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
        await saveNotificationSettings(notifications);
      }
    }
  };

  const handleQuietHoursToggle = async () => {
    const newQuietHours = { ...quietHours, enabled: !quietHours.enabled };
    setQuietHours(newQuietHours);
    await saveQuietHours(newQuietHours);
  };

  const handleQuietHoursTimeChange = (type: 'start' | 'end') => {
    Alert.alert(
      `Set ${type === 'start' ? 'Start' : 'End'} Time`,
      'Time picker will be implemented in the next update',
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const NotificationItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    value,
    onToggle,
    showPermissionStatus = false
  }: {
    icon: any;
    title: string;
    subtitle: string;
    value: boolean;
    onToggle: () => void;
    showPermissionStatus?: boolean;
  }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationLeft}>
        <View style={styles.notificationIcon}>
          <Icon size={20} color="#2563EB" />
        </View>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{title}</Text>
          <Text style={styles.notificationSubtitle}>{subtitle}</Text>
          {showPermissionStatus && (
            <View style={styles.permissionStatus}>
              {notificationPermission === 'granted' ? (
                <CheckCircle size={14} color="#10B981" />
              ) : (
                <XCircle size={14} color="#EF4444" />
              )}
              <Text style={[
                styles.permissionText,
                { color: notificationPermission === 'granted' ? '#10B981' : '#EF4444' }
              ]}>
                {notificationPermission === 'granted' ? 'Permission granted' : 'Permission required'}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
        thumbColor={value ? '#2563EB' : '#9CA3AF'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          
          <NotificationItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={notifications.push}
            onToggle={() => handleNotificationToggle('push')}
            showPermissionStatus={true}
          />
        </View>

        {/* Job Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Notifications</Text>
          
          <NotificationItem
            icon={Bell}
            title="Job Alerts"
            subtitle="Get notified about new job opportunities"
            value={notifications.jobAlerts}
            onToggle={() => handleNotificationToggle('jobAlerts')}
          />
          
          <NotificationItem
            icon={MapPin}
            title="Nearby Jobs"
            subtitle="Jobs posted in your area"
            value={notifications.nearbyJobs}
            onToggle={() => handleNotificationToggle('nearbyJobs')}
          />
          
          <NotificationItem
            icon={CheckCircle}
            title="Application Updates"
            subtitle="Status changes for your applications"
            value={notifications.applicationUpdates}
            onToggle={() => handleNotificationToggle('applicationUpdates')}
          />
        </View>

        {/* Communication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication</Text>
          
          <NotificationItem
            icon={MessageCircle}
            title="Messages"
            subtitle="New messages from employers or workers"
            value={notifications.messages}
            onToggle={() => handleNotificationToggle('messages')}
          />
          
          <NotificationItem
            icon={Users}
            title="Social Updates"
            subtitle="Updates from your network"
            value={notifications.socialUpdates}
            onToggle={() => handleNotificationToggle('socialUpdates')}
          />
        </View>

        {/* Financial */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial</Text>
          
          <NotificationItem
            icon={DollarSign}
            title="Payment Notifications"
            subtitle="Payment confirmations and updates"
            value={notifications.paymentNotifications}
            onToggle={() => handleNotificationToggle('paymentNotifications')}
          />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <NotificationItem
            icon={Shield}
            title="Security Alerts"
            subtitle="Important security notifications"
            value={notifications.securityAlerts}
            onToggle={() => handleNotificationToggle('securityAlerts')}
          />
        </View>

        {/* Marketing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketing</Text>
          
          <NotificationItem
            icon={Bell}
            title="Marketing Communications"
            subtitle="Promotional content and updates"
            value={notifications.marketing}
            onToggle={() => handleNotificationToggle('marketing')}
          />
          
          <NotificationItem
            icon={Clock}
            title="Weekly Digest"
            subtitle="Weekly summary of activities"
            value={notifications.weeklyDigest}
            onToggle={() => handleNotificationToggle('weeklyDigest')}
          />
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          
          <View style={styles.quietHoursContainer}>
            <View style={styles.quietHoursHeader}>
              <View style={styles.quietHoursText}>
                <Text style={styles.quietHoursTitle}>Do Not Disturb</Text>
                <Text style={styles.quietHoursSubtitle}>
                  {quietHours.enabled 
                    ? `Quiet hours: ${quietHours.startTime} - ${quietHours.endTime}`
                    : 'Receive notifications at any time'
                  }
                </Text>
              </View>
              <Switch
                value={quietHours.enabled}
                onValueChange={handleQuietHoursToggle}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={quietHours.enabled ? '#2563EB' : '#9CA3AF'}
              />
            </View>
            
            {quietHours.enabled && (
              <View style={styles.timeSettings}>
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => handleQuietHoursTimeChange('start')}
                >
                  <Text style={styles.timeLabel}>Start Time</Text>
                  <Text style={styles.timeValue}>{quietHours.startTime}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => handleQuietHoursTimeChange('end')}
                >
                  <Text style={styles.timeLabel}>End Time</Text>
                  <Text style={styles.timeValue}>{quietHours.endTime}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Test Notification */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={async () => {
              if (notificationPermission === 'granted') {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Test Notification",
                    body: "This is a test notification from Hyrizona",
                  },
                  trigger: null,
                });
                Alert.alert('Success', 'Test notification sent!');
              } else {
                Alert.alert('Permission Required', 'Please enable notifications first.');
              }
            }}
          >
            <Text style={styles.testButtonText}>Send Test Notification</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  notificationSubtitle: {
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
  quietHoursContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  quietHoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quietHoursText: {
    flex: 1,
  },
  quietHoursTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  quietHoursSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  timeSettings: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  timeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  testButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
}); 