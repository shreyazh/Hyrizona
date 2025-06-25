import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Key,
  Trash2,
  Download,
  Users,
  MapPin,
  Bell,
  CheckCircle,
  XCircle
} from 'lucide-react-native';

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricLogin: false,
    sessionTimeout: 30, // minutes
    loginNotifications: true,
    suspiciousActivityAlerts: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, friends, private
    showLocation: true,
    showOnlineStatus: true,
    allowMessages: true,
    allowJobInvites: true
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      const savedSecurity = await AsyncStorage.getItem('securitySettings');
      const savedPrivacy = await AsyncStorage.getItem('privacySettings');
      
      if (savedSecurity) {
        setSecuritySettings(JSON.parse(savedSecurity));
      }
      if (savedPrivacy) {
        setPrivacySettings(JSON.parse(savedPrivacy));
      }
    } catch (error) {
      console.log('Error loading security settings:', error);
    }
  };

  const saveSecuritySettings = async (data: any) => {
    try {
      await AsyncStorage.setItem('securitySettings', JSON.stringify(data));
    } catch (error) {
      console.log('Error saving security settings:', error);
    }
  };

  const savePrivacySettings = async (data: any) => {
    try {
      await AsyncStorage.setItem('privacySettings', JSON.stringify(data));
    } catch (error) {
      console.log('Error saving privacy settings:', error);
    }
  };

  const handleSecurityToggle = async (key: keyof typeof securitySettings) => {
    const newSettings = { ...securitySettings, [key]: !securitySettings[key] };
    setSecuritySettings(newSettings);
    await saveSecuritySettings(newSettings);

    if (key === 'twoFactorAuth' && newSettings.twoFactorAuth) {
      Alert.alert(
        'Two-Factor Authentication',
        'Two-factor authentication will be set up in the next update.',
        [{ text: 'OK', style: 'default' }]
      );
    }

    if (key === 'biometricLogin' && newSettings.biometricLogin) {
      Alert.alert(
        'Biometric Login',
        'Biometric authentication will be configured in the next update.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handlePrivacyToggle = async (key: keyof typeof privacySettings) => {
    const newSettings = { ...privacySettings, [key]: !privacySettings[key] };
    setPrivacySettings(newSettings);
    await savePrivacySettings(newSettings);
  };

  const handleProfileVisibilityChange = async () => {
    Alert.alert(
      'Profile Visibility',
      'Choose who can see your profile',
      [
        { 
          text: 'Public', 
          onPress: async () => {
            const newSettings = { ...privacySettings, profileVisibility: 'public' };
            setPrivacySettings(newSettings);
            await savePrivacySettings(newSettings);
          }
        },
        { 
          text: 'Friends Only', 
          onPress: async () => {
            const newSettings = { ...privacySettings, profileVisibility: 'friends' };
            setPrivacySettings(newSettings);
            await savePrivacySettings(newSettings);
          }
        },
        { 
          text: 'Private', 
          onPress: async () => {
            const newSettings = { ...privacySettings, profileVisibility: 'private' };
            setPrivacySettings(newSettings);
            await savePrivacySettings(newSettings);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSessionTimeoutChange = async () => {
    Alert.alert(
      'Session Timeout',
      'Choose session timeout duration',
      [
        { 
          text: '15 minutes', 
          onPress: async () => {
            const newSettings = { ...securitySettings, sessionTimeout: 15 };
            setSecuritySettings(newSettings);
            await saveSecuritySettings(newSettings);
          }
        },
        { 
          text: '30 minutes', 
          onPress: async () => {
            const newSettings = { ...securitySettings, sessionTimeout: 30 };
            setSecuritySettings(newSettings);
            await saveSecuritySettings(newSettings);
          }
        },
        { 
          text: '1 hour', 
          onPress: async () => {
            const newSettings = { ...securitySettings, sessionTimeout: 60 };
            setSecuritySettings(newSettings);
            await saveSecuritySettings(newSettings);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    // Simulate password change
    Alert.alert(
      'Success', 
      'Password changed successfully!',
      [{ text: 'OK', onPress: () => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }}]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Data Export',
      'Your data export will be prepared and sent to your email within 24 hours.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete Data',
      'This will permanently delete all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Deleted', 'All your data has been permanently deleted.');
          }
        }
      ]
    );
  };

  const SecurityItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    value,
    onToggle,
    onPress,
    showChevron = false
  }: {
    icon: any;
    title: string;
    subtitle: string;
    value?: boolean;
    onToggle?: () => void;
    onPress?: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.securityItem}
      onPress={onPress}
      disabled={!onPress && !onToggle}
    >
      <View style={styles.securityLeft}>
        <View style={styles.securityIcon}>
          <Icon size={20} color="#2563EB" />
        </View>
        <View style={styles.securityText}>
          <Text style={styles.securityTitle}>{title}</Text>
          <Text style={styles.securitySubtitle}>{subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.securityRight}>
        {onToggle && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
            thumbColor={value ? '#2563EB' : '#9CA3AF'}
          />
        )}
        {showChevron && onPress && (
          <ArrowLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
        )}
      </View>
    </TouchableOpacity>
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
        <Text style={styles.title}>Privacy & Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <SecurityItem
            icon={Key}
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security to your account"
            value={securitySettings.twoFactorAuth}
            onToggle={() => handleSecurityToggle('twoFactorAuth')}
          />
          
          <SecurityItem
            icon={Smartphone}
            title="Biometric Login"
            subtitle="Use fingerprint or face ID to log in"
            value={securitySettings.biometricLogin}
            onToggle={() => handleSecurityToggle('biometricLogin')}
          />
          
          <SecurityItem
            icon={Lock}
            title="Session Timeout"
            subtitle={`${securitySettings.sessionTimeout} minutes of inactivity`}
            onPress={handleSessionTimeoutChange}
            showChevron={true}
          />
          
          <SecurityItem
            icon={Bell}
            title="Login Notifications"
            subtitle="Get notified of new login attempts"
            value={securitySettings.loginNotifications}
            onToggle={() => handleSecurityToggle('loginNotifications')}
          />
          
          <SecurityItem
            icon={Shield}
            title="Suspicious Activity Alerts"
            subtitle="Get alerts for unusual account activity"
            value={securitySettings.suspiciousActivityAlerts}
            onToggle={() => handleSecurityToggle('suspiciousActivityAlerts')}
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <SecurityItem
            icon={Users}
            title="Profile Visibility"
            subtitle={`${privacySettings.profileVisibility.charAt(0).toUpperCase() + privacySettings.profileVisibility.slice(1)}`}
            onPress={handleProfileVisibilityChange}
            showChevron={true}
          />
          
          <SecurityItem
            icon={MapPin}
            title="Show Location"
            subtitle="Allow others to see your location"
            value={privacySettings.showLocation}
            onToggle={() => handlePrivacyToggle('showLocation')}
          />
          
          <SecurityItem
            icon={Bell}
            title="Show Online Status"
            subtitle="Let others know when you're online"
            value={privacySettings.showOnlineStatus}
            onToggle={() => handlePrivacyToggle('showOnlineStatus')}
          />
          
          <SecurityItem
            icon={Mail}
            title="Allow Messages"
            subtitle="Receive messages from other users"
            value={privacySettings.allowMessages}
            onToggle={() => handlePrivacyToggle('allowMessages')}
          />
          
          <SecurityItem
            icon={Shield}
            title="Allow Job Invites"
            subtitle="Receive job invitations from employers"
            value={privacySettings.allowJobInvites}
            onToggle={() => handlePrivacyToggle('allowJobInvites')}
          />
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          
          <View style={styles.passwordContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirmPassword}
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
              <Text style={styles.changePasswordText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SecurityItem
            icon={Download}
            title="Export Data"
            subtitle="Download a copy of your data"
            onPress={handleDataExport}
            showChevron={true}
          />
          
          <SecurityItem
            icon={Trash2}
            title="Delete Data"
            subtitle="Permanently delete your data"
            onPress={handleDeleteData}
            showChevron={true}
          />
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
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  securityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  securityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passwordContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  changePasswordButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  changePasswordText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
}); 