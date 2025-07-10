import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Edit, 
  MapPin, 
  Star, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Award,
  Briefcase,
  Users,
  TrendingUp,
  LogOut
} from 'lucide-react-native';
import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useUser();
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentMode, setCurrentMode] = useState<'seeker' | 'poster'>(user?.userType || 'seeker');

  // Update currentMode when user changes
  useEffect(() => {
    if (user?.userType) {
      setCurrentMode(user.userType);
    }
  }, [user?.userType]);

  // Redirect to login if not logged in and not loading
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [isLoading, user, router]);

  const stats = {
    seeker: {
      jobsCompleted: 24,
      totalEarnings: 3240,
      averageRating: 4.8,
      responseRate: 95
    },
    poster: {
      jobsPosted: 12,
      totalSpent: 1580,
      hiredWorkers: 18,
      averageRating: 4.6
    }
  };

  const handleEditProfile = () => {
    try {
      console.log('=== EDIT PROFILE DEBUG ===');
      console.log('User:', user);
      console.log('Router:', router);
      console.log('Attempting navigation to /edit-profile...');
      router.push('/edit-profile');
      console.log('Navigation command sent successfully');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to open edit profile. Please try again.');
    }
  };

  const handleModeSwitch = () => {
    const newMode = currentMode === 'seeker' ? 'poster' : 'seeker';
    setCurrentMode(newMode);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          }
        }
      ]
    );
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const getUserFullName = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`;
  };

  const getUserAvatar = () => {
    if (user?.profilePhoto) {
      return (
        <Image
          source={{ uri: user.profilePhoto }}
          style={styles.avatarImage}
        />
      );
    }
    return <Text style={styles.avatarText}>{getUserInitials()}</Text>;
  };

  const renderSeekerProfile = () => (
    <>
      {/* Job Role */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Role</Text>
        <Text style={styles.jobRoleText}>
          {user?.jobRole || 'No job role specified'}
        </Text>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {user?.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
            ))
          ) : (
            <Text style={styles.noSkillsText}>No skills added yet</Text>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Briefcase size={20} color="#2563EB" />
            <Text style={styles.statNumber}>{stats.seeker.jobsCompleted}</Text>
            <Text style={styles.statLabel}>Jobs Completed</Text>
          </View>
          <View style={styles.statCard}>
            <DollarSign size={20} color="#10B981" />
            <Text style={styles.statNumber}>${stats.seeker.totalEarnings}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>{stats.seeker.averageRating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#8B5CF6" />
            <Text style={styles.statNumber}>{stats.seeker.responseRate}%</Text>
            <Text style={styles.statLabel}>Response Rate</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderPosterProfile = () => (
    <>
      {/* Job Role */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Role</Text>
        <Text style={styles.jobRoleText}>
          {user?.jobRole || 'No job role specified'}
        </Text>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {user?.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
            ))
          ) : (
            <Text style={styles.noSkillsText}>No skills added yet</Text>
          )}
        </View>
      </View>

      {/* Company Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Details</Text>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>TechStartup Inc.</Text>
          <Text style={styles.companyDescription}>
            A growing technology startup focused on innovative mobile solutions.
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hiring Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Briefcase size={20} color="#2563EB" />
            <Text style={styles.statNumber}>{stats.poster.jobsPosted}</Text>
            <Text style={styles.statLabel}>Jobs Posted</Text>
          </View>
          <View style={styles.statCard}>
            <DollarSign size={20} color="#10B981" />
            <Text style={styles.statNumber}>${stats.poster.totalSpent}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>{stats.poster.hiredWorkers}</Text>
            <Text style={styles.statLabel}>Workers Hired</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={20} color="#8B5CF6" />
            <Text style={styles.statNumber}>{stats.poster.averageRating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>
    </>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#2563EB" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#2563EB', '#3B82F6']}
          style={styles.header}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              {getUserAvatar()}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{getUserFullName()}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.location}>{user?.location || 'Location not set'}</Text>
              </View>
              <View style={styles.verificationRow}>
                {user?.isVerified ? (
                  <>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.verifiedText}>Verified Account</Text>
                  </>
                ) : (
                  <>
                    <Award size={16} color="#F59E0B" />
                    <Text style={styles.verifiedText}>Unverified Account</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.headerActions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={20} color="#2563EB" />
          </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Mode Switch */}
        <View style={styles.modeSwitch}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              currentMode === 'seeker' && styles.activeModeButton
            ]}
            onPress={() => setCurrentMode('seeker')}
          >
            <Text style={[
              styles.modeButtonText,
              currentMode === 'seeker' && styles.activeModeButtonText
            ]}>
              Job Seeker
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modeButton,
              currentMode === 'poster' && styles.activeModeButton
            ]}
            onPress={() => setCurrentMode('poster')}
          >
            <Text style={[
              styles.modeButtonText,
              currentMode === 'poster' && styles.activeModeButtonText
            ]}>
              Job Poster
            </Text>
          </TouchableOpacity>
        </View>

        {/* Availability Toggle */}
        <View style={styles.section}>
            <View style={styles.availabilityRow}>
              <View>
                <Text style={styles.availabilityTitle}>Available for Work</Text>
                <Text style={styles.availabilitySubtitle}>
                {isAvailable ? 'You are currently available' : 'You are currently unavailable'}
                </Text>
              </View>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              thumbColor={isAvailable ? '#FFFFFF' : '#FFFFFF'}
              />
          </View>
        </View>

        {/* Profile Content */}
        {currentMode === 'seeker' ? renderSeekerProfile() : renderPosterProfile()}

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.accountInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{user?.address || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Proof</Text>
              <Text style={styles.infoValue}>{user?.idProof || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Type</Text>
              <Text style={styles.infoValue}>
                {user?.userType === 'seeker' ? 'Job Seeker' : 'Job Poster'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Profile Picture</Text>
              <Text style={styles.infoValue}>{user?.profilePhoto ? 'Set' : 'Not available'}</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginLeft: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeSwitch: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeModeButton: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeModeButtonText: {
    color: '#2563EB',
  },
  availabilitySection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  availabilitySubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  skillText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  noSkillsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  companyInfo: {
    gap: 8,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  companyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  achievementsList: {
    gap: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  jobRoleText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
});