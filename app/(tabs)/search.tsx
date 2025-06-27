import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Filter, MapPin, Sliders } from 'lucide-react-native';
import JobCard from '../../components/JobCard';
import { mockJobs } from './index';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [jobs, setJobs] = useState(mockJobs);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const filters = [
    { id: 'all', label: 'All Jobs', count: 234 },
    { id: 'urgent', label: 'Urgent', count: 12 },
    { id: 'remote', label: 'Remote', count: 45 },
    { id: 'part-time', label: 'Part-time', count: 89 },
    { id: 'full-time', label: 'Full-time', count: 156 }
  ];

  const categories = [
    { id: '1', name: 'Design & Creative', jobs: 45, color: '#8B5CF6' },
    { id: '2', name: 'Technology', jobs: 78, color: '#06B6D4' },
    { id: '3', name: 'Marketing', jobs: 32, color: '#F59E0B' },
    { id: '4', name: 'Writing & Content', jobs: 24, color: '#10B981' },
    { id: '5', name: 'Customer Service', jobs: 18, color: '#EF4444' },
    { id: '6', name: 'Sales', jobs: 29, color: '#8B5CF6' },
  ];

  // Filtering logic
  const filteredJobs = jobs.filter((job: any) => {
    // Filter by search query
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill: any) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    // Filter by active filter
    let matchesFilter = true;
    if (activeFilter === 'urgent') matchesFilter = job.urgency === 'urgent';
    if (activeFilter === 'remote') matchesFilter = job.location.toLowerCase().includes('remote');
    if (activeFilter === 'part-time') matchesFilter = job.duration.toLowerCase().includes('part');
    if (activeFilter === 'full-time') matchesFilter = job.duration.toLowerCase().includes('full');
    // Filter by category
    let matchesCategory = true;
    if (activeCategory) {
      matchesCategory = job.skills.some((skill: any) =>
        skill.toLowerCase().includes(activeCategory.toLowerCase()) ||
        job.title.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }
    return matchesQuery && matchesFilter && matchesCategory;
  });

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleApplyJob = (jobId: string) => {
    alert('Applied to job: ' + jobId);
  };

  const handleCategoryPress = (categoryName: string) => {
    setActiveCategory(categoryName === activeCategory ? null : categoryName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Jobs</Text>
        <TouchableOpacity style={styles.mapButton}>
          <MapPin size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, skills, companies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Sliders size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                activeFilter === filter.id && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
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
          ))}
        </ScrollView>

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
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryJobs}>{category.jobs} jobs</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Job Results */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          {filteredJobs.length === 0 ? (
            <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 24 }}>
              No jobs found.
            </Text>
          ) : (
            filteredJobs.map((job: any) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => {}}
                onSave={handleSaveJob}
                onApply={handleApplyJob}
                isSaved={savedJobs.includes(job.id)}
              />
            ))
          )}
        </View>

        {/* Recent Searches */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentList}>
            {['Graphic Designer', 'Content Writer', 'Web Developer', 'Social Media Manager'].map((term, index) => (
              <TouchableOpacity key={index} style={styles.recentItem}>
                <SearchIcon size={16} color="#9CA3AF" />
                <Text style={styles.recentText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Popular Skills</Text>
          <View style={styles.tagsContainer}>
            {['React Native', 'Figma', 'SEO', 'Photography', 'Video Editing', 'UI/UX', 'WordPress', 'Social Media'].map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
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
  mapButton: {
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
    gap: 12,
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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingLeft: 20,
    marginBottom: 24,
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
  },
  activeFilterTab: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 6,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
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
});