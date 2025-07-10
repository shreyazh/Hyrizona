import { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, User, Mail, MapPin, Save, Camera, Briefcase, Search, Plus, X, Check, Sparkles, Star, Award } from 'lucide-react-native';
import { useUser } from '../contexts/UserContext';
import { isValidName, isValidEmail } from '../utils/validation';

const { width, height } = Dimensions.get('window');

export default function EditProfileScreen() {
  console.log('=== EDIT PROFILE COMPONENT LOADED ===');
  const router = useRouter();
  const { user, updateUser } = useUser();
  console.log('User context loaded:', user);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    userType: 'seeker' as 'seeker' | 'poster',
    skills: [] as string[],
    profilePhoto: '',
    jobRole: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const photoScaleAnim = useRef(new Animated.Value(1)).current;
  const successScaleAnim = useRef(new Animated.Value(0)).current;
  const skillAnimations = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location || '',
        userType: user.userType,
        skills: user.skills || [],
        profilePhoto: user.profilePhoto || '',
        jobRole: user.jobRole || ''
      });
    }

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Initialize skill animations
    skillAnimations.length = 0;
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!isValidName(formData.firstName)) {
      newErrors.firstName = 'First name must be at least 2 characters and contain only letters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!isValidName(formData.lastName)) {
      newErrors.lastName = 'Last name must be at least 2 characters and contain only letters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.jobRole.trim()) {
      newErrors.jobRole = 'Job role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await updateUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        location: formData.location.trim() || undefined,
        userType: formData.userType,
        skills: formData.skills,
        profilePhoto: formData.profilePhoto,
        jobRole: formData.jobRole.trim()
      });

      // Success animation
      setShowSuccess(true);
      Animated.spring(successScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getInputStyle = (field: string) => [
    styles.input,
    activeField === field && styles.inputActive,
    errors[field] && styles.inputError
  ];

  const handleChangePhoto = async () => {
    Alert.alert('Tapped!', 'Photo icon tapped'); // Add this line
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile photo.');
        return;
      }

      setPhotoUploading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Photo upload animation
        Animated.sequence([
          Animated.timing(photoScaleAnim, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(photoScaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();

        updateFormData('profilePhoto', result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setPhotoUploading(false);
    }
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && skill.length >= 2) {
      if (formData.skills.includes(skill)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Duplicate Skill', 'This skill is already added.');
        return;
      }
      if (formData.skills.length >= 10) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Maximum Skills', 'You can only add up to 10 skills.');
        return;
      }
      
      const newSkillAnim = new Animated.Value(0);
      skillAnimations.push(newSkillAnim);
      
      updateFormData('skills', [...formData.skills, skill]);
      setNewSkill('');
      
      Animated.spring(newSkillAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const removeSkill = (skillToRemove: string, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const skillAnim = skillAnimations[index];
    if (skillAnim) {
      Animated.timing(skillAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        updateFormData('skills', formData.skills.filter(skill => skill !== skillToRemove));
        skillAnimations.splice(index, 1);
      });
    } else {
      updateFormData('skills', formData.skills.filter(skill => skill !== skillToRemove));
    }
  };

  const getUserInitials = () => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
  };

  const getUserAvatar = () => {
    if (formData.profilePhoto) {
      return (
        <Animated.Image
          source={{ uri: formData.profilePhoto }}
          style={[styles.avatarImage, { transform: [{ scale: photoScaleAnim }] }]}
        />
      );
    }
    return <Text style={styles.avatarText}>{getUserInitials()}</Text>;
  };

  const handleFieldFocus = (field: string) => {
    setActiveField(field);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleFieldBlur = () => {
    setActiveField(null);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>User data not available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
          }}
        >
          {/* Header */}
          <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.back();
                }}
              >
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>
              
              <Text style={styles.headerTitle}>Edit Profile</Text>
              
              <TouchableOpacity 
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <Animated.View style={styles.loadingSpinner}>
                    <Text style={styles.loadingText}>...</Text>
                  </Animated.View>
                ) : (
                  <Save size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Profile Photo Section */}
          <View style={styles.photoSection}>
            <View style={styles.avatarContainer}>
              <Animated.View style={[styles.avatar, { transform: [{ scale: photoScaleAnim }] }]}>
                {getUserAvatar()}
              </Animated.View>
              <TouchableOpacity 
                style={[styles.changePhotoButton, photoUploading && styles.changePhotoButtonDisabled]}
                onPress={handleChangePhoto}
                disabled={photoUploading}
              >
                {photoUploading ? (
                  <Animated.View style={styles.loadingSpinner}>
                    <Text style={styles.loadingText}>...</Text>
                  </Animated.View>
                ) : (
                  <Camera size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.changePhotoText}>
              {photoUploading ? 'Uploading...' : 'Tap to change photo'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.inputWrapper}>
                  <User size={20} color={activeField === 'firstName' ? '#2563EB' : '#6B7280'} style={styles.inputIcon} />
                  <TextInput
                    style={getInputStyle('firstName')}
                    placeholder="First name"
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                    onFocus={() => handleFieldFocus('firstName')}
                    onBlur={handleFieldBlur}
                    autoCapitalize="words"
                  />
                </View>
                {errors.firstName && (
                  <Animated.Text style={styles.errorText}>{errors.firstName}</Animated.Text>
                )}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.inputWrapper}>
                  <User size={20} color={activeField === 'lastName' ? '#2563EB' : '#6B7280'} style={styles.inputIcon} />
                  <TextInput
                    style={getInputStyle('lastName')}
                    placeholder="Last name"
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                    onFocus={() => handleFieldFocus('lastName')}
                    onBlur={handleFieldBlur}
                    autoCapitalize="words"
                  />
                </View>
                {errors.lastName && (
                  <Animated.Text style={styles.errorText}>{errors.lastName}</Animated.Text>
                )}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color={activeField === 'email' ? '#2563EB' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={getInputStyle('email')}
                  placeholder="Email address"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={handleFieldBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <Animated.Text style={styles.errorText}>{errors.email}</Animated.Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MapPin size={20} color={activeField === 'location' ? '#2563EB' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={getInputStyle('location')}
                  placeholder="Location (optional)"
                  value={formData.location}
                  onChangeText={(value) => updateFormData('location', value)}
                  onFocus={() => handleFieldFocus('location')}
                  onBlur={handleFieldBlur}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Job Role */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Briefcase size={20} color={activeField === 'jobRole' ? '#2563EB' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={getInputStyle('jobRole')}
                  placeholder="Job Role (e.g., React Native Developer)"
                  value={formData.jobRole}
                  onChangeText={(value) => updateFormData('jobRole', value)}
                  onFocus={() => handleFieldFocus('jobRole')}
                  onBlur={handleFieldBlur}
                  autoCapitalize="words"
                />
              </View>
              {errors.jobRole && (
                <Animated.Text style={styles.errorText}>{errors.jobRole}</Animated.Text>
              )}
            </View>

            {/* User Type Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.sectionLabel}>Account Type</Text>
              <View style={styles.userTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    formData.userType === 'seeker' && styles.activeUserTypeButton
                  ]}
                  onPress={() => {
                    updateFormData('userType', 'seeker');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                >
                  <Search size={20} color={formData.userType === 'seeker' ? '#2563EB' : '#6B7280'} />
                  <Text style={[
                    styles.userTypeText,
                    formData.userType === 'seeker' && styles.activeUserTypeText
                  ]}>
                    Job Seeker
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    formData.userType === 'poster' && styles.activeUserTypeButton
                  ]}
                  onPress={() => {
                    updateFormData('userType', 'poster');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                >
                  <Briefcase size={20} color={formData.userType === 'poster' ? '#2563EB' : '#6B7280'} />
                  <Text style={[
                    styles.userTypeText,
                    formData.userType === 'poster' && styles.activeUserTypeText
                  ]}>
                    Job Poster
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Skills Section */}
            <View style={styles.inputContainer}>
              <View style={styles.skillsHeader}>
                <Text style={styles.sectionLabel}>Skills</Text>
                <View style={styles.skillsBadge}>
                  <Sparkles size={16} color="#2563EB" />
                  <Text style={styles.skillsBadgeText}>{formData.skills.length}/10</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>
                Add your professional skills to showcase your expertise
              </Text>
              
              {/* Add Skill Input */}
              <View style={styles.addSkillContainer}>
                <View style={styles.skillInputWrapper}>
                  <TextInput
                    style={styles.skillInput}
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChangeText={setNewSkill}
                    onSubmitEditing={addSkill}
                    returnKeyType="done"
                    autoCapitalize="words"
                  />
                  <TouchableOpacity 
                    style={[styles.addSkillButton, !newSkill.trim() && styles.addSkillButtonDisabled]}
                    onPress={addSkill}
                    disabled={!newSkill.trim()}
                  >
                    <Plus size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Skills List */}
              {formData.skills.length > 0 && (
                <View style={styles.skillsContainer}>
                  {formData.skills.map((skill, index) => (
                    <Animated.View 
                      key={index} 
                      style={[
                        styles.skillTag,
                        { 
                          transform: [{ 
                            scale: skillAnimations[index] || new Animated.Value(1) 
                          }] 
                        }
                      ]}
                    >
                      <Star size={16} color="#2563EB" style={styles.skillIcon} />
                      <Text style={styles.skillText}>{skill}</Text>
                      <TouchableOpacity 
                        style={styles.removeSkillButton}
                        onPress={() => removeSkill(skill, index)}
                      >
                        <X size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              style={styles.saveProfileButton}
              onPress={handleSave}
              disabled={loading}
            >
              <LinearGradient
                colors={['#2563EB', '#3B82F6']}
                style={styles.saveProfileButtonGradient}
              >
                <Text style={styles.saveProfileButtonText}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      {/* Success Overlay */}
      {showSuccess && (
        <Animated.View style={styles.successOverlay}>
          <Animated.View 
            style={[
              styles.successCard,
              { transform: [{ scale: successScaleAnim }] }
            ]}
          >
            <Award size={48} color="#10B981" />
            <Text style={styles.successTitle}>Profile Updated!</Text>
            <Text style={styles.successMessage}>Your changes have been saved successfully.</Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loadingSpinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  inputActive: {
    borderColor: '#2563EB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  saveProfileButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  saveProfileButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveProfileButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  photoSection: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeUserTypeButton: {
    borderColor: '#2563EB',
  },
  userTypeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  activeUserTypeText: {
    color: '#2563EB',
  },
  addSkillContainer: {
    marginBottom: 20,
  },
  skillInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  skillInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  addSkillButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSkillButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  skillsContainer: {
    marginBottom: 20,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  skillIcon: {
    marginRight: 8,
  },
  skillText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  removeSkillButton: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skillsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
  },
  skillsBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
}); 