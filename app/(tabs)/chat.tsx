import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Dimensions,
  Animated,
  Modal,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  MoreHorizontal, 
  MessageCircle, 
  X, 
  Send,
  Phone,
  Video,
  Mail,
  Star,
  Archive,
  Trash2,
  Edit,
  Copy,
  Share2,
  Bell,
  BellOff,
  User,
  Calendar,
  MapPin,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  Filter,
  SortAsc,
  SortDesc,
  Pin,
  VolumeX,
  Shield,
  Flag
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const mockChats = [
  {
    id: '1',
    name: 'Shailaja',
    company: 'Maple Café',
    lastMessage: 'Your shift starts at 8am tomorrow!',
    timestamp: '2 min ago',
    unread: 2,
    jobTitle: 'Barista',
    isOnline: true,
    avatar: null,
    lastSeen: new Date(),
    isArchived: false,
    isPinned: true,
    isMuted: false,
    messageStatus: 'read',
    typing: false,
    priority: 'high',
    lastMessageTime: new Date(Date.now() - 120000),
    totalMessages: 45,
    unreadCount: 2,
    isVerified: true,
    rating: 4.8,
    responseTime: '2 min'
  },
  {
    id: '2',
    name: 'Anurag',
    company: 'True North Movers',
    lastMessage: 'Can you help with a move this weekend?',
    timestamp: '1 hour ago',
    unread: 0,
    jobTitle: 'Mover',
    isOnline: false,
    avatar: null,
    lastSeen: new Date(Date.now() - 3600000),
    isArchived: false,
    isPinned: false,
    isMuted: false,
    messageStatus: 'delivered',
    typing: false,
    priority: 'medium',
    lastMessageTime: new Date(Date.now() - 3600000),
    totalMessages: 23,
    unreadCount: 0,
    isVerified: true,
    rating: 4.6,
    responseTime: '1 hour'
  },
  {
    id: '3',
    name: 'Anubhav',
    company: 'CleanSweep Services',
    lastMessage: 'Please bring your ID for site access.',
    timestamp: 'Yesterday',
    unread: 1,
    jobTitle: 'Janitor',
    isOnline: true,
    avatar: null,
    lastSeen: new Date(Date.now() - 86400000),
    isArchived: false,
    isPinned: false,
    isMuted: false,
    messageStatus: 'sent',
    typing: true,
    priority: 'high',
    lastMessageTime: new Date(Date.now() - 86400000),
    totalMessages: 67,
    unreadCount: 1,
    isVerified: false,
    rating: 4.2,
    responseTime: '3 hours'
  },
  {
    id: '4',
    name: 'Praveen',
    company: 'Hudson Market',
    lastMessage: 'Can you cover a cashier shift on Friday?',
    timestamp: '2 days ago',
    unread: 0,
    jobTitle: 'Retail Cashier',
    isOnline: false,
    avatar: null,
    lastSeen: new Date(Date.now() - 172800000),
    isArchived: false,
    isPinned: false,
    isMuted: true,
    messageStatus: 'read',
    typing: false,
    priority: 'low',
    lastMessageTime: new Date(Date.now() - 172800000),
    totalMessages: 89,
    unreadCount: 0,
    isVerified: true,
    rating: 4.9,
    responseTime: '1 day'
  },
  {
    id: '5',
    name: 'Sanjeev',
    company: 'Great North Logistics',
    lastMessage: 'Warehouse orientation is at 9am.',
    timestamp: '2 days ago',
    unread: 0,
    jobTitle: 'Warehouse Associate',
    isOnline: false,
    avatar: null,
    lastSeen: new Date(Date.now() - 172800000),
    isArchived: false,
    isPinned: false,
    isMuted: false,
    messageStatus: 'read',
    typing: false,
    priority: 'medium',
    lastMessageTime: new Date(Date.now() - 172800000),
    totalMessages: 34,
    unreadCount: 0,
    isVerified: true,
    rating: 4.7,
    responseTime: '6 hours'
  },
  {
    id: '6',
    name: 'Sameet',
    company: 'Maple Construction',
    lastMessage: 'Bring your safety boots for tomorrow.',
    timestamp: '7 days ago',
    unread: 0,
    jobTitle: 'Construction Labourer',
    isOnline: false,
    avatar: null,
    lastSeen: new Date(Date.now() - 604800000),
    isArchived: true,
    isPinned: false,
    isMuted: false,
    messageStatus: 'read',
    typing: false,
    priority: 'low',
    lastMessageTime: new Date(Date.now() - 604800000),
    totalMessages: 156,
    unreadCount: 0,
    isVerified: false,
    rating: 4.1,
    responseTime: '2 days'
  }
];

