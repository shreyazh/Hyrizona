import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LogIn, UserPlus } from 'lucide-react-native';

export default function AuthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#3B82F6']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Hyrizona</Text>
          <Text style={styles.tagline}>Your gateway to opportunities</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/auth/login')}
          >
            <View style={styles.buttonContent}>
              <LogIn size={24} color="#2563EB" strokeWidth={2} />
              <Text style={styles.buttonText}>Sign In</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => router.push('/auth/register')}
          >
            <View style={styles.buttonContent}>
              <UserPlus size={24} color="white" strokeWidth={2} />
              <Text style={styles.outlineButtonText}>Create Account</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    paddingBottom: 48,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 32,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 8,
  },
  outlineButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
});