// Updated register.tsx with Auth0 Signup Integration
import { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import auth0 from '../../utils/auth0';

export default function Auth0SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profilePhoto: '',
    idProof: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const pickImage = async (field: 'profilePhoto' | 'idProof') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormData(field, result.assets[0].uri);
    }
  };

  const handleAuth0SignUp = async () => {
    setErrors({});
    setLoading(true);
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: 'https://magic4ai.auth0.com/userinfo',
      });

      if (credentials?.accessToken) {
        Alert.alert('Success', 'Signed up with Auth0!');
        router.replace('/edit-profile');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#2563EB" />
            </TouchableOpacity>
            <Text style={styles.title}>Sign Up with Auth0</Text>
            <Text style={styles.subtitle}>Secure sign up powered by Auth0</Text>
          </View>

          <View style={styles.form}>
            <TouchableOpacity style={styles.registerButton} onPress={handleAuth0SignUp} disabled={loading}>
              <LinearGradient colors={['#2563EB', '#3B82F6']} style={styles.registerButtonGradient}>
                <Text style={styles.registerButtonText}>{loading ? 'Signing Up...' : 'Sign Up with Auth0'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { paddingHorizontal: 24 },
  registerButton: { marginTop: 32 },
  registerButtonGradient: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  registerButtonText: { fontSize: 18, fontWeight: '600', color: 'white' }
});
