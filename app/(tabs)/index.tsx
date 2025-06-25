import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users,
  Filter,
  Star,
  Plus
} from 'lucide-react-native';
import JobCard from '@/components/JobCard';
import LocationHeader from '@/components/LocationHeader';

const mockJobs = [
  {
    id: '1',
    title: 'Freelance Graphic Designer',
    company: 'Praveen Inc.',
    location: 'Downtown, 0.5 km',
    pay: '$25/hr',
    duration: '2-3 hours',
    skills: ['Design', 'Photoshop', 'Branding'],
    postedTime: '2 min ago',
    urgency: 'urgent',
    rating: 4.8,
    applicants: 3,
    verified: true
  },
  {
    id: '2',
    title: 'Event Setup Assistant',
    company: 'Anubhav Agency',
    location: 'City Center, 1.2 km',
    pay: '$18/hr',
    duration: '4-6 hours',
    skills: ['Physical Work', 'Team Work'],
    postedTime: '15 min ago',
    rating: 4.6,
    applicants: 8,
    verified: true
  },
  {
    id: '3',
    title: 'Content Writer',
    company: 'Shailaja Solutions',
    location: 'Remote/Nearby, 2.1 km',
    pay: '$20/hr',
    duration: '1-2 weeks',
    skills: ['Writing', 'SEO', 'Marketing'],
    postedTime: '1 hour ago',
    rating: 4.9,
    applicants: 12,
    verified: false
  }
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [nearbyJobs, setNearbyJobs] = useState(mockJobs);
  const [userLocation, setUserLocation] = useState('Ontario, CA');

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleJobPress = (jobId: string) => {
    console.log('Job pressed:', jobId);
    // Navigate to job details
  };

  return (
    <SafeAreaView style={styles.container}>
      <LocationHeader 
        location={userLocation}
        onLocationPress={() => console.log('Location pressed')}
        onNotificationPress={() => console.log('Notifications pressed')}
      />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#2563EB', '#3B82F6']}
                style={styles.statGradient}
              >
                <MapPin size={20} color="white" />
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Nearby Jobs</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#10B981', '#34D399']}
                style={styles.statGradient}
              >
                <Users size={20} color="white" />
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>Active Hirers</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Plus size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>Post Job</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Filter size={20} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Filter Jobs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Star size={20} color="#F59E0B" />
              </View>
              <Text style={styles.actionText}>Saved Jobs</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Jobs Section */}
        <View style={styles.jobsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Jobs Near You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.jobsList}>
            {nearbyJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => handleJobPress(job.id)}
                onSave={(jobId) => console.log('Save job:', jobId)}
                onApply={(jobId) => console.log('Apply to job:', jobId)}
              />
            ))}
          </View>
        </View>

        {/* Load More */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More Jobs</Text>
        </TouchableOpacity>
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
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  jobsSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  jobsList: {
    gap: 12,
  },
  loadMoreButton: {
    margin: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loadMoreText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
});