import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Modal,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text?: string;
  image?: string;
  file?: {
    name: string;
    size: string;
    type: string;
  };
  voice?: {
    duration: number;
    uri: string;
  };
  sender: 'me' | 'them';
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: string[];
}

interface QuickReply {
  id: string;
  text: string;
  category: string;
}

const { width } = Dimensions.get('window');

const mockChats = [
  { id: '1', name: 'Shailaja', avatar: '👩‍💼', online: true, lastSeen: '2 min ago' },
  { id: '2', name: 'Praveen Srivastava', avatar: '👨‍💻', online: false, lastSeen: '1 hour ago' },
  { id: '3', name: 'Anubhav Anant', avatar: '👨‍🔬', online: true, lastSeen: 'now' },
  { id: '4', name: 'Sanjeev', avatar: '👨‍💼', online: false, lastSeen: '30 min ago' },
  { id: '5', name: 'Sameet', avatar: '👨‍🎨', online: true, lastSeen: 'now' },
  { id: '6', name: 'Venu', avatar: '👨‍💻', online: false, lastSeen: '2 hours ago' },
];

const quickReplies: QuickReply[] = [
  { id: '1', text: 'Hi! How are you?', category: 'greeting' },
  { id: '2', text: 'Thanks for getting back to me', category: 'greeting' },
  { id: '3', text: 'Can you tell me more about the job?', category: 'job' },
  { id: '4', text: 'What are the requirements?', category: 'job' },
  { id: '5', text: 'When can I start?', category: 'job' },
  { id: '6', text: 'What\'s the salary range?', category: 'job' },
  { id: '7', text: 'I\'m interested in applying', category: 'application' },
  { id: '8', text: 'Can we schedule an interview?', category: 'application' },
  { id: '9', text: 'I\'ll get back to you soon', category: 'general' },
  { id: '10', text: 'That sounds great!', category: 'general' },
];

const reactions = ['👍', '❤️', '😊', '🎉', '👏', '🔥', '💯', '🚀'];

