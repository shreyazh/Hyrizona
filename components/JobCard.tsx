import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Bookmark,
  BookmarkCheck,
  Star,
  CheckCircle
} from 'lucide-react-native';
import { useState, useRef } from 'react';

interface Job {
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
}

interface JobCardProps {
  job: Job;
  onPress: (jobId: string) => void;
  onSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
  isSaved?: boolean;
  isApplied?: boolean;
}

export default function JobCard({ 
  job, 
  onPress, 
  onSave, 
  onApply, 
  isSaved = false,
  isApplied = false
}: JobCardProps) {
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => onPress(job.id);
  const handleSave = () => onSave(job.id);
  const handleApply = async () => {
    if (isApplied || loading) return;
    setLoading(true);
    await onApply(job.id);
    setLoading(false);
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <View style={styles.companyImageContainer}>
              <Text style={styles.companyInitial}>
                {job.company.charAt(0)}
              </Text>
            </View>
            <View style={styles.headerText}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {job.title}
                </Text>
                {job.verified && (
                  <CheckCircle size={16} color="#10B981" />
                )}
              </View>
              <Text style={styles.company}>{job.company}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            {isSaved ? (
              <BookmarkCheck size={20} color="#2563EB" />
            ) : (
              <Bookmark size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText}>{job.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <DollarSign size={14} color="#10B981" />
            <Text style={styles.payText}>{job.pay}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={14} color="#F59E0B" />
            <Text style={styles.detailText}>{job.duration}</Text>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.skillsContainer}>
          {job.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {job.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{job.skills.length - 3} more</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.metaRow}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{job.rating}</Text>
              <Text style={styles.separator}>•</Text>
              <Users size={12} color="#6B7280" />
              <Text style={styles.applicants}>{job.applicants} applied</Text>
            </View>
            <Text style={styles.postedTime}>{job.postedTime}</Text>
          </View>

          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApply}
            disabled={isApplied || loading}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <LinearGradient
                colors={isApplied ? ['#10B981', '#22D3EE'] : ['#2563EB', '#3B82F6']}
                style={styles.applyGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : isApplied ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={16} color="#fff" />
                    <Text style={[styles.applyText, { color: '#fff' }]}>Applied</Text>
                  </View>
                ) : (
                  <Text style={styles.applyText}>Apply</Text>
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Urgency Badge */}
        {job.urgency === 'urgent' && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyInitial: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  company: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  payText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  moreSkills: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  separator: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  applicants: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  postedTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  applyButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  applyText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  urgentBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: 'white',
    letterSpacing: 0.5,
  },
});