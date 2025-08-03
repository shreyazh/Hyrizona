import { useState } from 'react';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Search, Briefcase, ArrowRight } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring
} from 'react-native-reanimated';

type UserType = 'seeker' | 'poster' | null;

const setItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export default function UserTypeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const scaleSeeker = useSharedValue(1);
  const scalePoster = useSharedValue(1);

  const handleTypeSelect = (type: UserType) => {
    setSelectedType(type);
    
    if (type === 'seeker') {
      scaleSeeker.value = withSpring(1.05);
      scalePoster.value = withSpring(1);
    } else if (type === 'poster') {
      scalePoster.value = withSpring(1.05);
      scaleSeeker.value = withSpring(1);
    }
  };

  const handleContinue = () => {
    if (!selectedType) {
      Alert.alert('Selection Required', 'Please select how you plan to use Hyrizona');
      return;
    }
    setItem('hasCompletedOnboarding', 'true');

    // Store user type preference
    console.log('Selected user type:', selectedType);
    router.push('/');
  };

  const seekerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleSeeker.value }]
  }));

  const posterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scalePoster.value }]
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How do you plan to use Hyrizona?</Text>
        <Text style={styles.subtitle}>
          Choose your primary role to personalize your experience
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <Animated.View style={seekerAnimatedStyle}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedType === 'seeker' && styles.selectedCard
            ]}
            onPress={() => handleTypeSelect('seeker')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedType === 'seeker' 
                ? ['#2563EB', '#3B82F6'] 
                : ['#F8FAFC', '#F1F5F9']
              }
              style={styles.iconCircle}
            >
              <Search 
                size={32} 
                color={selectedType === 'seeker' ? 'white' : '#2563EB'} 
                strokeWidth={1.5}
              />
            </LinearGradient>
            
            <Text style={[
              styles.optionTitle,
              selectedType === 'seeker' && styles.selectedText
            ]}>
              I'm looking for work
            </Text>
            
            <Text style={[
              styles.optionDescription,
              selectedType === 'seeker' && styles.selectedDescription
            ]}>
              Find freelance jobs, gigs, and temporary work opportunities near you
            </Text>

            {selectedType === 'seeker' && (
              <View style={styles.checkmark}>
                <View style={styles.checkmarkInner} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={posterAnimatedStyle}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedType === 'poster' && styles.selectedCard
            ]}
            onPress={() => handleTypeSelect('poster')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedType === 'poster' 
                ? ['#10B981', '#34D399'] 
                : ['#F8FAFC', '#F1F5F9']
              }
              style={styles.iconCircle}
            >
              <Briefcase 
                size={32} 
                color={selectedType === 'poster' ? 'white' : '#10B981'} 
                strokeWidth={1.5}
              />
            </LinearGradient>
            
            <Text style={[
              styles.optionTitle,
              selectedType === 'poster' && styles.selectedText
            ]}>
              I want to hire talent
            </Text>
            
            <Text style={[
              styles.optionDescription,
              selectedType === 'poster' && styles.selectedDescription
            ]}>
              Post jobs and find skilled workers for your projects and business needs
            </Text>

            {selectedType === 'poster' && (
              <View style={styles.checkmark}>
                <View style={styles.checkmarkInner} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedType && styles.disabledButton
          ]} 
          onPress={handleContinue}
          disabled={!selectedType}
        >
          <LinearGradient
            colors={selectedType 
              ? ['#2563EB', '#3B82F6'] 
              : ['#E5E7EB', '#D1D5DB']
            }
            style={styles.continueButtonGradient}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedType && styles.disabledButtonText
            ]}>
              Continue
            </Text>
            <ArrowRight 
              size={20} 
              color={selectedType ? 'white' : '#9CA3AF'} 
            />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don't worry, you can switch between modes anytime in your profile
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.15,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  selectedText: {
    color: '#2563EB',
  },
  optionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  selectedDescription: {
    color: '#4B5563',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  continueButton: {
    width: '100%',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginRight: 8,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});