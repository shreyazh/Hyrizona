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
  TrendingUp
} from 'lucide-react-native';

export default function ProfileScreen() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentMode, setCurrentMode] = useState<'seeker' | 'poster'>('seeker');

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
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleModeSwitch = () => {
    const newMode = currentMode === 'seeker' ? 'poster' : 'seeker';
    setCurrentMode(newMode);
  };

  const renderSeekerProfile = () => (
    <>
      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {['UI/UX Design', 'React Native', 'Figma', 'Photoshop', 'Branding', 'Typography'].map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
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
              <Text style={styles.avatarText}>SS</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Shreyash Srivastva</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.location}>Lucknow, India</Text>
              </View>
              <View style={styles.verificationRow}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.verifiedText}>Verified Account</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={20} color="#2563EB" />
          </TouchableOpacity>
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
        {currentMode === 'seeker' && (
          <View style={styles.availabilitySection}>
            <View style={styles.availabilityRow}>
              <View>
                <Text style={styles.availabilityTitle}>Available for Work</Text>
                <Text style={styles.availabilitySubtitle}>
                  Let employers know you're ready for new opportunities
                </Text>
              </View>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={isAvailable ? '#2563EB' : '#9CA3AF'}
              />
            </View>
          </View>
        )}

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>
            {currentMode === 'seeker' 
              ? "Experienced designer with 5+ years in UI/UX design and mobile app development. Passionate about creating user-friendly interfaces and solving complex design challenges."
              : "We are always looking for talented individuals to join our projects. We believe in fair compensation and creating great working relationships with freelancers."
            }
          </Text>
        </View>

        {/* Dynamic Content Based on Mode */}
        {currentMode === 'seeker' ? renderSeekerProfile() : renderPosterProfile()}

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievement}>
              <Award size={20} color="#F59E0B" />
              <Text style={styles.achievementText}>Top Rated {currentMode === 'seeker' ? 'Freelancer' : 'Employer'}</Text>
            </View>
            <View style={styles.achievement}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.achievementText}>100% Job Success Score</Text>
            </View>
            <View style={styles.achievement}>
              <Calendar size={20} color="#2563EB" />
              <Text style={styles.achievementText}>Member since 2023</Text>
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
});