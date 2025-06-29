import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Filter,
  X,
  DollarSign,
  MapPin,
  Clock,
  Briefcase,
  Star,
} from 'lucide-react-native';

export interface FilterOptions {
  salaryRange: {
    min: number;
    max: number;
  };
  distance: number;
  jobType: string[];
  experienceLevel: string[];
  verifiedOnly: boolean;
  urgentOnly: boolean;
  remoteOnly: boolean;
}

interface AdvancedFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const salaryRanges = [
  { label: 'Any', min: 0, max: 1000 },
  { label: '$10-20/hr', min: 10, max: 20 },
  { label: '$20-30/hr', min: 20, max: 30 },
  { label: '$30-50/hr', min: 30, max: 50 },
  { label: '$50+/hr', min: 50, max: 1000 },
];

const distances = [
  { label: 'Any distance', value: 50 },
  { label: 'Within 1 km', value: 1 },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 25 km', value: 25 },
];

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Temporary',
];

const experienceLevels = [
  'Entry Level',
  'Intermediate',
  'Senior',
  'Expert',
];

export default function AdvancedFilters({
  visible,
  onClose,
  onApply,
  currentFilters,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      salaryRange: { min: 0, max: 1000 },
      distance: 50,
      jobType: [],
      experienceLevel: [],
      verifiedOnly: false,
      urgentOnly: false,
      remoteOnly: false,
    };
    setFilters(defaultFilters);
  };

  const renderSalaryRange = () => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <DollarSign size={20} color="#2563EB" />
        <Text style={styles.sectionTitle}>Salary Range</Text>
      </View>
      <View style={styles.optionsContainer}>
        {salaryRanges.map((range) => (
          <TouchableOpacity
            key={range.label}
            style={[
              styles.optionButton,
              filters.salaryRange.min === range.min &&
              filters.salaryRange.max === range.max &&
              styles.optionButtonSelected,
            ]}
            onPress={() => updateFilter('salaryRange', { min: range.min, max: range.max })}
          >
            <Text
              style={[
                styles.optionText,
                filters.salaryRange.min === range.min &&
                filters.salaryRange.max === range.max &&
                styles.optionTextSelected,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDistance = () => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <MapPin size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>Distance</Text>
      </View>
      <View style={styles.optionsContainer}>
        {distances.map((distance) => (
          <TouchableOpacity
            key={distance.label}
            style={[
              styles.optionButton,
              filters.distance === distance.value && styles.optionButtonSelected,
            ]}
            onPress={() => updateFilter('distance', distance.value)}
          >
            <Text
              style={[
                styles.optionText,
                filters.distance === distance.value && styles.optionTextSelected,
              ]}
            >
              {distance.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderJobType = () => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <Briefcase size={20} color="#F59E0B" />
        <Text style={styles.sectionTitle}>Job Type</Text>
      </View>
      <View style={styles.optionsContainer}>
        {jobTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              filters.jobType.includes(type) && styles.optionButtonSelected,
            ]}
            onPress={() => toggleArrayFilter('jobType', type)}
          >
            <Text
              style={[
                styles.optionText,
                filters.jobType.includes(type) && styles.optionTextSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderExperienceLevel = () => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <Star size={20} color="#8B5CF6" />
        <Text style={styles.sectionTitle}>Experience Level</Text>
      </View>
      <View style={styles.optionsContainer}>
        {experienceLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.optionButton,
              filters.experienceLevel.includes(level) && styles.optionButtonSelected,
            ]}
            onPress={() => toggleArrayFilter('experienceLevel', level)}
          >
            <Text
              style={[
                styles.optionText,
                filters.experienceLevel.includes(level) && styles.optionTextSelected,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSwitches = () => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <Filter size={20} color="#6B7280" />
        <Text style={styles.sectionTitle}>Additional Filters</Text>
      </View>
      
      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Verified companies only</Text>
          <Switch
            value={filters.verifiedOnly}
            onValueChange={(value) => updateFilter('verifiedOnly', value)}
            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
            thumbColor={filters.verifiedOnly ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Urgent jobs only</Text>
          <Switch
            value={filters.urgentOnly}
            onValueChange={(value) => updateFilter('urgentOnly', value)}
            trackColor={{ false: '#E5E7EB', true: '#EF4444' }}
            thumbColor={filters.urgentOnly ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Remote work only</Text>
          <Switch
            value={filters.remoteOnly}
            onValueChange={(value) => updateFilter('remoteOnly', value)}
            trackColor={{ false: '#E5E7EB', true: '#10B981' }}
            thumbColor={filters.remoteOnly ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Filter size={24} color="#2563EB" />
            <Text style={styles.headerTitle}>Advanced Filters</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderSalaryRange()}
          {renderDistance()}
          {renderJobType()}
          {renderExperienceLevel()}
          {renderSwitches()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <LinearGradient
              colors={['#2563EB', '#3B82F6']}
              style={styles.applyGradient}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionButtonSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#2563EB',
  },
  switchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  resetText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  applyButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
}); 