export default function ChatScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chats, setChats] = useState(mockChats);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [filterOptions, setFilterOptions] = useState({
    onlineOnly: false,
    unreadOnly: false,
    verifiedOnly: false,
    highPriority: false
  });
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [chatAnalytics, setChatAnalytics] = useState({
    totalChats: 0,
    unreadMessages: 0,
    activeChats: 0,
    averageResponseTime: '2.5 hours'
  });

  // Animation refs
  const typingAnimation = useRef(new Animated.Value(0)).current;
  const selectionAnimation = useRef(new Animated.Value(0)).current;

  // Memoized tabs calculation with enhanced data
  const tabs = useMemo(() => [
    { 
      id: 'all', 
      label: 'All', 
      count: chats.filter(chat => !chat.isArchived).length,
      icon: MessageCircle
    },
    { 
      id: 'unread', 
      label: 'Unread', 
      count: chats.filter(chat => chat.unread > 0 && !chat.isArchived).length,
      icon: Bell
    },
    { 
      id: 'pinned', 
      label: 'Pinned', 
      count: chats.filter(chat => chat.isPinned && !chat.isArchived).length,
      icon: Pin
    },
    { 
      id: 'archived', 
      label: 'Archived', 
      count: chats.filter(chat => chat.isArchived).length,
      icon: Archive
    }
  ], [chats]);

  // Enhanced filtered chats with sorting and filtering
  const filteredChats = useMemo(() => {
    let filtered = chats;

    // Apply tab filters
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(chat => chat.unread > 0 && !chat.isArchived);
        break;
      case 'pinned':
        filtered = filtered.filter(chat => chat.isPinned && !chat.isArchived);
        break;
      case 'archived':
        filtered = filtered.filter(chat => chat.isArchived);
        break;
      default:
        filtered = filtered.filter(chat => !chat.isArchived);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply additional filters
    if (filterOptions.onlineOnly) {
      filtered = filtered.filter(chat => chat.isOnline);
    }
    if (filterOptions.unreadOnly) {
      filtered = filtered.filter(chat => chat.unread > 0);
    }
    if (filterOptions.verifiedOnly) {
      filtered = filtered.filter(chat => chat.isVerified);
    }
    if (filterOptions.highPriority) {
      filtered = filtered.filter(chat => chat.priority === 'high');
    }

    // Sort chats
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority':
          const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'unread':
          return b.unread - a.unread;
        default:
          return 0;
      }
    });

    return filtered;
  }, [chats, activeTab, searchQuery, filterOptions, sortBy]);

  // Update analytics
  useEffect(() => {
    setChatAnalytics({
      totalChats: chats.filter(chat => !chat.isArchived).length,
      unreadMessages: chats.reduce((sum, chat) => sum + chat.unread, 0),
      activeChats: chats.filter(chat => chat.isOnline).length,
      averageResponseTime: '2.5 hours'
    });
  }, [chats]);

  // Typing animation
  useEffect(() => {
    const typingChats = chats.filter(chat => chat.typing);
    if (typingChats.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [chats]);

  // Optimized functions with useCallback
  const getInitials = useCallback((name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }, []);

  const handleChatPress = useCallback((chatId: string) => {
    if (isSelectionMode) {
      setSelectedChats(prev => 
        prev.includes(chatId) 
          ? prev.filter(id => id !== chatId)
          : [...prev, chatId]
      );
    } else {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId ? { ...chat, unread: 0 } : chat
        )
      );
      router.push(`/chat-detail?id=${chatId}` as any);
    }
  }, [router, isSelectionMode]);

  const handleLongPress = useCallback((chatId: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedChats([chatId]);
      Animated.timing(selectionAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelectionMode]);

  const handleMenuPress = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    Alert.alert(
      'Chat Options',
      `Options for ${chat.name}`,
      [
        {
          text: chat.isPinned ? 'Unpin' : 'Pin',
          onPress: () => togglePinChat(chatId),
        },
        {
          text: chat.isMuted ? 'Unmute' : 'Mute',
          onPress: () => toggleMuteChat(chatId),
        },
        {
          text: chat.isArchived ? 'Unarchive' : 'Archive',
          onPress: () => toggleArchiveChat(chatId),
        },
        {
          text: 'Mark as Read',
          onPress: () => markAsRead(chatId),
          style: chat.unread > 0 ? 'default' : 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => confirmDeleteChat(chatId),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }, [chats]);

  const togglePinChat = useCallback((chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      )
    );
  }, []);

  const toggleMuteChat = useCallback((chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
      )
    );
  }, []);

  const toggleArchiveChat = useCallback((chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, isArchived: !chat.isArchived } : chat
      )
    );
  }, []);

  const markAsRead = useCallback((chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  }, []);

  const confirmDeleteChat = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete the conversation with ${chat?.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteChat(chatId),
        },
      ]
    );
  }, [chats]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
  }, []);

  const handleBulkAction = useCallback((action: string) => {
    switch (action) {
      case 'markRead':
        setChats(prevChats => 
          prevChats.map(chat => 
            selectedChats.includes(chat.id) ? { ...chat, unread: 0 } : chat
          )
        );
        break;
      case 'archive':
        setChats(prevChats => 
          prevChats.map(chat => 
            selectedChats.includes(chat.id) ? { ...chat, isArchived: true } : chat
          )
        );
        break;
      case 'delete':
        setChats(prevChats => 
          prevChats.filter(chat => !selectedChats.includes(chat.id))
        );
        break;
    }
    setSelectedChats([]);
    setIsSelectionMode(false);
    Animated.timing(selectionAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selectedChats]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, you would fetch new data here
    setRefreshing(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  }, [isSearchVisible]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchVisible(false);
  }, []);

  const getMessageStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'sent':
        return <Check size={12} color="#9CA3AF" />;
      case 'delivered':
        return <CheckCheck size={12} color="#9CA3AF" />;
      case 'read':
        return <CheckCheck size={12} color="#2563EB" />;
      default:
        return <Clock size={12} color="#9CA3AF" />;
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  }, []);

  // Enhanced render functions
  const renderChatItem = useCallback(({ item: chat }: { item: any }) => (
    <Animated.View style={[
      styles.chatItem,
      isSelectionMode && selectedChats.includes(chat.id) && {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
      }
    ]}>
      <TouchableOpacity
        style={styles.chatContent}
        onPress={() => handleChatPress(chat.id)}
        onLongPress={() => handleLongPress(chat.id)}
        activeOpacity={0.8}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(chat.name)}
            </Text>
          </View>
          {chat.isOnline && <View style={styles.onlineIndicator} />}
          {chat.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
          {chat.isPinned && (
            <View style={styles.pinIndicator}>
              <Pin size={10} color="#F59E0B" />
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <View style={styles.nameContainer}>
              <Text style={styles.chatName} numberOfLines={1}>
                {chat.name}
              </Text>
              {chat.isMuted && <VolumeX size={12} color="#9CA3AF" />}
            </View>
            <View style={styles.headerRight}>
              <View style={styles.priorityIndicator}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(chat.priority) }]} />
              </View>
              <Text style={styles.timestamp}>{chat.timestamp}</Text>
            </View>
          </View>
          
          <Text style={styles.jobTitle} numberOfLines={1}>
            {chat.jobTitle} • {chat.company}
          </Text>
          
          <View style={styles.messageRow}>
            <View style={styles.messageInfo}>
              {chat.typing ? (
                <Animated.Text 
                  style={[
                    styles.typingText,
                    { opacity: typingAnimation }
                  ]}
                >
                  typing...
                </Animated.Text>
              ) : (
                <>
                  <Text 
                    style={[
                      styles.lastMessage,
                      chat.unread > 0 && styles.unreadMessage
                    ]}
                    numberOfLines={1}
                  >
                    {chat.lastMessage}
                  </Text>
                  {getMessageStatusIcon(chat.messageStatus)}
                </>
              )}
            </View>
            
            <View style={styles.messageStats}>
              {chat.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>
                    {chat.unread > 99 ? '99+' : chat.unread}
                  </Text>
                </View>
              )}
              <Text style={styles.responseTime}>{chat.responseTime}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => handleMenuPress(chat.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreHorizontal size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  ), [handleChatPress, handleLongPress, handleMenuPress, getInitials, getMessageStatusIcon, getPriorityColor, isSelectionMode, selectedChats, typingAnimation]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <MessageCircle size={48} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No matching chats' : 'No messages yet'}
      </Text>
      <Text style={styles.emptyDescription}>
        {searchQuery 
          ? 'Try adjusting your search terms'
          : 'Start applying to jobs to connect with employers'
        }
      </Text>
      {searchQuery && (
        <TouchableOpacity 
          style={styles.clearSearchButton}
          onPress={clearSearch}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [searchQuery, clearSearch]);

  const renderQuickActions = useCallback(() => (
    <View style={styles.quickActionsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={styles.quickAction}>
          <Phone size={16} color="#2563EB" />
          <Text style={styles.quickActionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Video size={16} color="#2563EB" />
          <Text style={styles.quickActionText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Mail size={16} color="#2563EB" />
          <Text style={styles.quickActionText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Calendar size={16} color="#2563EB" />
          <Text style={styles.quickActionText}>Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  ), []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 88,
    offset: 88 * index,
    index,
  }), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {isSearchVisible ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity 
              style={styles.closeSearchButton}
              onPress={toggleSearch}
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Messages</Text>
              {chatAnalytics.unreadMessages > 0 && (
                <View style={styles.unreadIndicator}>
                  <Text style={styles.unreadIndicatorText}>
                    {chatAnalytics.unreadMessages}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={toggleSearch}
              >
                <Search size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Chat Analytics */}
      {!isSearchVisible && (
        <View style={styles.analyticsContainer}>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Total Chats</Text>
              <Text style={styles.analyticsValue}>{chatAnalytics.totalChats}</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Unread</Text>
              <Text style={styles.analyticsValue}>{chatAnalytics.unreadMessages}</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Online</Text>
              <Text style={styles.analyticsValue}>{chatAnalytics.activeChats}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      {!isSearchVisible && showQuickActions && renderQuickActions()}

      {/* Tabs */}
      {!isSearchVisible && (
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <tab.icon size={16} color={activeTab === tab.id ? "white" : "#6B7280"} />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={[
                  styles.tabBadge,
                  activeTab === tab.id && styles.activeTabBadge
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    activeTab === tab.id && styles.activeTabBadgeText
                  ]}>
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Selection Mode Actions */}
      {isSelectionMode && (
        <View style={styles.selectionActions}>
          <Text style={styles.selectionText}>
            {selectedChats.length} selected
          </Text>
          <View style={styles.selectionButtons}>
            <TouchableOpacity 
              style={styles.selectionButton}
              onPress={() => handleBulkAction('markRead')}
            >
              <Check size={16} color="#2563EB" />
              <Text style={styles.selectionButtonText}>Read</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.selectionButton}
              onPress={() => handleBulkAction('archive')}
            >
              <Archive size={16} color="#2563EB" />
              <Text style={styles.selectionButtonText}>Archive</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.selectionButton, styles.deleteButton]}
              onPress={() => handleBulkAction('delete')}
            >
              <Trash2 size={16} color="#EF4444" />
              <Text style={[styles.selectionButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        style={styles.chatList}
        contentContainerStyle={filteredChats.length === 0 && styles.emptyListContainer}
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters & Sort</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                {[
                  { id: 'recent', label: 'Most Recent', icon: SortDesc },
                  { id: 'name', label: 'Name', icon: SortAsc },
                  { id: 'priority', label: 'Priority', icon: AlertCircle },
                  { id: 'unread', label: 'Unread First', icon: Bell }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortOption,
                      sortBy === option.id && styles.activeSortOption
                    ]}
                    onPress={() => setSortBy(option.id)}
                  >
                    <option.icon size={16} color={sortBy === option.id ? "white" : "#6B7280"} />
                    <Text style={[
                      styles.sortOptionText,
                      sortBy === option.id && styles.activeSortOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Filters</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'onlineOnly', label: 'Online Only', icon: User },
                  { key: 'unreadOnly', label: 'Unread Only', icon: Bell },
                  { key: 'verifiedOnly', label: 'Verified Only', icon: Check },
                  { key: 'highPriority', label: 'High Priority', icon: AlertCircle }
                ].map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    style={[
                      styles.filterOption,
                      filterOptions[filter.key as keyof typeof filterOptions] && styles.activeFilterOption
                    ]}
                    onPress={() => setFilterOptions(prev => ({
                      ...prev,
                      [filter.key]: !prev[filter.key as keyof typeof filterOptions]
                    }))}
                  >
                    <filter.icon size={16} color={filterOptions[filter.key as keyof typeof filterOptions] ? "white" : "#6B7280"} />
                    <Text style={[
                      styles.filterOptionText,
                      filterOptions[filter.key as keyof typeof filterOptions] && styles.activeFilterOptionText
                    ]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    backgroundColor: '#F9FAFB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
  },
  closeSearchButton: {
    padding: 4,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  analyticsContainer: {
    padding: 20,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyticsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 8,
  },
  analyticsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  tabBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  activeTabBadge: {
    backgroundColor: 'white',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabBadgeText: {
    color: '#2563EB',
  },
  chatList: {
    flex: 1,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  chatItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  pinIndicator: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  chatInfo: {
    flex: 1,
    gap: 2,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  priorityIndicator: {
    marginRight: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2563EB',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  typingText: {
    fontSize: 14,
    color: '#2563EB',
    fontStyle: 'italic',
  },
  unreadMessage: {
    fontWeight: '500',
    color: '#111827',
  },
  messageStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  unreadBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  menuButton: {
    padding: 4,
  },
  unreadIndicator: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    flex: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  clearSearchButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  clearSearchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginRight: 16,
  },
  selectionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 8,
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
  },
  deleteButton: {
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#EF4444',
  },
  quickActionsContainer: {
    padding: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 8,
  },
  activeSortOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
  },
  activeSortOptionText: {
    color: 'white',
  },
  filterOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 8,
  },
  activeFilterOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
  },
  activeFilterOptionText: {
    color: 'white',
  },
});