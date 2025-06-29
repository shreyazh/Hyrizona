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

// Extended mock jobs with more variety
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
  },
  // Additional jobs for load more functionality
  {
    id: '6',
    title: 'Mobile App Developer',
    company: 'AppWorks Studio',
    location: 'Innovation Hub, 4.2 km',
    pay: '$40/hr',
    duration: '3-6 weeks',
    skills: ['React Native', 'iOS', 'Android'],
    postedTime: '6 hours ago',
    urgency: 'urgent',
    rating: 4.9,
    applicants: 7,
    verified: true,
    category: 'Technology',
    description: 'Develop cross-platform mobile applications using React Native.',
    requirements: ['2+ years React Native', 'App Store experience', 'UI/UX skills'],
    benefits: ['Remote work', 'Latest devices', 'App store revenue share']
  },
  {
    id: '7',
    title: 'Video Editor',
    company: 'Creative Media Lab',
    location: 'Arts District, 2.8 km',
    pay: '$28/hr',
    duration: '1-3 weeks',
    skills: ['Premiere Pro', 'After Effects', 'Motion Graphics'],
    postedTime: '8 hours ago',
    urgency: 'normal',
    rating: 4.4,
    applicants: 9,
    verified: true,
    category: 'Design',
    description: 'Create compelling video content for social media and marketing campaigns.',
    requirements: ['Video editing experience', 'Adobe Creative Suite', 'Portfolio'],
    benefits: ['Creative freedom', 'Equipment provided', 'Flexible deadlines']
  },
  {
    id: '8',
    title: 'Data Analyst',
    company: 'Analytics Corp',
    location: 'Financial District, 3.1 km',
    pay: '$32/hr',
    duration: '2-4 weeks',
    skills: ['Excel', 'SQL', 'Python'],
    postedTime: '10 hours ago',
    urgency: 'normal',
    rating: 4.6,
    applicants: 11,
    verified: true,
    category: 'Technology',
    description: 'Analyze data and create insights for business decision making.',
    requirements: ['Data analysis experience', 'SQL knowledge', 'Statistical skills'],
    benefits: ['Professional development', 'Remote option', 'Competitive pay']
  },
  {
    id: '9',
    title: 'Customer Service Representative',
    company: 'Support Solutions',
    location: 'Downtown, 1.5 km',
    pay: '$16/hr',
    duration: 'Ongoing',
    skills: ['Communication', 'Problem Solving', 'Patience'],
    postedTime: '12 hours ago',
    urgency: 'urgent',
    rating: 4.3,
    applicants: 18,
    verified: false,
    category: 'Events',
    description: 'Provide excellent customer support through phone and email.',
    requirements: ['Customer service experience', 'Good communication', 'Computer skills'],
    benefits: ['Health benefits', 'Paid training', 'Career advancement']
  },
  {
    id: '10',
    title: 'SEO Specialist',
    company: 'Digital Growth Agency',
    location: 'Remote/Anywhere',
    pay: '$26/hr',
    duration: '1-2 months',
    skills: ['SEO', 'Google Analytics', 'Content Strategy'],
    postedTime: '1 day ago',
    urgency: 'normal',
    rating: 4.7,
    applicants: 6,
    verified: true,
    category: 'Marketing',
    description: 'Optimize websites for search engines and improve organic traffic.',
    requirements: ['SEO experience', 'Google Analytics', 'Content knowledge'],
    benefits: ['Remote work', 'Flexible hours', 'Performance bonuses']
  },
  {
    id: '11',
    title: 'UI/UX Designer',
    company: 'Design Studio Pro',
    location: 'Creative Quarter, 2.3 km',
    pay: '$30/hr',
    duration: '2-5 weeks',
    skills: ['Figma', 'User Research', 'Prototyping'],
    postedTime: '1 day ago',
    urgency: 'normal',
    rating: 4.8,
    applicants: 14,
    verified: true,
    category: 'Design',
    description: 'Create intuitive user interfaces and conduct user research for web and mobile apps.',
    requirements: ['UI/UX experience', 'Figma proficiency', 'Portfolio'],
    benefits: ['Creative environment', 'Latest tools', 'Career growth']
  },
  {
    id: '12',
    title: 'React Native Developer',
    company: 'Mobile Tech Solutions',
    location: 'Tech Park, 3.8 km',
    pay: '$45/hr',
    duration: '4-8 weeks',
    skills: ['React Native', 'JavaScript', 'Mobile Development'],
    postedTime: '1 day ago',
    urgency: 'urgent',
    rating: 4.9,
    applicants: 6,
    verified: true,
    category: 'Technology',
    description: 'Build cross-platform mobile applications using React Native.',
    requirements: ['2+ years React Native', 'Mobile development experience', 'Git'],
    benefits: ['Remote work', 'Latest devices', 'Competitive pay']
  },
  {
    id: '13',
    title: 'Content Marketing Specialist',
    company: 'Growth Marketing Co.',
    location: 'Business Center, 1.9 km',
    pay: '$24/hr',
    duration: 'Ongoing',
    skills: ['Content Marketing', 'SEO', 'Social Media'],
    postedTime: '2 days ago',
    urgency: 'normal',
    rating: 4.6,
    applicants: 11,
    verified: true,
    category: 'Marketing',
    description: 'Develop and execute content marketing strategies across multiple channels.',
    requirements: ['Content marketing experience', 'SEO knowledge', 'Analytics skills'],
    benefits: ['Flexible schedule', 'Performance bonuses', 'Remote option']
  },
  {
    id: '14',
    title: 'Technical Writer',
    company: 'TechDocs Inc.',
    location: 'Remote/Anywhere',
    pay: '$28/hr',
    duration: '2-6 weeks',
    skills: ['Technical Writing', 'Documentation', 'API Docs'],
    postedTime: '2 days ago',
    urgency: 'normal',
    rating: 4.7,
    applicants: 8,
    verified: true,
    category: 'Writing',
    description: 'Create technical documentation, user guides, and API documentation.',
    requirements: ['Technical writing experience', 'API knowledge', 'Clear communication'],
    benefits: ['Remote work', 'Flexible deadlines', 'Learning opportunities']
  },
  {
    id: '15',
    title: 'Sales Representative',
    company: 'SalesForce Pro',
    location: 'Downtown, 0.8 km',
    pay: '$20/hr + Commission',
    duration: 'Ongoing',
    skills: ['Sales', 'Communication', 'CRM'],
    postedTime: '2 days ago',
    urgency: 'urgent',
    rating: 4.4,
    applicants: 16,
    verified: true,
    category: 'Sales',
    description: 'Drive sales growth through customer acquisition and relationship building.',
    requirements: ['Sales experience', 'Excellent communication', 'CRM knowledge'],
    benefits: ['Commission structure', 'Career advancement', 'Training provided']
  },
  {
    id: '16',
    title: 'Frontend Developer',
    company: 'Web Solutions Ltd',
    location: 'Tech District, 2.7 km',
    pay: '$38/hr',
    duration: '3-6 weeks',
    skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
    postedTime: '3 days ago',
    urgency: 'normal',
    rating: 4.8,
    applicants: 9,
    verified: true,
    category: 'Technology',
    description: 'Build responsive and interactive user interfaces for web applications.',
    requirements: ['Frontend development experience', 'React/Vue knowledge', 'CSS skills'],
    benefits: ['Modern tech stack', 'Remote work', 'Professional development']
  },
  {
    id: '17',
    title: 'Brand Designer',
    company: 'Brand Identity Studio',
    location: 'Creative District, 1.6 km',
    pay: '$32/hr',
    duration: '2-4 weeks',
    skills: ['Branding', 'Logo Design', 'Visual Identity'],
    postedTime: '3 days ago',
    urgency: 'normal',
    rating: 4.9,
    applicants: 7,
    verified: true,
    category: 'Design',
    description: 'Create comprehensive brand identities including logos, guidelines, and assets.',
    requirements: ['Brand design experience', 'Portfolio required', 'Adobe Creative Suite'],
    benefits: ['Creative freedom', 'Portfolio building', 'Flexible deadlines']
  },
  {
    id: '18',
    title: 'Email Marketing Specialist',
    company: 'Email Marketing Pro',
    location: 'Remote/Anywhere',
    pay: '$22/hr',
    duration: '1-3 months',
    skills: ['Email Marketing', 'Automation', 'Analytics'],
    postedTime: '3 days ago',
    urgency: 'normal',
    rating: 4.5,
    applicants: 13,
    verified: false,
    category: 'Marketing',
    description: 'Develop and execute email marketing campaigns with automation.',
    requirements: ['Email marketing experience', 'Automation tools', 'Analytics skills'],
    benefits: ['Remote work', 'Flexible hours', 'Performance tracking']
  },
  {
    id: '19',
    title: 'Copywriter',
    company: 'Creative Copy Co.',
    location: 'Arts Quarter, 2.1 km',
    pay: '$26/hr',
    duration: '1-4 weeks',
    skills: ['Copywriting', 'Creative Writing', 'Marketing'],
    postedTime: '4 days ago',
    urgency: 'normal',
    rating: 4.7,
    applicants: 10,
    verified: true,
    category: 'Writing',
    description: 'Write compelling copy for advertisements, websites, and marketing materials.',
    requirements: ['Copywriting experience', 'Creative portfolio', 'Marketing knowledge'],
    benefits: ['Creative environment', 'Portfolio building', 'Flexible deadlines']
  },
  {
    id: '20',
    title: 'Customer Success Manager',
    company: 'Customer Success Hub',
    location: 'Business District, 1.4 km',
    pay: '$25/hr',
    duration: 'Ongoing',
    skills: ['Customer Success', 'Relationship Management', 'Analytics'],
    postedTime: '4 days ago',
    urgency: 'urgent',
    rating: 4.6,
    applicants: 12,
    verified: true,
    category: 'Customer Service',
    description: 'Ensure customer satisfaction and drive product adoption.',
    requirements: ['Customer success experience', 'Analytics skills', 'Communication'],
    benefits: ['Career growth', 'Performance bonuses', 'Health benefits']
  },
  {
    id: '21',
    title: 'Backend Developer',
    company: 'Server Solutions',
    location: 'Tech Hub, 3.2 km',
    pay: '$42/hr',
    duration: '4-8 weeks',
    skills: ['Node.js', 'Python', 'Database Design'],
    postedTime: '4 days ago',
    urgency: 'urgent',
    rating: 4.9,
    applicants: 5,
    verified: true,
    category: 'Technology',
    description: 'Build scalable backend systems and APIs for web applications.',
    requirements: ['Backend development experience', 'Database knowledge', 'API design'],
    benefits: ['Latest technologies', 'Remote work', 'Competitive pay']
  },
  {
    id: '22',
    title: 'Illustrator',
    company: 'Art Studio Creative',
    location: 'Creative Quarter, 1.8 km',
    pay: '$28/hr',
    duration: '1-3 weeks',
    skills: ['Illustration', 'Digital Art', 'Character Design'],
    postedTime: '5 days ago',
    urgency: 'normal',
    rating: 4.8,
    applicants: 8,
    verified: true,
    category: 'Design',
    description: 'Create custom illustrations and digital artwork for various projects.',
    requirements: ['Illustration experience', 'Digital art skills', 'Portfolio'],
    benefits: ['Creative freedom', 'Portfolio building', 'Flexible schedule']
  },
  {
    id: '23',
    title: 'PPC Specialist',
    company: 'Digital Ads Pro',
    location: 'Marketing District, 2.5 km',
    pay: '$24/hr',
    duration: '2-4 weeks',
    skills: ['Google Ads', 'Facebook Ads', 'Analytics'],
    postedTime: '5 days ago',
    urgency: 'normal',
    rating: 4.6,
    applicants: 11,
    verified: true,
    category: 'Marketing',
    description: 'Manage and optimize paid advertising campaigns across platforms.',
    requirements: ['PPC experience', 'Google/Facebook Ads', 'Analytics skills'],
    benefits: ['Performance bonuses', 'Remote option', 'Latest tools']
  },
  {
    id: '24',
    title: 'Blog Writer',
    company: 'Content Creation Hub',
    location: 'Remote/Anywhere',
    pay: '$20/hr',
    duration: 'Ongoing',
    skills: ['Blog Writing', 'SEO', 'Content Strategy'],
    postedTime: '5 days ago',
    urgency: 'normal',
    rating: 4.5,
    applicants: 15,
    verified: false,
    category: 'Writing',
    description: 'Write engaging blog posts and articles for various industries.',
    requirements: ['Blog writing experience', 'SEO knowledge', 'Research skills'],
    benefits: ['Remote work', 'Flexible deadlines', 'Portfolio building']
  },
  {
    id: '25',
    title: 'Help Desk Support',
    company: 'Tech Support Solutions',
    location: 'Downtown, 1.1 km',
    pay: '$18/hr',
    duration: 'Ongoing',
    skills: ['Technical Support', 'Problem Solving', 'Communication'],
    postedTime: '6 days ago',
    urgency: 'urgent',
    rating: 4.3,
    applicants: 19,
    verified: true,
    category: 'Customer Service',
    description: 'Provide technical support and troubleshooting for customers.',
    requirements: ['Technical knowledge', 'Problem-solving skills', 'Patience'],
    benefits: ['Training provided', 'Career advancement', 'Health benefits']
  },
  {
    id: '26',
    title: 'DevOps Engineer',
    company: 'Cloud Infrastructure Co.',
    location: 'Tech Park, 4.1 km',
    pay: '$48/hr',
    duration: '3-6 months',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    postedTime: '6 days ago',
    urgency: 'urgent',
    rating: 4.9,
    applicants: 4,
    verified: true,
    category: 'Technology',
    description: 'Manage cloud infrastructure and implement CI/CD pipelines.',
    requirements: ['DevOps experience', 'Cloud platforms', 'Automation skills'],
    benefits: ['Latest technologies', 'Remote work', 'Competitive pay']
  },
  {
    id: '27',
    title: 'Product Designer',
    company: 'Product Design Studio',
    location: 'Innovation District, 2.9 km',
    pay: '$35/hr',
    duration: '2-5 weeks',
    skills: ['Product Design', 'User Experience', 'Prototyping'],
    postedTime: '6 days ago',
    urgency: 'normal',
    rating: 4.8,
    applicants: 9,
    verified: true,
    category: 'Design',
    description: 'Design user-centered products and experiences.',
    requirements: ['Product design experience', 'UX knowledge', 'Portfolio'],
    benefits: ['Creative environment', 'Latest tools', 'Career growth']
  },
  {
    id: '28',
    title: 'Influencer Marketing Manager',
    company: 'Influence Marketing Co.',
    location: 'Marketing Hub, 2.2 km',
    pay: '$26/hr',
    duration: '1-2 months',
    skills: ['Influencer Marketing', 'Social Media', 'Campaign Management'],
    postedTime: '1 week ago',
    urgency: 'normal',
    rating: 4.6,
    applicants: 12,
    verified: true,
    category: 'Marketing',
    description: 'Manage influencer partnerships and social media campaigns.',
    requirements: ['Influencer marketing experience', 'Social media knowledge', 'Analytics'],
    benefits: ['Creative campaigns', 'Performance bonuses', 'Remote option']
  },
  {
    id: '29',
    title: 'Grant Writer',
    company: 'Nonprofit Solutions',
    location: 'Community Center, 1.7 km',
    pay: '$30/hr',
    duration: '2-4 weeks',
    skills: ['Grant Writing', 'Research', 'Proposal Writing'],
    postedTime: '1 week ago',
    urgency: 'normal',
    rating: 4.7,
    applicants: 7,
    verified: true,
    category: 'Writing',
    description: 'Write compelling grant proposals for nonprofit organizations.',
    requirements: ['Grant writing experience', 'Research skills', 'Nonprofit knowledge'],
    benefits: ['Meaningful work', 'Flexible deadlines', 'Portfolio building']
  },
  {
    id: '30',
    title: 'Account Manager',
    company: 'Client Relations Pro',
    location: 'Business District, 1.3 km',
    pay: '$28/hr + Commission',
    duration: 'Ongoing',
    skills: ['Account Management', 'Client Relations', 'Sales'],
    postedTime: '1 week ago',
    urgency: 'urgent',
    rating: 4.5,
    applicants: 14,
    verified: true,
    category: 'Sales',
    description: 'Manage client relationships and drive account growth.',
    requirements: ['Account management experience', 'Client relations', 'Sales skills'],
    benefits: ['Commission structure', 'Career advancement', 'Health benefits']
  },
  {
    id: '31',
    title: '3D Animator',
    company: 'Animation Studio Pro',
    location: 'Creative Quarter, 2.4 km',
    pay: '$36/hr',
    duration: '3-8 weeks',
    skills: ['3D Animation', 'Blender', 'Motion Graphics'],
    postedTime: '1 week ago',
    urgency: 'normal',
    rating: 4.8,
    applicants: 6,
    verified: true,
    category: 'Design',
    description: 'Create stunning 3D animations and motion graphics.',
    requirements: ['3D animation experience', 'Blender/Maya skills', 'Portfolio'],
    benefits: ['Creative environment', 'Latest software', 'Portfolio building']
  },
  {
    id: '32',
    title: 'Marketing Analyst',
    company: 'Data-Driven Marketing',
    location: 'Analytics District, 3.3 km',
    pay: '$34/hr',
    duration: '2-4 weeks',
    skills: ['Marketing Analytics', 'Data Analysis', 'Reporting'],
    postedTime: '1 week ago',
    urgency: 'normal',
    rating: 4.7,
    applicants: 8,
    verified: true,
    category: 'Marketing',
    description: 'Analyze marketing performance and provide data-driven insights.',
    requirements: ['Marketing analytics experience', 'Data analysis skills', 'Reporting'],
    benefits: ['Data-driven environment', 'Remote option', 'Professional development']
  },
  {
    id: '33',
    title: 'Script Writer',
    company: 'Media Production Co.',
    location: 'Entertainment District, 2.8 km',
    pay: '$32/hr',
    duration: '1-3 weeks',
    skills: ['Script Writing', 'Storytelling', 'Creative Writing'],
    postedTime: '1 week ago',
    urgency: 'normal',
    rating: 4.6,
    applicants: 10,
    verified: true,
    category: 'Writing',
    description: 'Write compelling scripts for videos, podcasts, and presentations.',
    requirements: ['Script writing experience', 'Storytelling skills', 'Portfolio'],
    benefits: ['Creative environment', 'Portfolio building', 'Flexible deadlines']
  },
  {
    id: '34',
    title: 'Technical Support Specialist',
    company: 'IT Support Solutions',
    location: 'Tech District, 2.6 km',
    pay: '$22/hr',
    duration: 'Ongoing',
    skills: ['Technical Support', 'IT Troubleshooting', 'Customer Service'],
    postedTime: '1 week ago',
    urgency: 'urgent',
    rating: 4.4,
    applicants: 16,
    verified: true,
    category: 'Customer Service',
    description: 'Provide technical support and IT troubleshooting services.',
    requirements: ['IT knowledge', 'Problem-solving skills', 'Customer service'],
    benefits: ['Training provided', 'Career advancement', 'Health benefits']
  },
  {
    id: '35',
    title: 'Full Stack Developer',
    company: 'Full Stack Solutions',
    location: 'Tech Hub, 3.7 km',
    pay: '$50/hr',
    duration: '4-10 weeks',
    skills: ['React', 'Node.js', 'Database', 'DevOps'],
    postedTime: '1 week ago',
    urgency: 'urgent',
    rating: 4.9,
    applicants: 3,
    verified: true,
    category: 'Technology',
    description: 'Develop complete web applications from frontend to backend.',
    requirements: ['Full stack experience', 'Modern frameworks', 'Database knowledge'],
    benefits: ['Latest technologies', 'Remote work', 'Competitive pay']
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>(mockJobs);
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(mockJobs.slice(0, 5));
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState('Ontario, CA');
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const jobsPerPage = 5;
  const [stats, setStats] = useState({
    nearbyJobs: 24,
    activeHirers: 156,
    totalEarnings: 0
  });

  // Initialize displayed jobs
  useEffect(() => {
    const initialJobs = allJobs.slice(0, jobsPerPage);
    setDisplayedJobs(initialJobs);
    setFilteredJobs(initialJobs);
  }, []);

  // Filter jobs based on search, category, and advanced filters
  const filterJobs = useCallback(() => {
    let filtered = allJobs;

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
    
    // Reset pagination when filters change
    setCurrentPage(1);
    const initialFilteredJobs = filtered.slice(0, jobsPerPage);
    setDisplayedJobs(initialFilteredJobs);
    setHasMoreJobs(filtered.length > jobsPerPage);
  }, [searchQuery, selectedCategory, currentFilters, allJobs]);

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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreJobs) return;

    setLoadingMore(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * jobsPerPage;
      const endIndex = startIndex + jobsPerPage;
      const newJobs = filteredJobs.slice(startIndex, endIndex);
      
      if (newJobs.length > 0) {
        setDisplayedJobs(prev => [...prev, ...newJobs]);
        setCurrentPage(nextPage);
        setHasMoreJobs(endIndex < filteredJobs.length);
        showSuccess('More Jobs Loaded!', `Loaded ${newJobs.length} more jobs`);
      } else {
        setHasMoreJobs(false);
        showInfo('No More Jobs', 'You\'ve reached the end of available jobs');
      }
    } catch (error) {
      showError('Load Failed', 'Failed to load more jobs');
    } finally {
      setLoadingMore(false);
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
              {displayedJobs.length > 0 && ` (${displayedJobs.length} of ${filteredJobs.length})`}
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
          
          {displayedJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No jobs found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <View style={styles.jobsList}>
              {displayedJobs.map((job) => (
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
        {hasMoreJobs && displayedJobs.length > 0 && (
          <TouchableOpacity 
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <View style={styles.loadMoreContent}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.loadMoreText}>Loading...</Text>
              </View>
            ) : (
              <Text style={styles.loadMoreText}>Load More Jobs</Text>
            )}
          </TouchableOpacity>
        )}

        {/* No More Jobs Indicator */}
        {!hasMoreJobs && displayedJobs.length > 0 && (
          <View style={styles.noMoreJobsContainer}>
            <Text style={styles.noMoreJobsText}>You've reached the end of available jobs</Text>
          </View>
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
  loadMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadMoreText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  noMoreJobsContainer: {
    margin: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  noMoreJobsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});