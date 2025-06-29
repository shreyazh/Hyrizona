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
  Dimensions
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
  Zap
} from 'lucide-react-native';
import JobCard from '../../components/JobCard';
import { mockJobs } from './index';
import { useToast } from '../../hooks/useToast';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [jobs, setJobs] = useState(mockJobs);
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

  const { showToast } = useToast();
  const searchInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Search suggestions based on query
  const searchSuggestions = [
    'React Native Developer',
    'UI/UX Designer',
    'Product Manager',
    'Data Scientist',
    'Marketing Specialist',
    'Content Writer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Mobile App Developer'
  ].filter(suggestion => 
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  // Popular searches
  const popularSearches = [
    { term: 'Remote Jobs', count: 1240, trending: true },
    { term: 'React Developer', count: 890, trending: false },
    { term: 'UX Designer', count: 567, trending: true },
    { term: 'Data Analyst', count: 432, trending: false },
    { term: 'Product Manager', count: 321, trending: true }
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
    { id: '1', name: 'Design & Creative', jobs: 45, color: '#8B5CF6', icon: '🎨' },
    { id: '2', name: 'Technology', jobs: 78, color: '#06B6D4', icon: '💻' },
    { id: '3', name: 'Marketing', jobs: 32, color: '#F59E0B', icon: '📈' },
    { id: '4', name: 'Writing & Content', jobs: 24, color: '#10B981', icon: '✍️' },
    { id: '5', name: 'Customer Service', jobs: 18, color: '#EF4444', icon: '🎧' },
    { id: '6', name: 'Sales', jobs: 29, color: '#8B5CF6', icon: '💰' },
    { id: '7', name: 'Healthcare', jobs: 15, color: '#EC4899', icon: '🏥' },
    { id: '8', name: 'Education', jobs: 22, color: '#8B5CF6', icon: '📚' }
  ];

  // Enhanced filtering logic
  const filteredJobs = jobs.filter((job: any) => {
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill: any) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesFilter = true;
    if (activeFilter === 'urgent') matchesFilter = job.urgency === 'urgent';
    if (activeFilter === 'remote') matchesFilter = job.location.toLowerCase().includes('remote');
    if (activeFilter === 'part-time') matchesFilter = job.duration.toLowerCase().includes('part');
    if (activeFilter === 'full-time') matchesFilter = job.duration.toLowerCase().includes('full');
    if (activeFilter === 'high-paying') matchesFilter = job.salary >= 80000;

    let matchesCategory = true;
    if (activeCategory) {
      matchesCategory = job.skills.some((skill: any) =>
        skill.toLowerCase().includes(activeCategory.toLowerCase()) ||
        job.title.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    // Advanced filters
    const matchesSalary = job.salary >= salaryRange.min && job.salary <= salaryRange.max;
    const matchesExperience = experienceLevel.length === 0 || 
      experienceLevel.some(level => job.experience.toLowerCase().includes(level.toLowerCase()));
    const matchesJobType = jobType.length === 0 || 
      jobType.some(type => job.duration.toLowerCase().includes(type.toLowerCase()));

    return matchesQuery && matchesFilter && matchesCategory && 
           matchesSalary && matchesExperience && matchesJobType;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'salary':
        return b.salary - a.salary;
      case 'date':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'relevance':
      default:
        return 0;
    }
  });

  // Pagination
  const jobsPerPage = 10;
  const displayedJobs = sortedJobs.slice(0, currentPage * jobsPerPage);

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
    
    showToast('Searching for jobs...', 'info');
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    showToast('Listening... Speak now', 'info');
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      const voiceResult = 'React Native Developer';
      setSearchQuery(voiceResult);
      handleSearch(voiceResult);
      showToast(`Voice search: "${voiceResult}"`, 'success');
    }, 2000);
  };

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
    showToast(
      savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved successfully',
      'success'
    );
  };

  const handleApplyJob = async (jobId: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    showToast('Application submitted successfully!', 'success');
  };

  const handleCategoryPress = (categoryName: string) => {
    setActiveCategory(categoryName === activeCategory ? null : categoryName);
    showToast(
      activeCategory === categoryName 
        ? 'Category filter removed' 
        : `Filtered by ${categoryName}`,
      'info'
    );
  };

  const handleLoadMore = () => {
    if (displayedJobs.length < sortedJobs.length) {
      setCurrentPage(prev => prev + 1);
      showToast('Loading more jobs...', 'info');
    } else {
      showToast('No more jobs to load', 'info');
    }
  };

  const handleJobAlert = (term: string) => {
    setJobAlerts(prev =>
      prev.includes(term) ? prev.filter(t => t !== term) : [...prev, term]
    );
    showToast(
      jobAlerts.includes(term) 
        ? `Alert removed for "${term}"` 
        : `Alert created for "${term}"`,
      'success'
    );
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast('Search history cleared', 'info');
  };

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
              showToast('Filters cleared', 'info');
            }}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => {
              setShowAdvancedFilters(false);
              showToast('Filters applied', 'success');
            }}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Jobs</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => showToast('Location services coming soon', 'info')}
          >
            <MapPin size={20} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => showToast('Job alerts: ' + jobAlerts.length, 'info')}
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
        <TouchableOpacity 
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={handleVoiceSearch}
        >
          <Mic size={20} color={isListening ? "#EF4444" : "#2563EB"} />
        </TouchableOpacity>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            {categories.map((category) => (
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
                <Text style={styles.categoryJobs}>{category.jobs} jobs</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
                  <Text style={styles.popularTerm}>{search.term}</Text>
                  <Text style={styles.popularCount}>{search.count} jobs</Text>
                </View>
                <View style={styles.popularActions}>
                  {search.trending && <TrendingUp size={16} color="#F59E0B" />}
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
            <Text style={styles.sectionTitle}>
              {displayedJobs.length} Jobs Found
            </Text>
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

          {displayedJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <SearchIcon size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No jobs found</Text>
              <Text style={styles.emptyStateSubtitle}>
                Try adjusting your search criteria or filters
              </Text>
            </View>
          ) : (
            <>
              {displayedJobs.map((job: any) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onPress={() => {}}
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
                  <Text style={styles.loadMoreText}>Load More Jobs</Text>
                </TouchableOpacity>
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
            {['React Native', 'Figma', 'SEO', 'Photography', 'Video Editing', 'UI/UX', 'WordPress', 'Social Media'].map((tag, index) => (
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
  categoryJobs: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  popularTerm: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  popularCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
});