export default function ChatDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Hello! How can I help you with the job opportunity?', 
      sender: 'them', 
      timestamp: Date.now() - 60000,
      status: 'read'
    },
    { 
      id: '2', 
      text: 'Hi! I am interested in your job post. Can you tell me more about the requirements?', 
      sender: 'me', 
      timestamp: Date.now() - 30000,
      status: 'read'
    },
    {
      id: '3',
      text: 'Sure! The position requires 3+ years of experience in React Native development, strong knowledge of TypeScript, and experience with mobile app deployment.',
      sender: 'them',
      timestamp: Date.now() - 15000,
      status: 'read'
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [recording, setRecording] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const chatInfo = mockChats.find(c => c.id === id);

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
    return () => navigation.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, { toValue: 1, duration: 500, useNativeDriver: false }),
          Animated.timing(typingAnimation, { toValue: 0, duration: 500, useNativeDriver: false }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const sendMessage = async (text?: string, image?: string, file?: any, voice?: any) => {
    if ((!text || !text.trim()) && !image && !file && !voice) return;
    
    setSending(true);
    const newMsg: Message = {
      id: Date.now().toString(),
      text: text?.trim() || undefined,
      image,
      file,
      voice,
      sender: 'me',
      timestamp: Date.now(),
      status: 'sending',
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setShowQuickReplies(false);
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 2000);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 3000);

    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    setTimeout(() => {
      setIsTyping(false);
      // Mock reply
      const replies = [
        'Thanks for your message! I\'ll get back to you soon.',
        'That\'s great to hear! Let me check the details.',
        'Perfect! I\'ll forward this to the hiring manager.',
        'Thanks for the information. I\'ll review it.',
        'Got it! I\'ll update the application status.',
        'Excellent! We\'ll be in touch shortly.',
        'Thank you for your interest!',
        'I appreciate you reaching out.',
      ];
      
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: 'them',
          timestamp: Date.now() + 1,
          status: 'read',
        },
      ]);
      setSending(false);
    }, 3000);
    
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      sendMessage(undefined, result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileSize = file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown';
        sendMessage(undefined, undefined, {
          name: file.name,
          size: fileSize,
          type: file.mimeType || 'application/octet-stream',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const startRecording = () => {
    setRecording(true);
    // In a real app, you would start actual voice recording here
    setTimeout(() => {
      setRecording(false);
      sendMessage(undefined, undefined, undefined, {
        duration: 15,
        uri: 'mock-voice-uri',
      });
    }, 3000);
  };

  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
          : msg
      )
    );
    setShowReactions(null);
  };

  const filteredMessages = messages.filter(msg => 
    !searchQuery || 
    (msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredQuickReplies = quickReplies.filter(reply => 
    selectedCategory === 'all' || reply.category === selectedCategory
  );

  const renderMessageStatus = (status: string) => {
    switch (status) {
      case 'sending':
        return <Text style={styles.statusText}>⏳</Text>;
      case 'sent':
        return <Text style={styles.statusText}>✓</Text>;
      case 'delivered':
        return <Text style={styles.statusText}>✓✓</Text>;
      case 'read':
        return <Text style={styles.statusText}>✓✓</Text>;
      default:
        return null;
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageRow,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage,
    ]}>
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
      
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.messageImage} />
      )}
      
      {item.file && (
        <View style={styles.fileContainer}>
          <Ionicons name="document" size={24} color="#2563EB" />
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{item.file.name}</Text>
            <Text style={styles.fileSize}>{item.file.size}</Text>
          </View>
        </View>
      )}
      
      {item.voice && (
        <View style={styles.voiceContainer}>
          <Ionicons name="play-circle" size={24} color="#2563EB" />
          <Text style={styles.voiceDuration}>{item.voice.duration}s</Text>
        </View>
      )}
      
      <View style={styles.messageFooter}>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {item.sender === 'me' && renderMessageStatus(item.status)}
      </View>
      
      {item.reactions && item.reactions.length > 0 && (
        <View style={styles.reactionsContainer}>
          {item.reactions.map((reaction, index) => (
            <Text key={index} style={styles.reaction}>{reaction}</Text>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.reactionButton}
        onPress={() => setShowReactions(showReactions === item.id ? null : item.id)}
      >
        <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
      </TouchableOpacity>
      
      {showReactions === item.id && (
        <View style={styles.reactionsPicker}>
          {reactions.map((reaction, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reactionOption}
              onPress={() => addReaction(item.id, reaction)}
            >
              <Text style={styles.reactionText}>{reaction}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/chat')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerInfo}>
          <Text style={styles.headerAvatar}>{chatInfo?.avatar}</Text>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{chatInfo?.name}</Text>
            <View style={styles.onlineStatus}>
              <View style={[styles.statusDot, { backgroundColor: chatInfo?.online ? '#10B981' : '#6B7280' }]} />
              <Text style={styles.statusText}>
                {chatInfo?.online ? 'Online' : chatInfo?.lastSeen}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="videocam" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}

      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>Typing</Text>
          <Animated.View style={[styles.typingDots, { opacity: typingAnimation }]}>
            <Text style={styles.typingDot}>.</Text>
            <Text style={styles.typingDot}>.</Text>
            <Text style={styles.typingDot}>.</Text>
          </Animated.View>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {showQuickReplies && (
        <View style={styles.quickRepliesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {['all', 'greeting', 'job', 'application', 'general'].map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRepliesScroll}>
            {filteredQuickReplies.map(reply => (
              <TouchableOpacity
                key={reply.id}
                style={styles.quickReplyButton}
                onPress={() => sendMessage(reply.text)}
              >
                <Text style={styles.quickReplyText}>{reply.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={() => setShowQuickReplies(!showQuickReplies)} style={styles.inputButton}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={pickImage} style={styles.inputButton}>
          <Ionicons name="camera" size={24} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={pickDocument} style={styles.inputButton}>
          <Ionicons name="document" size={24} color="#6B7280" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          editable={!sending}
          onSubmitEditing={() => sendMessage(input)}
          multiline
        />
        
        {recording ? (
          <TouchableOpacity style={styles.recordingButton}>
            <Ionicons name="stop" size={24} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording} style={styles.inputButton}>
            <Ionicons name="mic" size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={() => sendMessage(input)} style={styles.sendButton} disabled={sending}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
  },
  typingText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 2,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  messageRow: {
    marginBottom: 12,
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    position: 'relative',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 6,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  fileInfo: {
    marginLeft: 8,
    flex: 1,
  },
  fileName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  fileSize: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  voiceDuration: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  reaction: {
    fontSize: 16,
    marginRight: 4,
  },
  reactionButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
  },
  reactionsPicker: {
    position: 'absolute',
    top: -40,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reactionOption: {
    padding: 4,
    marginHorizontal: 2,
  },
  reactionText: {
    fontSize: 20,
  },
  quickRepliesContainer: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#fff',
  },
  quickRepliesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  quickReplyButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickReplyText: {
    fontSize: 14,
    color: '#374151',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 100,
  },
  inputButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 10,
    marginLeft: 4,
  },
  recordingButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    padding: 10,
    marginLeft: 4,
  },
});

export const unstable_settings = {
  initialRouteName: 'chat-detail',
  tabBarStyle: { display: 'none' },
  tabBarVisible: false,
}; 