import { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Alert,
  Dimensions,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  Sliders, 
  Mic, 
  X, 
  Clock, 
  TrendingUp,
  Bell,
  Star,
  Map,
  DollarSign,
  Briefcase,
  Calendar,
  Users,
  Zap,
  Eye,
  Share2,
  Bookmark,
  Download,
  RotateCcw,
  Sparkles
} from 'lucide-react-native';
import JobCard from '../../components/JobCard';
import { mockJobs } from './index';
import { useToast } from '../../hooks/useToast';
import React from 'react';

const { width } = Dimensions.get('window');
const SIDEBAR_BREAKPOINT = 768;

// Move popularSearches definition above TrendingJobsSidebar
const popularSearches: { term: string; count: number; trending: boolean; growth: string }[] = [
  { term: 'Construction Labourer', count: 980, trending: true, growth: '+12%' },
  { term: 'Warehouse Associate', count: 870, trending: false, growth: '+8%' },
  { term: 'Janitor', count: 650, trending: true, growth: '+15%' },
  { term: 'Delivery Driver', count: 540, trending: true, growth: '+18%' },
  { term: 'Retail Cashier', count: 430, trending: false, growth: '+6%' },
  { term: 'Food Service Worker', count: 390, trending: true, growth: '+10%' },
  { term: 'Receptionist', count: 320, trending: false, growth: '+5%' },
  { term: 'Office Clerk', count: 280, trending: false, growth: '+4%' },
  { term: 'Security Guard', count: 210, trending: true, growth: '+9%' },
  { term: 'Hotel Housekeeper', count: 180, trending: false, growth: '+3%' },
  { term: 'Barista', count: 170, trending: true, growth: '+11%' },
  { term: 'Grocery Stocker', count: 160, trending: false, growth: '+7%' },
  { term: 'Mover', count: 150, trending: true, growth: '+13%' },
  { term: 'Landscaping Assistant', count: 140, trending: false, growth: '+6%' },
  { term: 'Dishwasher', count: 130, trending: true, growth: '+9%' },
  { term: 'Fast Food Crew', count: 120, trending: true, growth: '+10%' },
  { term: 'Parking Attendant', count: 110, trending: false, growth: '+4%' },
  { term: 'Amusement Park Staff', count: 100, trending: true, growth: '+15%' },
  { term: 'Farm Helper', count: 90, trending: false, growth: '+5%' },
  { term: 'Event Staff', count: 80, trending: true, growth: '+12%' }
];

