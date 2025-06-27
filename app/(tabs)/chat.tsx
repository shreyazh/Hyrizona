import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MoreHorizontal, MessageCircle, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const mockChats = [
  {
    id: '1',
    name: 'Shailaja',
    company: 'ABCD Inc.',
    lastMessage: 'Great! When can you start the project?',
    timestamp: '2 min ago',
    unread: 2,
    jobTitle: 'Data Mining Engineer',
    isOnline: true,
    avatar: null,
    lastSeen: new Date(),
    isArchived: false
  },
  {
    id: '2',
    name: 'Praveen Srivastava',
    company: 'XYZ.com',
    lastMessage: 'Thanks for applying. Let\'s discuss the details.',
    timestamp: '1 hour ago',
    unread: 0,
    jobTitle: 'Event Setup Manager',
    isOnline: false,
    avatar: null,
    lastSeen: new Date(Date.now() - 3600000),
    isArchived: false
  },
  {
    id: '3',
    name: 'Anubhav Anant',
    company: 'Business Solutions',
    lastMessage: 'Can you send me your portfolio?',
    timestamp: 'Yesterday',
    unread: 1,
    jobTitle: 'Content Writer',
    isOnline: true,
    avatar: null,
    lastSeen: new Date(Date.now() - 86400000),
    isArchived: false
  },
  {
    id: '4',
    name: 'Sanjeev',
    company: 'ABC-MNC',
    lastMessage: 'The job is completed successfully!',
    timestamp: '2 days ago',
    unread: 0,
    jobTitle: 'Website Development',
    isOnline: false,
    avatar: null,
    lastSeen: new Date(Date.now() - 172800000),
    isArchived: false
  },
  {
    id: '5',
    name: 'Sameet',
    company: 'AWS',
    lastMessage: 'Wonderful',
    timestamp: '2 days ago',
    unread: 0,
    jobTitle: 'Database Management',
    isOnline: false,
    avatar: null,
    lastSeen: new Date(Date.now() - 172800000),
    isArchived: false
  },
  {
    id: '6',
    name: 'Venu',
    company: 'Dezynr',
    lastMessage: 'Brilliant Work on figma Shreyash!',
    timestamp: '7 days ago',
    unread: 0,
    jobTitle: 'Portfolio Development',
    isOnline: false,
    avatar: null,
    lastSeen: new Date(Date.now() - 604800000),
    isArchived: true
  }
];

export default function ChatScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chats, setChats] = useState(mockChats);

  // Memoized tabs calculation
  const tabs = useMemo(() => [
    { 
      id: 'all', 
      label: 'All', 
      count: chats.filter(chat => !chat.isArchived).length 
    },
    { 
      id: 'unread', 
      label: 'Unread', 
      count: chats.filter(chat => chat.unread > 0 && !chat.isArchived).length 
    },
    { 
      id: 'archived', 
      label: 'Archived', 
      count: chats.filter(chat => chat.isArchived).length 
    }
  ], [chats]);

  // Memoized filtered chats
  const filteredChats = useMemo(() => {
    let filtered = chats;

    // Filter by tab
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(chat => chat.unread > 0 && !chat.isArchived);
        break;
      case 'archived':
        filtered = filtered.filter(chat => chat.isArchived);
        break;
      default:
        filtered = filtered.filter(chat => !chat.isArchived);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [chats, activeTab, searchQuery]);

  // Optimized functions with useCallback
  const getInitials = useCallback((name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }, []);

  const handleChatPress = useCallback((chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
    router.push('/chat-detail?id=' + chatId);
  }, [router]);

  const handleMenuPress = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    Alert.alert(
      'Chat Options',
      `Options for ${chat.name}`,
      [
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

  // Optimized render functions
  const renderChatItem = useCallback(({ item: chat }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(chat.id)}
      activeOpacity={0.8}
    >
      <View style={styles.chatContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(chat.name)}
            </Text>
          </View>
          {chat.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {chat.name}
            </Text>
            <Text style={styles.timestamp}>{chat.timestamp}</Text>
          </View>
          
          <Text style={styles.jobTitle} numberOfLines={1}>
            {chat.jobTitle} • {chat.company}
          </Text>
          
          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.lastMessage,
                chat.unread > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {chat.lastMessage}
            </Text>
            
            {chat.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {chat.unread > 99 ? '99+' : chat.unread}
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => handleMenuPress(chat.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreHorizontal size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [handleChatPress, handleMenuPress, getInitials]);

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
            <Text style={styles.title}>Messages</Text>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={toggleSearch}
            >
              <Search size={20} color="#2563EB" />
            </TouchableOpacity>
          </>
        )}
      </View>

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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
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
  chatInfo: {
    flex: 1,
    gap: 2,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
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
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '500',
    color: '#111827',
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
});