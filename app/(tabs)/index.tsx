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
  Animated,
  Modal,
  KeyboardAvoidingView,
  Dimensions
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
  // Construction
  {
    id: '1',
    title: 'Construction Labourer',
    company: 'Maple Construction',
    location: 'Toronto, ON',
    pay: '$22/hr',
    duration: 'Full-time',
    skills: ['Physical Labour', 'Teamwork', 'Safety'],
    postedTime: '10 min ago',
    urgency: 'urgent',
    rating: 4.5,
    applicants: 5,
    verified: true,
    category: 'Construction',
    description: 'Assist with various construction site tasks including material handling and site cleanup.',
    requirements: ['Physically fit', 'CSA-approved boots', 'Punctuality'],
    benefits: ['Health benefits', 'Overtime pay', 'On-site training']
  },
  {
    id: '2',
    title: 'General Labourer',
    company: 'Urban Build Co.',
    location: 'Edmonton, AB',
    pay: '$21/hr',
    duration: 'Part-time',
    skills: ['Lifting', 'Demolition', 'Teamwork'],
    postedTime: '1 hour ago',
    urgency: 'normal',
    rating: 4.2,
    applicants: 3,
    verified: true,
    category: 'Construction',
    description: 'Support construction crews with demolition, cleanup, and material transport.',
    requirements: ['Able to lift 50 lbs', 'Steel-toe boots', 'Team player'],
    benefits: ['Flexible shifts', 'Paid breaks', 'Safety gear provided']
  },
  {
    id: '3',
    title: 'Site Cleaner',
    company: 'BuildRight',
    location: 'Calgary, AB',
    pay: '$20/hr',
    duration: 'Flexible',
    skills: ['Cleaning', 'Organization', 'Safety'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.0,
    applicants: 2,
    verified: true,
    category: 'Construction',
    description: 'Keep construction sites clean and organized for safety and efficiency.',
    requirements: ['Attention to detail', 'Safety awareness', 'Reliable'],
    benefits: ['On-site training', 'Flexible hours', 'Team environment']
  },
  // Warehouse
  {
    id: '4',
    title: 'Warehouse Associate',
    company: 'Great North Logistics',
    location: 'Mississauga, ON',
    pay: '$19/hr',
    duration: 'Part-time',
    skills: ['Inventory', 'Forklift', 'Organization'],
    postedTime: '30 min ago',
    urgency: 'normal',
    rating: 4.2,
    applicants: 8,
    verified: true,
    category: 'Warehouse',
    description: 'Pick, pack, and ship orders in a busy distribution centre.',
    requirements: ['Attention to detail', 'Forklift license (asset)', 'Able to lift 50 lbs'],
    benefits: ['Flexible shifts', 'Employee discount', 'Paid breaks']
  },
  {
    id: '5',
    title: 'Order Picker',
    company: 'LogiPro',
    location: 'Vancouver, BC',
    pay: '$18/hr',
    duration: 'Evenings',
    skills: ['Picking', 'Packing', 'Accuracy'],
    postedTime: '1 hour ago',
    urgency: 'urgent',
    rating: 4.3,
    applicants: 4,
    verified: true,
    category: 'Warehouse',
    description: 'Pick and pack orders for shipment in a fast-paced warehouse.',
    requirements: ['Fast learner', 'Attention to detail', 'Able to stand for long periods'],
    benefits: ['Evening premium', 'Team environment', 'On-site parking']
  },
  {
    id: '6',
    title: 'Shipping Clerk',
    company: 'Express Freight',
    location: 'Winnipeg, MB',
    pay: '$17/hr',
    duration: 'Full-time',
    skills: ['Shipping', 'Data Entry', 'Organization'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.1,
    applicants: 2,
    verified: true,
    category: 'Warehouse',
    description: 'Prepare shipments, process paperwork, and track inventory.',
    requirements: ['Basic computer skills', 'Organized', 'Reliable'],
    benefits: ['Health benefits', 'Paid vacation', 'Casual dress']
  },
  // Janitorial
  {
    id: '7',
    title: 'Janitor',
    company: 'CleanSweep Services',
    location: 'Vancouver, BC',
    pay: '$18/hr',
    duration: 'Evenings',
    skills: ['Cleaning', 'Reliability', 'Time Management'],
    postedTime: '1 hour ago',
    urgency: 'normal',
    rating: 4.7,
    applicants: 3,
    verified: true,
    category: 'Janitorial',
    description: 'Clean offices and common areas in a commercial building.',
    requirements: ['Experience preferred', 'Able to work independently', 'Attention to detail'],
    benefits: ['Uniform provided', 'Transit accessible', 'Health benefits']
  },
  {
    id: '8',
    title: 'Custodian',
    company: 'Sparkle Clean',
    location: 'Ottawa, ON',
    pay: '$17/hr',
    duration: 'Night shifts',
    skills: ['Cleaning', 'Floor Care', 'Reliability'],
    postedTime: '2 hours ago',
    urgency: 'urgent',
    rating: 4.4,
    applicants: 2,
    verified: true,
    category: 'Janitorial',
    description: 'Maintain cleanliness in a school building, including floors and restrooms.',
    requirements: ['Able to work nights', 'Attention to detail', 'Reliable'],
    benefits: ['Night premium', 'Paid training', 'Health benefits']
  },
  {
    id: '9',
    title: 'Building Cleaner',
    company: 'Downtown Janitorial',
    location: 'Toronto, ON',
    pay: '$18/hr',
    duration: 'Part-time',
    skills: ['Cleaning', 'Organization', 'Teamwork'],
    postedTime: '3 hours ago',
    urgency: 'normal',
    rating: 4.2,
    applicants: 1,
    verified: true,
    category: 'Janitorial',
    description: 'Clean hallways, lobbies, and restrooms in a commercial building.',
    requirements: ['Team player', 'Attention to detail', 'Punctuality'],
    benefits: ['Flexible hours', 'Transit accessible', 'Paid breaks']
  },
  // Delivery
  {
    id: '10',
    title: 'Delivery Driver',
    company: 'True North Couriers',
    location: 'Calgary, AB',
    pay: '$21/hr',
    duration: 'Full-time',
    skills: ['Driving', 'Navigation', 'Customer Service'],
    postedTime: '2 hours ago',
    urgency: 'urgent',
    rating: 4.3,
    applicants: 6,
    verified: true,
    category: 'Delivery',
    description: 'Deliver packages to homes and businesses using a company vehicle.',
    requirements: ['Valid G license', 'Clean driving record', 'Good communication'],
    benefits: ['Fuel card', 'Paid training', 'Tips']
  },
  {
    id: '11',
    title: 'Food Delivery Cyclist',
    company: 'QuickEats',
    location: 'Montreal, QC',
    pay: '$17/hr + tips',
    duration: 'Flexible',
    skills: ['Cycling', 'Navigation', 'Customer Service'],
    postedTime: '1 hour ago',
    urgency: 'normal',
    rating: 4.5,
    applicants: 4,
    verified: true,
    category: 'Delivery',
    description: 'Deliver food orders by bicycle in downtown Montreal.',
    requirements: ['Own a bike', 'Smartphone', 'Friendly attitude'],
    benefits: ['Flexible hours', 'Keep 100% of tips', 'Outdoor work']
  },
  {
    id: '12',
    title: 'Grocery Delivery Helper',
    company: 'FreshCart',
    location: 'Ottawa, ON',
    pay: '$18/hr',
    duration: 'Part-time',
    skills: ['Lifting', 'Customer Service', 'Navigation'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.1,
    applicants: 2,
    verified: true,
    category: 'Delivery',
    description: 'Assist with grocery deliveries to homes and apartments.',
    requirements: ['Able to lift 30 lbs', 'Friendly', 'Punctual'],
    benefits: ['Flexible schedule', 'Tips', 'Team environment']
  },
  // Retail
  {
    id: '13',
    title: 'Retail Cashier',
    company: 'Hudson Market',
    location: 'Ottawa, ON',
    pay: '$17/hr',
    duration: 'Part-time',
    skills: ['Cash Handling', 'Customer Service', 'POS'],
    postedTime: '3 hours ago',
    urgency: 'normal',
    rating: 4.1,
    applicants: 10,
    verified: true,
    category: 'Retail',
    description: 'Operate cash register and assist customers in a grocery store.',
    requirements: ['Friendly attitude', 'Basic math', 'Weekend availability'],
    benefits: ['Store discount', 'Flexible schedule', 'Paid breaks']
  },
  {
    id: '14',
    title: 'Grocery Stocker',
    company: 'SuperMart',
    location: 'Toronto, ON',
    pay: '$16/hr',
    duration: 'Evenings',
    skills: ['Stocking', 'Lifting', 'Organization'],
    postedTime: '1 hour ago',
    urgency: 'urgent',
    rating: 4.0,
    applicants: 3,
    verified: true,
    category: 'Retail',
    description: 'Stock shelves and assist customers in a busy grocery store.',
    requirements: ['Able to lift 30 lbs', 'Attention to detail', 'Team player'],
    benefits: ['Evening premium', 'Employee discount', 'Paid breaks']
  },
  {
    id: '15',
    title: 'Store Greeter',
    company: 'ValueMart',
    location: 'Calgary, AB',
    pay: '$15/hr',
    duration: 'Part-time',
    skills: ['Greeting', 'Customer Service', 'Communication'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.2,
    applicants: 2,
    verified: true,
    category: 'Retail',
    description: 'Welcome customers and assist with directions and questions.',
    requirements: ['Friendly', 'Outgoing', 'Reliable'],
    benefits: ['Flexible hours', 'Team environment', 'Paid breaks']
  },
  // Food Service
  {
    id: '16',
    title: 'Food Service Worker',
    company: 'Timber Café',
    location: 'Edmonton, AB',
    pay: '$16/hr',
    duration: 'Shifts',
    skills: ['Food Prep', 'Sanitation', 'Teamwork'],
    postedTime: '4 hours ago',
    urgency: 'normal',
    rating: 4.0,
    applicants: 7,
    verified: true,
    category: 'Food Service',
    description: 'Prepare and serve food in a fast-paced café environment.',
    requirements: ['Food safety certificate', 'Positive attitude', 'Able to stand for long periods'],
    benefits: ['Free meals', 'Tips', 'Flexible hours']
  },
  {
    id: '17',
    title: 'Barista',
    company: 'Maple Café',
    location: 'Toronto, ON',
    pay: '$17/hr + tips',
    duration: 'Part-time',
    skills: ['Coffee Making', 'Customer Service', 'POS'],
    postedTime: '2 hours ago',
    urgency: 'urgent',
    rating: 4.5,
    applicants: 5,
    verified: true,
    category: 'Food Service',
    description: 'Prepare coffee and espresso drinks, serve pastries, and provide excellent customer service.',
    requirements: ['Friendly', 'Quick learner', 'Able to multitask'],
    benefits: ['Free coffee', 'Flexible shifts', 'Tips']
  },
  {
    id: '18',
    title: 'Dishwasher',
    company: 'Urban Eats',
    location: 'Vancouver, BC',
    pay: '$15/hr',
    duration: 'Evenings',
    skills: ['Dishwashing', 'Sanitation', 'Teamwork'],
    postedTime: '1 hour ago',
    urgency: 'normal',
    rating: 4.1,
    applicants: 2,
    verified: true,
    category: 'Food Service',
    description: 'Wash dishes and kitchen equipment in a busy restaurant.',
    requirements: ['Able to stand for long periods', 'Team player', 'Attention to detail'],
    benefits: ['Staff meals', 'Flexible hours', 'Paid breaks']
  },
  // Clerical
  {
    id: '19',
    title: 'Receptionist',
    company: 'Maple Medical Clinic',
    location: 'Montreal, QC',
    pay: '$20/hr',
    duration: 'Full-time',
    skills: ['Clerical', 'Phone Etiquette', 'Organization'],
    postedTime: '5 hours ago',
    urgency: 'normal',
    rating: 4.6,
    applicants: 4,
    verified: true,
    category: 'Clerical',
    description: 'Greet patients, answer phones, and schedule appointments.',
    requirements: ['Bilingual (EN/FR) preferred', 'Computer skills', 'Professional demeanor'],
    benefits: ['Health benefits', 'Paid vacation', 'Transit pass']
  },
  {
    id: '20',
    title: 'Office Clerk',
    company: 'TrueLeaf Accounting',
    location: 'Winnipeg, MB',
    pay: '$18/hr',
    duration: 'Full-time',
    skills: ['Data Entry', 'Filing', 'Microsoft Office'],
    postedTime: '6 hours ago',
    urgency: 'normal',
    rating: 4.2,
    applicants: 5,
    verified: true,
    category: 'Clerical',
    description: 'Assist with data entry, filing, and general office duties.',
    requirements: ['Attention to detail', 'Typing 40+ wpm', 'Team player'],
    benefits: ['Dental plan', 'Casual dress', 'On-site parking']
  },
  {
    id: '21',
    title: 'Data Entry Assistant',
    company: 'ClerkPro',
    location: 'Halifax, NS',
    pay: '$17/hr',
    duration: 'Part-time',
    skills: ['Data Entry', 'Accuracy', 'Organization'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.0,
    applicants: 2,
    verified: true,
    category: 'Clerical',
    description: 'Enter and verify data for a busy office. Flexible hours for students.',
    requirements: ['Fast typing', 'Attention to detail', 'Reliable'],
    benefits: ['Flexible schedule', 'Remote option', 'Paid breaks']
  },
  // Security
  {
    id: '22',
    title: 'Security Guard',
    company: 'Northern Shield Security',
    location: 'Halifax, NS',
    pay: '$20/hr',
    duration: 'Night shifts',
    skills: ['Security', 'Observation', 'Reporting'],
    postedTime: '7 hours ago',
    urgency: 'urgent',
    rating: 4.4,
    applicants: 2,
    verified: true,
    category: 'Security',
    description: 'Monitor premises and ensure safety at a commercial property.',
    requirements: ['Security license', 'Clear background check', 'Good communication'],
    benefits: ['Uniform provided', 'Paid training', 'Shift premium']
  },
  {
    id: '23',
    title: 'Event Security',
    company: 'SafeEvents',
    location: 'Toronto, ON',
    pay: '$19/hr',
    duration: 'Event-based',
    skills: ['Security', 'Crowd Control', 'Customer Service'],
    postedTime: '1 day ago',
    urgency: 'normal',
    rating: 4.3,
    applicants: 3,
    verified: true,
    category: 'Security',
    description: 'Provide security and crowd control at concerts and events.',
    requirements: ['Security license', 'Friendly', 'Able to stand for long periods'],
    benefits: ['Event tickets', 'Flexible hours', 'Team environment']
  },
  {
    id: '24',
    title: 'Mall Security Officer',
    company: 'MallSafe',
    location: 'Mississauga, ON',
    pay: '$18/hr',
    duration: 'Shifts',
    skills: ['Security', 'Patrolling', 'Reporting'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.1,
    applicants: 2,
    verified: true,
    category: 'Security',
    description: 'Patrol mall property and assist customers as needed.',
    requirements: ['Security license', 'Good communication', 'Reliable'],
    benefits: ['Uniform provided', 'Paid breaks', 'Transit accessible']
  },
  // Hospitality
  {
    id: '25',
    title: 'Hotel Housekeeper',
    company: 'Pacific Inn',
    location: 'Victoria, BC',
    pay: '$17/hr',
    duration: 'Day shifts',
    skills: ['Cleaning', 'Efficiency', 'Reliability'],
    postedTime: '8 hours ago',
    urgency: 'normal',
    rating: 4.3,
    applicants: 6,
    verified: true,
    category: 'Hospitality',
    description: 'Clean guest rooms and public areas in a busy hotel.',
    requirements: ['Experience an asset', 'Able to lift 30 lbs', 'Attention to detail'],
    benefits: ['Staff meals', 'Uniform provided', 'Tips']
  },
  {
    id: '26',
    title: 'Front Desk Clerk',
    company: 'Harbour Hotel',
    location: 'Halifax, NS',
    pay: '$18/hr',
    duration: 'Full-time',
    skills: ['Reception', 'Customer Service', 'Organization'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.4,
    applicants: 3,
    verified: true,
    category: 'Hospitality',
    description: 'Check in guests, answer phones, and assist with guest needs.',
    requirements: ['Friendly', 'Organized', 'Computer skills'],
    benefits: ['Hotel discounts', 'Paid vacation', 'Health benefits']
  },
  {
    id: '27',
    title: 'Banquet Server',
    company: 'Royal Banquet Hall',
    location: 'Toronto, ON',
    pay: '$16/hr + tips',
    duration: 'Event-based',
    skills: ['Serving', 'Teamwork', 'Customer Service'],
    postedTime: '1 day ago',
    urgency: 'urgent',
    rating: 4.2,
    applicants: 4,
    verified: true,
    category: 'Hospitality',
    description: 'Serve food and beverages at banquets and special events.',
    requirements: ['Friendly', 'Able to stand for long periods', 'Team player'],
    benefits: ['Event meals', 'Tips', 'Flexible hours']
  },
  // Landscaping
  {
    id: '28',
    title: 'Landscaping Assistant',
    company: 'GreenScape Pros',
    location: 'Brampton, ON',
    pay: '$18/hr',
    duration: 'Seasonal',
    skills: ['Landscaping', 'Outdoor Work', 'Teamwork'],
    postedTime: '1 day ago',
    urgency: 'normal',
    rating: 4.1,
    applicants: 4,
    verified: true,
    category: 'Landscaping',
    description: 'Assist with lawn care, planting, and outdoor maintenance.',
    requirements: ['Able to work outdoors', 'Physically fit', 'Team player'],
    benefits: ['Seasonal bonus', 'Outdoor work', 'Flexible schedule']
  },
  {
    id: '29',
    title: 'Gardener',
    company: 'City Parks',
    location: 'Ottawa, ON',
    pay: '$17/hr',
    duration: 'Part-time',
    skills: ['Gardening', 'Plant Care', 'Teamwork'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.3,
    applicants: 2,
    verified: true,
    category: 'Landscaping',
    description: 'Maintain city parks and gardens, including planting and weeding.',
    requirements: ['Enjoys outdoor work', 'Attention to detail', 'Reliable'],
    benefits: ['Flexible hours', 'Outdoor work', 'Team environment']
  },
  {
    id: '30',
    title: 'Groundskeeper',
    company: 'Golf Greens',
    location: 'Vancouver, BC',
    pay: '$18/hr',
    duration: 'Early mornings',
    skills: ['Groundskeeping', 'Mowing', 'Maintenance'],
    postedTime: '1 hour ago',
    urgency: 'urgent',
    rating: 4.2,
    applicants: 3,
    verified: true,
    category: 'Landscaping',
    description: 'Maintain golf course grounds, mow lawns, and trim hedges.',
    requirements: ['Early riser', 'Physically fit', 'Attention to detail'],
    benefits: ['Golf discounts', 'Outdoor work', 'Paid breaks']
  },
  // Maintenance
  {
    id: '31',
    title: 'Maintenance Helper',
    company: 'City Property Services',
    location: 'Hamilton, ON',
    pay: '$20/hr',
    duration: 'Full-time',
    skills: ['Maintenance', 'Repairs', 'Tools'],
    postedTime: '2 days ago',
    urgency: 'normal',
    rating: 4.0,
    applicants: 3,
    verified: true,
    category: 'Maintenance',
    description: 'Assist with building maintenance and minor repairs.',
    requirements: ['Basic tool knowledge', 'Problem solving', 'Reliability'],
    benefits: ['On-the-job training', 'Health benefits', 'Paid holidays']
  },
  {
    id: '32',
    title: 'Handyman Assistant',
    company: 'FixIt Pros',
    location: 'Toronto, ON',
    pay: '$19/hr',
    duration: 'Flexible',
    skills: ['Repairs', 'Painting', 'Teamwork'],
    postedTime: '1 hour ago',
    urgency: 'urgent',
    rating: 4.1,
    applicants: 2,
    verified: true,
    category: 'Maintenance',
    description: 'Assist with minor repairs, painting, and general maintenance tasks.',
    requirements: ['Quick learner', 'Reliable', 'Team player'],
    benefits: ['Flexible hours', 'Paid breaks', 'On-the-job training']
  },
  {
    id: '33',
    title: 'Building Maintenance',
    company: 'Downtown Realty',
    location: 'Vancouver, BC',
    pay: '$20/hr',
    duration: 'Full-time',
    skills: ['Maintenance', 'Cleaning', 'Repairs'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.2,
    applicants: 2,
    verified: true,
    category: 'Maintenance',
    description: 'Maintain building facilities, perform repairs, and keep common areas clean.',
    requirements: ['Experience preferred', 'Attention to detail', 'Reliable'],
    benefits: ['Health benefits', 'Paid vacation', 'Team environment']
  },
  // Moving
  {
    id: '34',
    title: 'Mover',
    company: 'True North Movers',
    location: 'Surrey, BC',
    pay: '$19/hr',
    duration: 'Part-time',
    skills: ['Lifting', 'Teamwork', 'Customer Service'],
    postedTime: '2 days ago',
    urgency: 'urgent',
    rating: 4.2,
    applicants: 5,
    verified: true,
    category: 'Moving',
    description: 'Help customers move furniture and boxes safely and efficiently.',
    requirements: ['Able to lift 50 lbs', 'Friendly attitude', 'Punctuality'],
    benefits: ['Tips', 'Flexible hours', 'Team environment']
  },
  {
    id: '35',
    title: 'Moving Helper',
    company: 'MoveIt',
    location: 'Montreal, QC',
    pay: '$18/hr',
    duration: 'Flexible',
    skills: ['Lifting', 'Packing', 'Teamwork'],
    postedTime: '1 hour ago',
    urgency: 'normal',
    rating: 4.0,
    applicants: 2,
    verified: true,
    category: 'Moving',
    description: 'Assist with packing, loading, and unloading for residential moves.',
    requirements: ['Physically fit', 'Team player', 'Reliable'],
    benefits: ['Flexible schedule', 'Tips', 'Paid breaks']
  },
  {
    id: '36',
    title: 'Student Mover',
    company: 'Campus Moves',
    location: 'Waterloo, ON',
    pay: '$17/hr',
    duration: 'Weekends',
    skills: ['Lifting', 'Customer Service', 'Teamwork'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.3,
    applicants: 3,
    verified: true,
    category: 'Moving',
    description: 'Help students move in and out of campus housing. Weekend work, great for students.',
    requirements: ['Able to lift 40 lbs', 'Friendly', 'Punctual'],
    benefits: ['Weekend work', 'Tips', 'Team environment']
  },
  // Farm Work
  {
    id: '37',
    title: 'Farm Helper',
    company: 'Sunny Fields Farm',
    location: 'Guelph, ON',
    pay: '$17/hr',
    duration: 'Seasonal',
    skills: ['Farm Work', 'Animal Care', 'Harvesting'],
    postedTime: '3 days ago',
    urgency: 'normal',
    rating: 4.3,
    applicants: 2,
    verified: true,
    category: 'Farm Work',
    description: 'Assist with planting, harvesting, and animal care on a family farm.',
    requirements: ['Enjoys outdoor work', 'Physically fit', 'Team player'],
    benefits: ['Fresh produce', 'Flexible schedule', 'Outdoor work']
  },
  {
    id: '38',
    title: 'Greenhouse Worker',
    company: 'GreenLeaf Farms',
    location: 'Leamington, ON',
    pay: '$16/hr',
    duration: 'Full-time',
    skills: ['Plant Care', 'Harvesting', 'Teamwork'],
    postedTime: '1 hour ago',
    urgency: 'normal',
    rating: 4.1,
    applicants: 2,
    verified: true,
    category: 'Farm Work',
    description: 'Work in a greenhouse planting, watering, and harvesting crops.',
    requirements: ['Enjoys plants', 'Physically fit', 'Reliable'],
    benefits: ['Fresh produce', 'Team environment', 'Paid breaks']
  },
  {
    id: '39',
    title: 'Fruit Picker',
    company: 'Orchard Valley',
    location: 'Kelowna, BC',
    pay: '$15/hr + piecework',
    duration: 'Seasonal',
    skills: ['Picking', 'Lifting', 'Outdoor Work'],
    postedTime: '2 hours ago',
    urgency: 'urgent',
    rating: 4.0,
    applicants: 3,
    verified: true,
    category: 'Farm Work',
    description: 'Pick fruit in an orchard. Great summer job for students.',
    requirements: ['Able to work outdoors', 'Physically fit', 'Punctual'],
    benefits: ['Piecework bonus', 'Flexible schedule', 'Outdoor work']
  },
  // Event Staff
  {
    id: '40',
    title: 'Event Staff',
    company: 'Toronto Event Crew',
    location: 'Toronto, ON',
    pay: '$18/hr',
    duration: 'Event-based',
    skills: ['Event Setup', 'Customer Service', 'Teamwork'],
    postedTime: '3 days ago',
    urgency: 'urgent',
    rating: 4.5,
    applicants: 7,
    verified: true,
    category: 'Event Staff',
    description: 'Assist with event setup, guest services, and teardown for various events.',
    requirements: ['Weekend availability', 'Friendly attitude', 'Team player'],
    benefits: ['Event tickets', 'Networking', 'Flexible hours']
  },
  {
    id: '41',
    title: 'Concert Crew',
    company: 'LiveNation',
    location: 'Toronto, ON',
    pay: '$19/hr',
    duration: 'Event-based',
    skills: ['Stage Setup', 'Lifting', 'Teamwork'],
    postedTime: '1 hour ago',
    urgency: 'normal',
    rating: 4.2,
    applicants: 3,
    verified: true,
    category: 'Event Staff',
    description: 'Help set up and tear down concert stages and equipment.',
    requirements: ['Able to lift 40 lbs', 'Team player', 'Punctual'],
    benefits: ['Free concert entry', 'Team environment', 'Paid breaks']
  },
  {
    id: '42',
    title: 'Festival Helper',
    company: 'City Festivals',
    location: 'Montreal, QC',
    pay: '$17/hr',
    duration: 'Event-based',
    skills: ['Customer Service', 'Setup', 'Teamwork'],
    postedTime: '2 hours ago',
    urgency: 'urgent',
    rating: 4.3,
    applicants: 2,
    verified: true,
    category: 'Event Staff',
    description: 'Assist with festival setup, guest services, and cleanup.',
    requirements: ['Friendly', 'Able to work outdoors', 'Team player'],
    benefits: ['Festival tickets', 'Flexible hours', 'Networking']
  },
  // Parking
  {
    id: '43',
    title: 'Parking Attendant',
    company: 'Downtown Parking Co.',
    location: 'Ottawa, ON',
    pay: '$16/hr',
    duration: 'Shifts',
    skills: ['Customer Service', 'Cash Handling', 'Attention to Detail'],
    postedTime: '4 days ago',
    urgency: 'normal',
    rating: 4.0,
    applicants: 3,
    verified: true,
    category: 'Parking',
    description: 'Manage parking lot entry, assist customers, and handle payments.',
    requirements: ['Reliable', 'Good communication', 'Basic math'],
    benefits: ['Uniform provided', 'Paid breaks', 'Transit accessible']
  },
  {
    id: '44',
    title: 'Valet Attendant',
    company: 'ValetPro',
    location: 'Vancouver, BC',
    pay: '$17/hr + tips',
    duration: 'Evenings',
    skills: ['Driving', 'Customer Service', 'Organization'],
    postedTime: '1 hour ago',
    urgency: 'urgent',
    rating: 4.2,
    applicants: 2,
    verified: true,
    category: 'Parking',
    description: 'Park and retrieve vehicles for hotel and restaurant guests.',
    requirements: ['Valid driver’s license', 'Friendly', 'Reliable'],
    benefits: ['Tips', 'Flexible hours', 'Uniform provided']
  },
  {
    id: '45',
    title: 'Lot Attendant',
    company: 'AutoMall',
    location: 'Mississauga, ON',
    pay: '$15/hr',
    duration: 'Part-time',
    skills: ['Organization', 'Customer Service', 'Walking'],
    postedTime: '2 hours ago',
    urgency: 'normal',
    rating: 4.1,
    applicants: 1,
    verified: true,
    category: 'Parking',
    description: 'Monitor parking lots, assist customers, and keep lots clean.',
    requirements: ['Able to walk long distances', 'Friendly', 'Reliable'],
    benefits: ['Flexible hours', 'Paid breaks', 'Team environment']
  },
  // Amusement Park
  {
    id: '46',
    title: 'Ride Operator',
    company: 'Wonderland Amusements',
    location: 'Vaughan, ON',
    pay: '$17/hr',
    duration: 'Seasonal',
    skills: ['Safety', 'Customer Service', 'Attention to Detail'],
    postedTime: '5 days ago',
    urgency: 'normal',
    rating: 4.2,
    applicants: 4,
    verified: true,
    category: 'Amusement Park',
    description: 'Operate rides and ensure guest safety at a busy amusement park.',
    requirements: ['Safety focused', 'Friendly', 'Able to work weekends'],
    benefits: ['Free park entry', 'Staff meals', 'Flexible shifts']
  },
  {
    id: '47',
    title: 'Games Attendant',
    company: 'FunZone',
    location: 'Toronto, ON',
    pay: '$16/hr + tips',
    duration: 'Part-time',
    skills: ['Customer Service', 'Games', 'Cash Handling'],
    postedTime: '2 hours ago',
    urgency: 'urgent',
    rating: 4.1,
    applicants: 2,
    verified: true,
    category: 'Amusement Park',
    description: 'Run carnival games and assist guests at an amusement park.',
    requirements: ['Friendly', 'Outgoing', 'Reliable'],
    benefits: ['Tips', 'Flexible hours', 'Free park entry']
  },
  {
    id: '48',
    title: 'Food Stand Worker',
    company: 'Park Eats',
    location: 'Vaughan, ON',
    pay: '$15/hr + tips',
    duration: 'Seasonal',
    skills: ['Food Prep', 'Customer Service', 'Cash Handling'],
    postedTime: '1 hour ago',
    urgency: 'normal',
    rating: 4.0,
    applicants: 1,
    verified: true,
    category: 'Amusement Park',
    description: 'Serve food and drinks at amusement park food stands.',
    requirements: ['Friendly', 'Able to stand for long periods', 'Team player'],
    benefits: ['Free meals', 'Flexible hours', 'Tips']
  }
];

const categories = [
  { id: 'all', name: 'All', icon: Briefcase },
  { id: '1', name: 'Construction', icon: () => <Text>🚧</Text> },
  { id: '2', name: 'Warehouse', icon: () => <Text>📦</Text> },
  { id: '3', name: 'Janitorial', icon: () => <Text>🧹</Text> },
  { id: '4', name: 'Delivery', icon: () => <Text>🚚</Text> },
  { id: '5', name: 'Retail', icon: () => <Text>🛒</Text> },
  { id: '6', name: 'Food Service', icon: () => <Text>🍔</Text> },
  { id: '7', name: 'Clerical', icon: () => <Text>🗂️</Text> },
  { id: '8', name: 'Security', icon: () => <Text>🛡️</Text> },
  { id: '9', name: 'Hospitality', icon: () => <Text>🛏️</Text> },
  { id: '10', name: 'Landscaping', icon: () => <Text>🌳</Text> },
  { id: '11', name: 'Maintenance', icon: () => <Text>🔧</Text> },
  { id: '12', name: 'Moving', icon: () => <Text>🚚</Text> },
  { id: '13', name: 'Farm Work', icon: () => <Text>🌾</Text> },
  { id: '14', name: 'Event Staff', icon: () => <Text>🎪</Text> },
  { id: '15', name: 'Parking', icon: () => <Text>🅿️</Text> },
  { id: '16', name: 'Amusement Park', icon: () => <Text>🎢</Text> }
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

type JobForm = {
  title: string;
  company: string;
  location: string;
  pay: string;
  duration: string;
  skills: string;
  postedTime: string;
  urgency: 'urgent' | 'normal';
  rating: string;
  applicants: string;
  verified: boolean;
  category: string;
  description: string;
  requirements: string;
  benefits: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { showSuccess, showError, showInfo } = useToastContext();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Change selectedCategory to store the category name, not id
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
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [jobForm, setJobForm] = useState<JobForm>({
    title: '',
    company: '',
    location: '',
    pay: '',
    duration: '',
    skills: '',
    postedTime: '',
    urgency: 'normal',
    rating: '',
    applicants: '',
    verified: false,
    category: '',
    description: '',
    requirements: '',
    benefits: '',
  });
  const [jobFormErrors, setJobFormErrors] = useState<Partial<Record<keyof JobForm, string>>>({});
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      filtered = filtered.filter(job => 
        job.category.toLowerCase() === (categoryName || '').toLowerCase()
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
      setAppliedJobs(prev => [...prev, jobId]);
      setTimeout(() => {
        showSuccess('Application Submitted!', 'Your application has been sent successfully');
      }, 400); // after animation
    } catch (error) {
      showError('Application Failed', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryName = categories.find(c => c.id === categoryId)?.name || 'All';
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

  const validateJobForm = () => {
    const errors: any = {};
    if (!jobForm.title) errors.title = 'Title is required';
    if (!jobForm.company) errors.company = 'Company is required';
    if (!jobForm.location) errors.location = 'Location is required';
    if (!jobForm.pay) errors.pay = 'Pay is required';
    if (!jobForm.duration) errors.duration = 'Duration is required';
    if (!jobForm.skills) errors.skills = 'At least one skill is required';
    if (!jobForm.postedTime) errors.postedTime = 'Posted time is required';
    if (!jobForm.rating) errors.rating = 'Rating is required';
    if (!jobForm.applicants) errors.applicants = 'Applicants is required';
    if (!jobForm.category) errors.category = 'Category is required';
    if (!jobForm.description) errors.description = 'Description is required';
    if (!jobForm.requirements) errors.requirements = 'At least one requirement is required';
    if (!jobForm.benefits) errors.benefits = 'At least one benefit is required';
    return errors;
  };

  const handlePostJob = () => {
    const errors = validateJobForm();
    setJobFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const newJob = {
      id: (allJobs.length + 1).toString(),
      title: jobForm.title,
      company: jobForm.company,
      location: jobForm.location,
      pay: jobForm.pay,
      duration: jobForm.duration,
      skills: jobForm.skills.split(',').map(s => s.trim()),
      postedTime: jobForm.postedTime,
      urgency: jobForm.urgency as 'urgent' | 'normal',
      rating: parseFloat(jobForm.rating),
      applicants: parseInt(jobForm.applicants),
      verified: jobForm.verified,
      category: jobForm.category,
      description: jobForm.description,
      requirements: jobForm.requirements.split(',').map(s => s.trim()),
      benefits: jobForm.benefits.split(',').map(s => s.trim()),
    };
    setAllJobs([newJob, ...allJobs]);
    setShowPostJobModal(false);
    setJobForm({
      title: '', company: '', location: '', pay: '', duration: '', skills: '', postedTime: '', urgency: 'normal', rating: '', applicants: '', verified: false, category: '', description: '', requirements: '', benefits: ''
    });
    setJobFormErrors({});
    showSuccess('Job Posted!', 'Your job has been added to the listings.');
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

  // Add auth check and loading spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }
  if (!user) {
    router.replace('/auth/login');
    return null;
  }

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
              onPress={() => setShowPostJobModal(true)}
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
                  isApplied={appliedJobs.includes(job.id)}
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

      {/* Post Job Modal */}
      <Modal
        visible={showPostJobModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPostJobModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%', maxWidth: 420, maxHeight: Dimensions.get('window').height * 0.9 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Post a Job</Text>
              {([
                { key: 'title', label: 'Job Title', placeholder: 'e.g. Construction Labourer' },
                { key: 'company', label: 'Company', placeholder: 'e.g. Maple Construction' },
                { key: 'location', label: 'Location', placeholder: 'e.g. Toronto, ON' },
                { key: 'pay', label: 'Pay', placeholder: 'e.g. $22/hr' },
                { key: 'duration', label: 'Duration', placeholder: 'e.g. Full-time' },
                { key: 'skills', label: 'Skills (comma separated)', placeholder: 'e.g. Physical Labour, Teamwork' },
                { key: 'postedTime', label: 'Posted Time', placeholder: 'e.g. 1 min ago' },
                { key: 'urgency', label: 'Urgency (urgent/normal)', placeholder: 'e.g. urgent' },
                { key: 'rating', label: 'Rating (0-5)', placeholder: 'e.g. 4.5' },
                { key: 'applicants', label: 'Applicants', placeholder: 'e.g. 3' },
                { key: 'verified', label: 'Verified (true/false)', placeholder: 'e.g. true' },
                { key: 'category', label: 'Category', placeholder: 'e.g. Construction' },
                { key: 'description', label: 'Description', placeholder: 'Job description...' },
                { key: 'requirements', label: 'Requirements (comma separated)', placeholder: 'e.g. Physically fit, CSA-approved boots' },
                { key: 'benefits', label: 'Benefits (comma separated)', placeholder: 'e.g. Health benefits, Overtime pay' },
              ] as { key: keyof JobForm; label: string; placeholder: string }[]).map(field => (
                <View key={field.key} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: '600', marginBottom: 4 }}>{field.label}</Text>
                  {field.key === 'category' ? (
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: jobFormErrors[field.key] ? '#EF4444' : '#E5E7EB',
                        borderRadius: 8,
                        padding: 10,
                        minHeight: 40,
                        justifyContent: 'center',
                        backgroundColor: '#f9fafb'
                      }}
                      onPress={() => setShowCategoryPicker(true)}
                    >
                      <Text style={{ color: jobForm.category ? '#111827' : '#9CA3AF', fontSize: 15 }}>
                        {jobForm.category || 'Select a category'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      style={{ borderWidth: 1, borderColor: jobFormErrors[field.key] ? '#EF4444' : '#E5E7EB', borderRadius: 8, padding: 10, fontSize: 15 }}
                      placeholder={field.placeholder}
                      value={String(jobForm[field.key])}
                      onChangeText={text => setJobForm(f => ({ ...f, [field.key]: field.key === 'verified' ? (text === 'true') : text }))}
                      autoCapitalize="none"
                    />
                  )}
                  {jobFormErrors[field.key] && <Text style={{ color: '#EF4444', fontSize: 12 }}>{jobFormErrors[field.key]}</Text>}
                </View>
              ))}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <TouchableOpacity onPress={() => setShowPostJobModal(false)} style={{ padding: 12 }}>
                  <Text style={{ color: '#6B7280', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePostJob} style={{ backgroundColor: '#2563EB', padding: 12, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Post Job</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          activeOpacity={1}
          onPressOut={() => setShowCategoryPicker(false)}
        >
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            width: '80%',
            maxHeight: 400
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Select Category</Text>
            <ScrollView>
              {categories.filter(c => c.id !== 'all').map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee'
                  }}
                  onPress={() => {
                    setJobForm(f => ({ ...f, category: cat.name }));
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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