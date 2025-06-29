import { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  Bell, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users,
  Filter,
  Star,
  Plus,
  Search,
  X,
  TrendingUp,
  Briefcase,
  Zap
} from 'lucide-react-native';
import JobCard from '@/components/JobCard';
import LocationHeader from '@/components/LocationHeader';
import AdvancedFilters, { FilterOptions } from '@/components/AdvancedFilters';
import { useUser } from '@/contexts/UserContext';
import { useToastContext } from '@/contexts/ToastContext';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  duration: string;
  skills: string[];
  postedTime: string;
  urgency?: 'urgent' | 'normal';
  rating: number;
  applicants: number;
  verified: boolean;
  category: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
}

export const mockJobs: Job[] = [
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
    verified: true,
    category: 'Design',
    description: 'Looking for a creative graphic designer to help with brand identity and marketing materials.',
    requirements: ['2+ years experience', 'Portfolio required', 'Adobe Creative Suite'],
    benefits: ['Flexible hours', 'Remote work option', 'Competitive pay']
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
    urgency: 'normal',
    rating: 4.6,
    applicants: 8,
    verified: true,
    category: 'Events',
    description: 'Help set up and manage events including equipment setup and customer service.',
    requirements: ['Physical stamina', 'Team player', 'Weekend availability'],
    benefits: ['Free meals', 'Event networking', 'Performance bonuses']
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
    urgency: 'normal',
    rating: 4.9,
    applicants: 12,
    verified: false,
    category: 'Writing',
    description: 'Create engaging content for blogs, social media, and marketing campaigns.',
    requirements: ['Excellent writing skills', 'SEO knowledge', 'Portfolio'],
    benefits: ['Remote work', 'Flexible deadlines', 'Creative freedom']
  },
  {
    id: '4',
    title: 'Web Developer',
    company: 'Tech Solutions Pro',
    location: 'Tech District, 3.5 km',
    pay: '$35/hr',
    duration: '2-4 weeks',
    skills: ['React', 'Node.js', 'TypeScript'],
    postedTime: '3 hours ago',
    urgency: 'urgent',
    rating: 4.7,
    applicants: 5,
    verified: true,
    category: 'Technology',
    description: 'Build modern web applications using React and Node.js.',
    requirements: ['2+ years React experience', 'Git knowledge', 'API development'],
    benefits: ['Remote work', 'Latest tech stack', 'Career growth']
  },
  {
    id: '5',
    title: 'Social Media Manager',
    company: 'Digital Marketing Co.',
    location: 'Business District, 1.8 km',
    pay: '$22/hr',
    duration: 'Ongoing',
    skills: ['Social Media', 'Content Creation', 'Analytics'],
    postedTime: '5 hours ago',
    urgency: 'normal',
    rating: 4.5,
    applicants: 15,
    verified: true,
    category: 'Marketing',
    description: 'Manage social media presence and create engaging content.',
    requirements: ['Social media experience', 'Creative mindset', 'Analytics skills'],
    benefits: ['Flexible schedule', 'Creative control', 'Performance bonuses']
  }
];

const categories = [
  { id: 'all', name: 'All', icon: Briefcase },
  { id: 'technology', name: 'Technology', icon: Zap },
  { id: 'design', name: 'Design', icon: Star },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'writing', name: 'Writing', icon: Briefcase },
  { id: 'events', name: 'Events', icon: Users }
];

