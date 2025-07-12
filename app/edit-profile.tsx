import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  Alert, KeyboardAvoidingView, Platform, Animated, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useUser } from '../contexts/UserContext';
import auth0 from '../utils/auth0';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    userType: 'seeker',
    jobRole: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const loadAuth0UserInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          const info = await auth0.auth.userInfo({ token });
          if (info?.email) {
            setFormData(prev => ({ ...prev, email: info.email ?? '' }));
          }
        }
      } catch (e) {
        console.warn('Failed to get user info:', e);
      }
    };

    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        location: user.location || '',
        userType: user.userType || 'seeker',
        jobRole: user.jobRole || ''
      });
    } else {
      loadAuth0UserInfo();
    }

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [user]);

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.jobRole) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      await updateUser({ ...formData, userType: formData.userType as "seeker" | "poster" | undefined });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile saved successfully');
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <Animated.ScrollView
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }}
          contentContainerStyle={styles.formContainer}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#2563EB" />
            </TouchableOpacity>
            <Text style={styles.title}>Create / Edit Profile</Text>
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={text => updateFormData('firstName', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={text => updateFormData('lastName', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={text => updateFormData('email', text)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Job Role"
              value={formData.jobRole}
              onChangeText={text => updateFormData('jobRole', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Location"
              value={formData.location}
              onChangeText={text => updateFormData('location', text)}
              style={styles.input}
            />

            <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={loading}>
              <LinearGradient colors={["#2563EB", "#3B82F6"]} style={styles.saveGradient}>
                <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save Profile'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  keyboardView: { flex: 1 },
  formContainer: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  inputGroup: { gap: 16 },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#111827'
  },
  saveButton: { marginTop: 20 },
  saveGradient: { padding: 16, borderRadius: 12, alignItems: 'center' },
  saveText: { color: 'white', fontSize: 18, fontWeight: '600' }
});