function TrendingJobsSidebar({ onSelect }: { onSelect: (term: string) => void }) {
  const trendingJobs = popularSearches.filter((j: { term: string; count: number; trending: boolean; growth: string }) => j.trending);
  return (
    <View style={styles.trendingSidebar}>
      <Text style={styles.trendingTitle}>Trending Jobs</Text>
      {trendingJobs.map((job: { term: string; count: number; trending: boolean; growth: string }, idx: number) => (
        <TouchableOpacity
          key={job.term}
          style={styles.trendingItem}
          onPress={() => onSelect(job.term)}
        >
          <View style={styles.trendingRow}>
            <Text style={styles.trendingRank}>{idx + 1}</Text>
            <Text style={styles.trendingTerm}>{job.term}</Text>
            {job.trending && <TrendingUp size={14} color="#F59E0B" style={{ marginLeft: 4 }} />}
          </View>
          <Text style={styles.trendingCount}>{job.count} jobs</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('San Francisco, CA');
  const [jobAlerts, setJobAlerts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 200000 });
  const [experienceLevel, setExperienceLevel] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [distance, setDistance] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchAnalytics, setSearchAnalytics] = useState({
    totalSearches: 0,
    popularTerms: [] as string[],
    recentActivity: [] as any[]
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState([
    { id: '1', title: 'Apply to All', icon: Zap, color: '#10B981' },
    { id: '2', title: 'Save Search', icon: Bookmark, color: '#F59E0B' },
    { id: '3', title: 'Export Results', icon: Download, color: '#8B5CF6' },
    { id: '4', title: 'Share Search', icon: Share2, color: '#06B6D4' }
  ]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const isLargeScreen = windowWidth >= SIDEBAR_BREAKPOINT;

  const { showToast } = useToast();
  const searchInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Search suggestions based on query
  const searchSuggestions = [
    'Construction Labourer',
    'Warehouse Associate',
    'Janitor',
    'Delivery Driver',
    'Retail Cashier',
    'Food Service Worker',
    'Receptionist',
    'Office Clerk',
    'Security Guard',
    'Hotel Housekeeper'
  ].filter(suggestion => 
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  // Popular searches with real-time data
  const popularSearches = [
    { term: 'Construction Labourer', count: 980, trending: true, growth: '+12%' },
    { term: 'Warehouse Associate', count: 870, trending: false, growth: '+8%' },
    { term: 'Janitor', count: 650, trending: true, growth: '+15%' },
    { term: 'Delivery Driver', count: 540, trending: true, growth: '+18%' },
    { term: 'Retail Cashier', count: 430, trending: false, growth: '+6%' },
    { term: 'Food Service Worker', count: 390, trending: true, growth: '+10%' },
    { term: 'Receptionist', count: 320, trending: false, growth: '+5%' },
    { term: 'Office Clerk', count: 280, trending: false, growth: '+4%' },
    { term: 'Security Guard', count: 210, trending: true, growth: '+9%' },
    { term: 'Hotel Housekeeper', count: 180, trending: false, growth: '+3%' },
    { term: 'Barista', count: 170, trending: true, growth: '+11%' },
    { term: 'Grocery Stocker', count: 160, trending: false, growth: '+7%' },
    { term: 'Mover', count: 150, trending: true, growth: '+13%' },
    { term: 'Landscaping Assistant', count: 140, trending: false, growth: '+6%' },
    { term: 'Dishwasher', count: 130, trending: true, growth: '+9%' },
    { term: 'Fast Food Crew', count: 120, trending: true, growth: '+10%' },
    { term: 'Parking Attendant', count: 110, trending: false, growth: '+4%' },
    { term: 'Amusement Park Staff', count: 100, trending: true, growth: '+15%' },
    { term: 'Farm Helper', count: 90, trending: false, growth: '+5%' },
    { term: 'Event Staff', count: 80, trending: true, growth: '+12%' }
  ];

  const filters = [
    { id: 'all', label: 'All Jobs', count: 234, icon: Briefcase },
    { id: 'urgent', label: 'Urgent', count: 12, icon: Zap },
    { id: 'remote', label: 'Remote', count: 45, icon: Map },
    { id: 'part-time', label: 'Part-time', count: 89, icon: Clock },
    { id: 'full-time', label: 'Full-time', count: 156, icon: Users },
    { id: 'high-paying', label: 'High Paying', count: 34, icon: DollarSign }
  ];

  const categories = [
    { id: '1', name: 'Construction', jobs: 120, color: '#8B5CF6', icon: '🚧', growth: '+12%' },
    { id: '2', name: 'Warehouse', jobs: 110, color: '#FF9800', icon: '📦', growth: '+8%' },
    { id: '3', name: 'Janitorial', jobs: 90, color: '#F59E0B', icon: '🧹', growth: '+15%' },
    { id: '4', name: 'Delivery', jobs: 85, color: '#10B981', icon: '🚚', growth: '+18%' },
    { id: '5', name: 'Retail', jobs: 75, color: '#EF4444', icon: '🛒', growth: '+6%' },
    { id: '6', name: 'Food Service', jobs: 70, color: '#8B5CF6', icon: '🍔', growth: '+10%' },
    { id: '7', name: 'Clerical', jobs: 60, color: '#EC4899', icon: '🗂️', growth: '+5%' },
    { id: '8', name: 'Security', jobs: 50, color: '#2563EB', icon: '🛡️', growth: '+9%' },
    { id: '9', name: 'Hospitality', jobs: 40, color: '#F472B6', icon: '🛏️', growth: '+3%' },
    { id: '10', name: 'Landscaping', jobs: 35, color: '#4CAF50', icon: '🌳', growth: '+7%' },
    { id: '11', name: 'Maintenance', jobs: 30, color: '#607D8B', icon: '🔧', growth: '+5%' },
    { id: '12', name: 'Moving', jobs: 28, color: '#795548', icon: '🚚', growth: '+8%' },
    { id: '13', name: 'Farm Work', jobs: 22, color: '#8BC34A', icon: '🌾', growth: '+6%' },
    { id: '14', name: 'Event Staff', jobs: 20, color: '#00BCD4', icon: '🎪', growth: '+12%' },
    { id: '15', name: 'Parking', jobs: 18, color: '#9E9E9E', icon: '🅿️', growth: '+4%' },
    { id: '16', name: 'Amusement Park', jobs: 15, color: '#E040FB', icon: '🎢', growth: '+15%' }
  ];

  // Enhanced filtering logic
  const filteredJobs = mockJobs.filter((job: any) => {
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill: any) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesFilter = true;
    if (activeFilter === 'urgent') matchesFilter = job.urgency === 'urgent';
    if (activeFilter === 'remote') matchesFilter = job.location.toLowerCase().includes('remote');
    if (activeFilter === 'part-time') matchesFilter = job.duration.toLowerCase().includes('part');
    if (activeFilter === 'full-time') matchesFilter = job.duration.toLowerCase().includes('full');
    if (activeFilter === 'high-paying') {
      const payValue = parseInt(job.pay.replace(/[^0-9]/g, ''));
      matchesFilter = payValue >= 30; // $30/hr or more
    }

    let matchesCategory = true;
    if (activeCategory) {
      matchesCategory = job.skills.some((skill: any) =>
        skill.toLowerCase().includes(activeCategory.toLowerCase()) ||
        job.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
        job.category.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    // Advanced filters
    const payValue = parseInt(job.pay.replace(/[^0-9]/g, ''));
    const matchesSalary = payValue >= salaryRange.min && payValue <= salaryRange.max;
    const matchesExperience = experienceLevel.length === 0 || 
      experienceLevel.some(level => job.experience?.toLowerCase().includes(level.toLowerCase()));
    const matchesJobType = jobType.length === 0 || 
      jobType.some(type => job.duration.toLowerCase().includes(type.toLowerCase()));

    return matchesQuery && matchesFilter && matchesCategory && 
           matchesSalary && matchesExperience && matchesJobType;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'salary':
        const payA = parseInt(a.pay.replace(/[^0-9]/g, ''));
        const payB = parseInt(b.pay.replace(/[^0-9]/g, ''));
        return payB - payA;
      case 'date':
        return new Date(a.postedTime).getTime() - new Date(b.postedTime).getTime();
      case 'relevance':
      default:
        return 0;
    }
  });

  // Enhanced pagination - show more jobs per page
  const jobsPerPage = 15; // Increased from 10 to 15
  // 1. Remove pagination: show all jobs
  const displayedJobs = sortedJobs;

  // Generate recommendations based on user behavior
  useEffect(() => {
    const userRecommendations = mockJobs
      .filter((job: any) => 
        savedJobs.includes(job.id) || 
        job.skills.some((skill: any) => 
          searchHistory.some(term => term.toLowerCase().includes(skill.toLowerCase()))
        )
      )
      .slice(0, 5); // Increased from 3 to 5
    setRecommendations(userRecommendations);
  }, [savedJobs, searchHistory]);

  // Pulse animation for voice button
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  useEffect(() => {
    if (showSuggestions) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showSuggestions]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    setCurrentPage(1);
    
    // Add to search history
    if (query.trim() && !searchHistory.includes(query.trim())) {
      setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
    }
    
    // Update analytics
    setSearchAnalytics(prev => ({
      ...prev,
      totalSearches: prev.totalSearches + 1,
      recentActivity: [
        { term: query, timestamp: new Date(), results: filteredJobs.length },
        ...prev.recentActivity.slice(0, 4)
      ]
    }));
    
    showToast('info', 'Searching for jobs...');
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    showToast('info', 'Listening... Speak now');
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      const voiceResult = 'React Native Developer';
      setSearchQuery(voiceResult);
      handleSearch(voiceResult);
      showToast('success', `Voice search: "${voiceResult}"`);
    }, 2000);
  };

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
    showToast(
      'success',
      savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved successfully'
    );
  };

  const handleApplyJob = async (jobId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast('success', 'Application submitted successfully!');
      
      // Update job analytics
      setSearchAnalytics(prev => ({
        ...prev,
        recentActivity: [
          { term: 'Application submitted', timestamp: new Date(), results: 1 },
          ...prev.recentActivity.slice(0, 4)
        ]
      }));
    } catch (error) {
      showToast('error', 'Application failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkApply = async () => {
    if (displayedJobs.length === 0) {
      showToast('info', 'No jobs to apply to');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate bulk application
      const jobsToApply = displayedJobs.slice(0, 5); // Apply to first 5 jobs
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('success', `Applied to ${jobsToApply.length} jobs successfully!`);
      
      // Update analytics
      setSearchAnalytics(prev => ({
        ...prev,
        recentActivity: [
          { term: 'Bulk application', timestamp: new Date(), results: jobsToApply.length },
          ...prev.recentActivity.slice(0, 4)
        ]
      }));
    } catch (error) {
      showToast('error', 'Bulk application failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    setActiveCategory(categoryName === activeCategory ? null : categoryName);
    setCurrentPage(1); // Reset pagination when category changes
    
    const categoryJobs = mockJobs.filter((job: any) => 
      job.skills.some((skill: any) =>
        skill.toLowerCase().includes(categoryName.toLowerCase()) ||
        job.title.toLowerCase().includes(categoryName.toLowerCase()) ||
        job.category.toLowerCase().includes(categoryName.toLowerCase())
      )
    );
    
    showToast(
      'info',
      activeCategory === categoryName 
        ? 'Category filter removed' : `Found ${categoryJobs.length} jobs in ${categoryName}`
    );
  };

  const handleLoadMore = () => {
    if (displayedJobs.length < sortedJobs.length) {
      setCurrentPage(prev => prev + 1);
      showToast('info', 'Loading more jobs...');
    } else {
      showToast('info', 'No more jobs to load');
    }
  };

  const handleJobAlert = (term: string) => {
    setJobAlerts(prev =>
      prev.includes(term) ? prev.filter(t => t !== term) : [...prev, term]
    );
    showToast(
      'success',
      jobAlerts.includes(term) 
        ? `Alert removed for "${term}"` 
        : `Alert created for "${term}"`
    );
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast('info', 'Search history cleared');
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case '1':
        handleBulkApply();
        break;
      case '2':
        showToast('success', 'Search saved successfully');
        break;
      case '3':
        showToast('info', 'Exporting results...');
        break;
      case '4':
        showToast('info', 'Sharing search results...');
        break;
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentPage(1);
    setIsRefreshing(false);
    showToast('success', 'Search refreshed');
  };

  const handleShareJob = (job: any) => {
    showToast('info', `Sharing ${job.title} position`);
  };

  const handleViewJob = (job: any) => {
    showToast('info', `Viewing ${job.title} details`);
  };

  // Get category job counts
  const getCategoryJobCount = (categoryName: string) => {
    return mockJobs.filter((job: any) => 
      job.skills.some((skill: any) =>
        skill.toLowerCase().includes(categoryName.toLowerCase()) ||
        job.title.toLowerCase().includes(categoryName.toLowerCase()) ||
        job.category.toLowerCase().includes(categoryName.toLowerCase())
      )
    ).length;
  };

  // Update categories with real job counts
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    jobs: getCategoryJobCount(category.name)
  }));

  const AdvancedFiltersModal = () => (
    <Modal
      visible={showAdvancedFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Advanced Filters</Text>
          <TouchableOpacity onPress={() => setShowAdvancedFilters(false)}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Salary Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Salary Range</Text>
            <View style={styles.salaryInputs}>
              <TextInput
                style={styles.salaryInput}
                placeholder="Min"
                value={salaryRange.min.toString()}
                onChangeText={(text) => setSalaryRange(prev => ({ ...prev, min: parseInt(text) || 0 }))}
                keyboardType="numeric"
              />
              <Text style={styles.salarySeparator}>-</Text>
              <TextInput
                style={styles.salaryInput}
                placeholder="Max"
                value={salaryRange.max.toString()}
                onChangeText={(text) => setSalaryRange(prev => ({ ...prev, max: parseInt(text) || 200000 }))}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Experience Level */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Experience Level</Text>
            <View style={styles.chipContainer}>
              {['Entry', 'Mid', 'Senior', 'Executive'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.chip,
                    experienceLevel.includes(level) && styles.activeChip
                  ]}
                  onPress={() => setExperienceLevel(prev =>
                    prev.includes(level) 
                      ? prev.filter(l => l !== level)
                      : [...prev, level]
                  )}
                >
                  <Text style={[
                    styles.chipText,
                    experienceLevel.includes(level) && styles.activeChipText
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Job Type */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Job Type</Text>
            <View style={styles.chipContainer}>
              {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    jobType.includes(type) && styles.activeChip
                  ]}
                  onPress={() => setJobType(prev =>
                    prev.includes(type) 
                      ? prev.filter(t => t !== type)
                      : [...prev, type]
                  )}
                >
                  <Text style={[
                    styles.chipText,
                    jobType.includes(type) && styles.activeChipText
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Distance: {distance} miles</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>5 miles</Text>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${(distance / 100) * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${(distance / 100) * 100}%` }]} />
              </View>
              <Text style={styles.sliderLabel}>100 miles</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => {
              setSalaryRange({ min: 0, max: 200000 });
              setExperienceLevel([]);
              setJobType([]);
              setDistance(50);
              showToast('info', 'Filters cleared');
            }}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => {
              setShowAdvancedFilters(false);
              showToast('success', 'Filters applied');
            }}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  // 2. Sidebar component with trending and recommendations
  function SearchSidebar({ onSelect, recommendations, handleViewJob, handleShareJob }: {
    onSelect: (term: string) => void;
    recommendations: any[];
    handleViewJob: (job: any) => void;
    handleShareJob: (job: any) => void;
  }) {
    return (
      <View style={styles.trendingSidebarMinimal}>
        <View style={styles.sidebarCard}>
          <TrendingJobsSidebar onSelect={onSelect} />
        </View>
        {recommendations.length > 0 && (
          <View style={[styles.sidebarCard, { marginTop: 24 }]}> 
            <View style={styles.recommendationsHeaderMinimal}>
              <Sparkles size={18} color="#F59E0B" />
              <Text style={styles.sidebarSectionTitle}>Recommended for You</Text>
            </View>
            {recommendations.map((job: any) => (
              <View key={job.id} style={styles.recommendationCardMinimal}>
                <Text style={styles.recommendationTitleMinimal}>{job.title}</Text>
                <Text style={styles.recommendationCompanyMinimal}>{job.company}</Text>
                <Text style={styles.recommendationSalaryMinimal}>{job.pay}</Text>
                <View style={styles.recommendationActionsMinimal}>
                  <TouchableOpacity onPress={() => handleViewJob(job)}>
                    <Eye size={14} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleShareJob(job)}>
                    <Share2 size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  // 3. Main return: two-column layout with responsive sidebar
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchMainContent}>
        <View style={styles.searchMainColumn}>
          <View style={styles.header}>
            <Text style={styles.title}>Search Jobs</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => showToast('info', 'Location services coming soon')}
              >
                <MapPin size={20} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => showToast('info', `Job alerts: ${jobAlerts.length}`)}
              >
                <Bell size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <SearchIcon size={20} color="#6B7280" />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Search jobs, skills, companies..."
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setShowSuggestions(text.length > 0);
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onSubmitEditing={() => handleSearch(searchQuery)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
                onPress={handleVoiceSearch}
              >
                <Mic size={20} color={isListening ? "#EF4444" : "#2563EB"} />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowAdvancedFilters(true)}
            >
              <Sliders size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* Search Suggestions */}
          {showSuggestions && (
            <Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}> 
              {searchSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSearch(suggestion)}
                >
                  <SearchIcon size={16} color="#9CA3AF" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#2563EB']}
                tintColor="#2563EB"
              />
            }
          >
            {/* Quick Actions */}
            {displayedJobs.length > 0 && (
              <View style={styles.quickActionsSection}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {quickActions.map((action) => (
                    <TouchableOpacity
                      key={action.id}
                      style={styles.quickActionButton}
                      onPress={() => handleQuickAction(action.id)}
                    >
                      <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                        <action.icon size={16} color="white" />
                      </View>
                      <Text style={styles.quickActionText}>{action.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Search Analytics */}
            {searchAnalytics.totalSearches > 0 && (
              <View style={styles.analyticsSection}>
                <Text style={styles.sectionTitle}>Search Insights</Text>
                <View style={styles.analyticsCard}>
                  <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>Total Searches:</Text>
                    <Text style={styles.analyticsValue}>{searchAnalytics.totalSearches}</Text>
                  </View>
                  <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>Current Results:</Text>
                    <Text style={styles.analyticsValue}>{displayedJobs.length}</Text>
                  </View>
                  <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>Saved Jobs:</Text>
                    <Text style={styles.analyticsValue}>{savedJobs.length}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Filter Tabs */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filtersContainer}
              contentContainerStyle={styles.filtersContent}
            >
              {filters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterTab,
                      activeFilter === filter.id && styles.activeFilterTab
                    ]}
                    onPress={() => setActiveFilter(filter.id)}
                  >
                    <IconComponent size={16} color={activeFilter === filter.id ? "white" : "#6B7280"} />
                    <Text style={[
                      styles.filterTabText,
                      activeFilter === filter.id && styles.activeFilterTabText
                    ]}>
                      {filter.label}
                    </Text>
                    <Text style={[
                      styles.filterCount,
                      activeFilter === filter.id && styles.activeFilterCount
                    ]}>
                      {filter.count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Sort Options */}
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'date', label: 'Latest' },
                  { id: 'salary', label: 'Salary' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortOption,
                      sortBy === option.id && styles.activeSortOption
                    ]}
                    onPress={() => setSortBy(option.id)}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      sortBy === option.id && styles.activeSortOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Browse by Category</Text>
              <View style={styles.categoriesGrid}>
                {categoriesWithCounts.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      activeCategory === category.name && { borderColor: '#2563EB', borderWidth: 2 }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleCategoryPress(category.name)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <View style={styles.categoryStats}>
                      <Text style={styles.categoryJobs}>{category.jobs} jobs</Text>
                      <Text style={styles.categoryGrowth}>{category.growth}</Text>
                    </View>
                    {activeCategory === category.name && (
                      <View style={styles.activeCategoryIndicator}>
                        <Text style={styles.activeCategoryText}>Active</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Application Summary */}
            {savedJobs.length > 0 && (
              <View style={styles.applicationSummarySection}>
                <Text style={styles.sectionTitle}>Your Activity</Text>
                <View style={styles.applicationSummaryCard}>
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Saved Jobs</Text>
                      <Text style={styles.summaryValue}>{savedJobs.length}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Applied Today</Text>
                      <Text style={styles.summaryValue}>
                        {searchAnalytics.recentActivity.filter(activity => 
                          activity.term.includes('Application')
                        ).length}
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Total Searches</Text>
                      <Text style={styles.summaryValue}>{searchAnalytics.totalSearches}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.viewSavedButton}
                    onPress={() => showToast('info', 'Viewing saved jobs...')}
                  >
                    <Text style={styles.viewSavedButtonText}>View Saved Jobs</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Popular Searches */}
            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>Trending Searches</Text>
              <View style={styles.popularList}>
                {popularSearches.map((search, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.popularItem}
                    onPress={() => handleSearch(search.term)}
                  >
                    <View style={styles.popularContent}>
                      <View style={styles.popularHeader}>
                        <Text style={styles.popularTerm}>{search.term}</Text>
                        {search.trending && <TrendingUp size={16} color="#F59E0B" />}
                      </View>
                      <View style={styles.popularStats}>
                        <Text style={styles.popularCount}>{search.count} jobs</Text>
                        <Text style={styles.popularGrowth}>{search.growth}</Text>
                      </View>
                    </View>
                    <View style={styles.popularActions}>
                      <TouchableOpacity onPress={() => handleJobAlert(search.term)}>
                        <Bell size={16} color={jobAlerts.includes(search.term) ? "#2563EB" : "#9CA3AF"} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Job Results */}
            <View style={styles.jobsSection}>
              <View style={styles.jobsHeader}>
                <View style={styles.jobsHeaderLeft}>
                  <Text style={styles.sectionTitle}>
                    {displayedJobs.length} Jobs Found
                  </Text>
                  {sortedJobs.length > displayedJobs.length && (
                    <Text style={styles.jobsSubtitle}>
                      Showing {displayedJobs.length} of {sortedJobs.length} jobs
                    </Text>
                  )}
                </View>
                {(activeFilter !== 'all' || activeCategory || searchQuery) && (
                  <TouchableOpacity 
                    style={styles.clearFiltersButton}
                    onPress={() => {
                      setActiveFilter('all');
                      setActiveCategory(null);
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                  >
                    <Text style={styles.clearFiltersText}>Clear Filters</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Search Results Summary */}
              {(activeCategory || searchQuery) && (
                <View style={styles.searchResultsSummary}>
                  <Text style={styles.summaryText}>
                    {activeCategory && `Category: ${activeCategory}`}
                    {activeCategory && searchQuery && ' • '}
                    {searchQuery && `Search: "${searchQuery}"`}
                  </Text>
                  <Text style={styles.summarySubtext}>
                    {sortedJobs.length} matching jobs found
                  </Text>
                </View>
              )}

              {displayedJobs.length === 0 ? (
                <View style={styles.emptyState}>
                  <SearchIcon size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateTitle}>No jobs found</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Try adjusting your search criteria or filters
                  </Text>
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                      setActiveCategory(null);
                    }}
                  >
                    <RotateCcw size={16} color="#2563EB" />
                    <Text style={styles.retryButtonText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {displayedJobs.map((job: any) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onPress={() => handleViewJob(job)}
                      onSave={handleSaveJob}
                      onApply={handleApplyJob}
                      isSaved={savedJobs.includes(job.id)}
                    />
                  ))}
                  
                  {displayedJobs.length < sortedJobs.length && (
                    <TouchableOpacity 
                      style={styles.loadMoreButton}
                      onPress={handleLoadMore}
                    >
                      <Text style={styles.loadMoreText}>
                        Load More Jobs ({sortedJobs.length - displayedJobs.length} remaining)
                      </Text>
                    </TouchableOpacity>
                  )}

                  {displayedJobs.length === sortedJobs.length && sortedJobs.length > 0 && (
                    <View style={styles.endOfResults}>
                      <Text style={styles.endOfResultsText}>You've seen all available jobs</Text>
                      <TouchableOpacity 
                        style={styles.refreshResultsButton}
                        onPress={onRefresh}
                      >
                        <RotateCcw size={16} color="#2563EB" />
                        <Text style={styles.refreshResultsText}>Refresh Results</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <View style={styles.recentSection}>
                <View style={styles.recentHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearSearchHistory}>
                    <Text style={styles.clearHistoryText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recentList}>
                  {searchHistory.slice(0, 5).map((term, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.recentItem}
                      onPress={() => handleSearch(term)}
                    >
                      <Clock size={16} color="#9CA3AF" />
                      <Text style={styles.recentText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Tags */}
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Popular Skills</Text>
              <View style={styles.tagsContainer}>
                {['Cleaning', 'Customer Service', 'Cash Handling', 'Food Prep', 'Stocking', 'Landscaping', 'Moving', 'Delivery', 'Communication', 'Teamwork', 'Reliability', 'Organization', 'Dishwashing', 'Barista', 'Event Setup', 'Farm Work', 'Security', 'Reception', 'Clerical', 'Multitasking', 'Problem Solving'].map((tag, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.tag}
                    onPress={() => handleSearch(tag)}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
        {isLargeScreen ? (
          <SearchSidebar 
            onSelect={handleSearch} 
            recommendations={recommendations} 
            handleViewJob={handleViewJob} 
            handleShareJob={handleShareJob} 
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.sidebarToggleButton}
              onPress={() => setSidebarVisible(true)}
            >
              <Text style={styles.sidebarToggleText}>☰</Text>
            </TouchableOpacity>
            <Modal
              visible={sidebarVisible}
              animationType="slide"
              transparent
              onRequestClose={() => setSidebarVisible(false)}
            >
              <TouchableOpacity
                style={styles.sidebarOverlay}
                activeOpacity={1}
                onPress={() => setSidebarVisible(false)}
              />
              <View style={styles.sidebarDrawer}>
                <TouchableOpacity
                  style={styles.sidebarCloseButton}
                  onPress={() => setSidebarVisible(false)}
                >
                  <Text style={styles.sidebarCloseText}>×</Text>
                </TouchableOpacity>
                <SearchSidebar 
                  onSelect={handleSearch} 
                  recommendations={recommendations} 
                  handleViewJob={handleViewJob} 
                  handleShareJob={handleShareJob} 
                />
              </View>
            </Modal>
          </>
        )}
      </View>
      <AdvancedFiltersModal />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#FEF2F2',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  content: {
    flex: 1,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionButton: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 80,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  analyticsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  analyticsValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  filtersContainer: {
    paddingLeft: 20,
    marginBottom: 16,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  activeFilterTab: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: 'white',
  },
  filterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeFilterCount: {
    color: '#2563EB',
    backgroundColor: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeSortOption: {
    backgroundColor: '#2563EB',
  },
  sortOptionText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeSortOptionText: {
    color: 'white',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryJobs: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  categoryGrowth: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  recommendationsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  recommendationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendationCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  recommendationSalary: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  popularSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  popularList: {
    gap: 12,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  popularContent: {
    flex: 1,
  },
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  popularTerm: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  popularStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popularCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  popularGrowth: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  popularActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  jobsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  jobsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
  },
  clearFiltersText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  searchResultsSummary: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  summarySubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  loadMoreButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  loadMoreText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearHistoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  recentText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  tagsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  tagText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  salaryInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  salaryInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  salarySeparator: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeChipText: {
    color: 'white',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    minWidth: 60,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  applicationSummarySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  applicationSummaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  viewSavedButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewSavedButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  activeCategoryIndicator: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  activeCategoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  endOfResults: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endOfResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 16,
  },
  refreshResultsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  refreshResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  searchMainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  searchMainColumn: {
    flex: 1,
    minWidth: 0,
  },
  trendingSidebar: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 12,
  },
  trendingItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendingRank: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 8,
  },
  trendingTerm: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  trendingCount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sidebarToggleButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 100,
    backgroundColor: '#2563EB',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sidebarToggleText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 99,
  },
  sidebarDrawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 320,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    paddingTop: Platform.OS === 'android' ? 32 : 48,
  },
  sidebarCloseButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 101,
    padding: 8,
  },
  sidebarCloseText: {
    fontSize: 32,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  trendingSidebarMinimal: {
    width: 320,
    backgroundColor: 'transparent',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  sidebarCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sidebarSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 8,
  },
  recommendationsHeaderMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationCardMinimal: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  recommendationTitleMinimal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  recommendationCompanyMinimal: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  recommendationSalaryMinimal: {
    fontSize: 12,
    color: '#10B981',
    marginBottom: 6,
  },
  recommendationActionsMinimal: {
    flexDirection: 'row',
    gap: 12,
  },
});