const defaultFilters: FilterOptions = {
  salaryRange: { min: 0, max: 1000 },
  distance: 50,
  jobType: [],
  experienceLevel: [],
  verifiedOnly: false,
  urgentOnly: false,
  remoteOnly: false,
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { showSuccess, showError, showInfo } = useToastContext();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState('Ontario, CA');
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>(defaultFilters);
  const [stats, setStats] = useState({
    nearbyJobs: 24,
    activeHirers: 156,
    totalEarnings: 0
  });

  // Filter jobs based on search, category, and advanced filters
  const filterJobs = useCallback(() => {
    let filtered = mockJobs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(job => 
        job.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Apply advanced filters
    if (currentFilters.verifiedOnly) {
      filtered = filtered.filter(job => job.verified);
    }

    if (currentFilters.urgentOnly) {
      filtered = filtered.filter(job => job.urgency === 'urgent');
    }

    if (currentFilters.remoteOnly) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes('remote') ||
        job.location.toLowerCase().includes('anywhere')
      );
    }

    // Filter by salary range
    filtered = filtered.filter(job => {
      const payValue = parseInt(job.pay.replace(/[^0-9]/g, ''));
      return payValue >= currentFilters.salaryRange.min && 
             payValue <= currentFilters.salaryRange.max;
    });

    setFilteredJobs(filtered);
  }, [searchQuery, selectedCategory, currentFilters]);

  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Update stats
      setStats(prev => ({
        ...prev,
        nearbyJobs: Math.floor(Math.random() * 50) + 20,
        activeHirers: Math.floor(Math.random() * 200) + 100
      }));
      showSuccess('Refreshed!', 'Job listings updated successfully');
    } catch (error) {
      showError('Refresh Failed', 'Failed to refresh job listings');
    } finally {
      setRefreshing(false);
    }
  };

  const handleJobPress = (jobId: string) => {
    router.push(`/job-details?jobId=${jobId}`);
  };

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      if (prev.includes(jobId)) {
        const newSaved = prev.filter(id => id !== jobId);
        showInfo('Removed from saved', 'Job removed from your saved list');
        return newSaved;
      } else {
        const newSaved = [...prev, jobId];
        showSuccess('Saved!', 'Job added to your saved list');
        return newSaved;
      }
    });
  };

  const handleApplyJob = async (jobId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Application Submitted!', 'Your application has been sent successfully');
    } catch (error) {
      showError('Application Failed', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    showInfo(`Filtered by ${categoryName}`, `Showing ${categoryName} jobs`);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'post':
        showInfo('Coming Soon', 'Job posting feature will be available soon');
        break;
      case 'filter':
        setShowFilters(true);
        break;
      case 'saved':
        showInfo('Saved Jobs', 'Navigate to saved jobs section');
        break;
    }
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    const activeFilters = [];
    if (filters.verifiedOnly) activeFilters.push('Verified only');
    if (filters.urgentOnly) activeFilters.push('Urgent only');
    if (filters.remoteOnly) activeFilters.push('Remote only');
    if (filters.salaryRange.min > 0 || filters.salaryRange.max < 1000) {
      activeFilters.push(`$${filters.salaryRange.min}-${filters.salaryRange.max}/hr`);
    }
    
    if (activeFilters.length > 0) {
      showSuccess('Filters Applied', `Applied ${activeFilters.length} filter(s)`);
    }
  };

  const handleClearFilters = () => {
    setCurrentFilters(defaultFilters);
    showInfo('Filters Cleared', 'All filters have been reset');
  };

  const renderCategoryItem = (category: typeof categories[0]) => {
    const Icon = category.icon;
    const isSelected = selectedCategory === category.id;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
        onPress={() => handleCategoryPress(category.id)}
      >
        <Icon size={16} color={isSelected ? '#2563EB' : '#6B7280'} />
        <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const hasActiveFilters = () => {
    return currentFilters.verifiedOnly || 
           currentFilters.urgentOnly || 
           currentFilters.remoteOnly ||
           currentFilters.salaryRange.min > 0 ||
           currentFilters.salaryRange.max < 1000;
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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map(renderCategoryItem)}
          </ScrollView>
        </View>

        {/* Active Filters Indicator */}
        {hasActiveFilters() && (
          <View style={styles.activeFiltersContainer}>
            <View style={styles.activeFiltersContent}>
              <Filter size={16} color="#2563EB" />
              <Text style={styles.activeFiltersText}>Filters applied</Text>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearFiltersText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#2563EB', '#3B82F6']}
                style={styles.statGradient}
              >
                <MapPin size={20} color="white" />
                <Text style={styles.statNumber}>{stats.nearbyJobs}</Text>
                <Text style={styles.statLabel}>Nearby Jobs</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#10B981', '#34D399']}
                style={styles.statGradient}
              >
                <Users size={20} color="white" />
                <Text style={styles.statNumber}>{stats.activeHirers}</Text>
                <Text style={styles.statLabel}>Active Hirers</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('post')}
            >
              <View style={styles.actionIcon}>
                <Plus size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>Post Job</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('filter')}
            >
              <View style={[styles.actionIcon, hasActiveFilters() && styles.actionIconActive]}>
                <Filter size={20} color={hasActiveFilters() ? "#2563EB" : "#10B981"} />
              </View>
              <Text style={styles.actionText}>Filter Jobs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('saved')}
            >
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
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'Jobs Near You' : `${categories.find(c => c.id === selectedCategory)?.name} Jobs`}
              {filteredJobs.length > 0 && ` (${filteredJobs.length})`}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}
          
          {filteredJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No jobs found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <View style={styles.jobsList}>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onPress={() => handleJobPress(job.id)}
                  onSave={handleSaveJob}
                  onApply={handleApplyJob}
                  isSaved={savedJobs.includes(job.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More Jobs</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={currentFilters}
      />
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  categoriesContainer: {
    paddingTop: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  categoryItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextSelected: {
    color: '#2563EB',
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  activeFiltersContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  activeFiltersText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    flex: 1,
  },
  clearFiltersButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearFiltersText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
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
  actionIconActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#2563EB',
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
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