import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MoreHorizontal, MessageCircle } from 'lucide-react-native';

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
    avatar: null
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
    avatar: null
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
    avatar: null
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
    avatar: null
  }
  ,{
    id: '5',
    name: 'Sameet',
    company: 'AWS',
    lastMessage: 'Wonderful',
    timestamp: '2 days ago',
    unread: 0,
    jobTitle: 'Database Management',
    isOnline: false,
    avatar: null
  }
  ,{
    id: '6',
    name: 'Venu',
    company: 'Dezynr',
    lastMessage: 'Brilliant Work on figma Shreyash!',
    timestamp: '7 days ago',
    unread: 0,
    jobTitle: 'Portfolio Development',
    isOnline: false,
    avatar: null
  }
];

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', count: mockChats.length },
    { id: 'unread', label: 'Unread', count: mockChats.filter(chat => chat.unread > 0).length },
    { id: 'archived', label: 'Archived', count: 0 }
  ];

  const filteredChats = activeTab === 'unread' 
    ? mockChats.filter(chat => chat.unread > 0)
    : mockChats;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleChatPress = (chatId: string) => {
    console.log('Open chat:', chatId);
    // Navigate to chat detail screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
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

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
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
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.timestamp}>{chat.timestamp}</Text>
                  </View>
                  
                  <Text style={styles.jobTitle}>{chat.jobTitle} • {chat.company}</Text>
                  
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
                          {chat.unread}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity style={styles.menuButton}>
                  <MoreHorizontal size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyDescription}>
              Start applying to jobs to connect with employers
            </Text>
          </View>
        )}
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
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabBadgeText: {
    color: '#2563EB',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
    fontFamily: 'Inter-SemiBold',
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
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  jobTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  unreadBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
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
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});