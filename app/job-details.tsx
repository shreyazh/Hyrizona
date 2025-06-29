import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Phone,
  Mail,
  Globe,
  Calendar,
  Briefcase,
  Award,
  Users as TeamIcon,
  Zap,
} from 'lucide-react-native';
import { Job } from './(tabs)';
import { useToastContext } from '@/contexts/ToastContext';

export default function JobDetailsScreen() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { showSuccess, showError, showInfo } = useToastContext();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find job from mock data (in real app, this would be an API call)
      const mockJobs = [
        {
          id: '1',
          title: 'Freelance Graphic Designer',
          company: 'Praveen Inc.',
          location: 'Downtown, 0.5 km',
          pay: '$25/hr',
          duration: '2-3 hours',
          skills: ['Design', 'Photoshop', 'Branding', 'Illustrator', 'UI/UX'],
          postedTime: '2 min ago',
          urgency: 'urgent' as const,
          rating: 4.8,
          applicants: 3,
          verified: true,
          category: 'Design',
          description: 'Looking for a creative graphic designer to help with brand identity and marketing materials. This role involves creating visually appealing designs for various digital and print media.',
          requirements: ['2+ years experience', 'Portfolio required', 'Adobe Creative Suite', 'Strong communication skills', 'Ability to work under pressure'],
          benefits: ['Flexible hours', 'Remote work option', 'Competitive pay', 'Creative freedom', 'Professional growth']
        },
        {
          id: '2',
          title: 'Event Setup Assistant',
          company: 'Anubhav Agency',
          location: 'City Center, 1.2 km',
          pay: '$18/hr',
          duration: '4-6 hours',
          skills: ['Physical Work', 'Team Work', 'Customer Service'],
          postedTime: '15 min ago',
          urgency: 'normal' as const,
          rating: 4.6,
          applicants: 8,
          verified: true,
          category: 'Events',
          description: 'Help set up and manage events including equipment setup and customer service. This is a hands-on role that requires physical stamina and excellent interpersonal skills.',
          requirements: ['Physical stamina', 'Team player', 'Weekend availability', 'Customer service experience', 'Reliable transportation'],
          benefits: ['Free meals', 'Event networking', 'Performance bonuses', 'Flexible scheduling', 'Fun work environment']
        }
      ];
      
      const foundJob = mockJobs.find(j => j.id === jobId);
      if (foundJob) {
        setJob(foundJob);
      } else {
        showError('Job Not Found', 'The requested job could not be found');
        router.back();
      }
    } catch (error) {
      showError('Loading Failed', 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess(
        'Application Submitted!', 
        'Your application has been sent successfully. We\'ll contact you soon.',
        5000
      );
      setTimeout(() => router.back(), 2000);
    } catch (error) {
      showError('Application Failed', 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    if (saved) {
      showInfo('Removed from saved', 'Job removed from your saved list');
    } else {
      showSuccess('Saved!', 'Job added to your saved list');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job: ${job?.title} at ${job?.company}`,
        title: job?.title,
      });
      showInfo('Shared!', 'Job shared successfully');
    } catch (error) {
      showError('Share Failed', 'Failed to share job');
    }
  };

  const handleContact = (type: 'phone' | 'email' | 'website') => {
    switch (type) {
      case 'phone':
        Linking.openURL('tel:+1234567890');
        showInfo('Calling...', 'Opening phone dialer');
        break;
      case 'email':
        Linking.openURL('mailto:contact@company.com');
        showInfo('Email...', 'Opening email client');
        break;
      case 'website':
        Linking.openURL('https://company.com');
        showInfo('Website...', 'Opening company website');
        break;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Job not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            {saved ? (
              <BookmarkCheck size={24} color="#2563EB" />
            ) : (
              <Bookmark size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.companyInfo}>
            <View style={styles.companyLogo}>
              <Text style={styles.companyInitial}>{job.company.charAt(0)}</Text>
            </View>
            <View style={styles.companyDetails}>
              <View style={styles.titleRow}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                {job.verified && <CheckCircle size={20} color="#10B981" />}
              </View>
              <Text style={styles.companyName}>{job.company}</Text>
            </View>
          </View>

          {job.urgency === 'urgent' && (
            <View style={styles.urgentBadge}>
              <Zap size={16} color="white" />
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>

        {/* Job Stats */}
        <View style={styles.jobStats}>
          <View style={styles.statItem}>
            <DollarSign size={16} color="#10B981" />
            <Text style={styles.statValue}>{job.pay}</Text>
            <Text style={styles.statLabel}>Pay Rate</Text>
          </View>
          
          <View style={styles.statItem}>
            <Clock size={16} color="#F59E0B" />
            <Text style={styles.statValue}>{job.duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          
          <View style={styles.statItem}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.statValue}>{job.location}</Text>
            <Text style={styles.statLabel}>Location</Text>
          </View>
          
          <View style={styles.statItem}>
            <Users size={16} color="#8B5CF6" />
            <Text style={styles.statValue}>{job.applicants}</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </View>
        </View>

        {/* Company Rating */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingRow}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{job.rating}</Text>
            <Text style={styles.ratingLabel}>Company Rating</Text>
          </View>
          <Text style={styles.postedTime}>Posted {job.postedTime}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {job.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements?.map((requirement, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{requirement}</Text>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {job.benefits?.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <Award size={16} color="#10B981" />
              <Text style={styles.listText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Company Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactContainer}>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleContact('phone')}
            >
              <Phone size={20} color="#2563EB" />
              <Text style={styles.contactText}>Call Company</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleContact('email')}
            >
              <Mail size={20} color="#10B981" />
              <Text style={styles.contactText}>Send Email</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleContact('website')}
            >
              <Globe size={20} color="#F59E0B" />
              <Text style={styles.contactText}>Visit Website</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApply}
          disabled={applying}
        >
          <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            style={styles.applyGradient}
          >
            {applying ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.applyText}>Apply Now</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  jobHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  companyInitial: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  companyDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  urgentText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  jobStats: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  ratingSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  postedTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
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
  },
  skillText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactItem: {
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
}); 