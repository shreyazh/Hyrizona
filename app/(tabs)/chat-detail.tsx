import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: 'me' | 'them';
  timestamp: number;
}

const mockChats = [
  { id: '1', name: 'Shailaja' },
  { id: '2', name: 'Praveen Srivastava' },
  { id: '3', name: 'Anubhav Anant' },
  { id: '4', name: 'Sanjeev' },
  { id: '5', name: 'Sameet' },
  { id: '6', name: 'Venu' },
];

export default function ChatDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you?', sender: 'them', timestamp: Date.now() - 60000 },
    { id: '2', text: 'Hi! I am interested in your job post.', sender: 'me', timestamp: Date.now() - 30000 },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const chatName = mockChats.find(c => c.id === id)?.name || id;

  const sendMessage = async (text?: string, image?: string) => {
    if ((!text || !text.trim()) && !image) return;
    setSending(true);
    const newMsg: Message = {
      id: Date.now().toString(),
      text: text?.trim() || undefined,
      image,
      sender: 'me',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setTimeout(() => {
      // Mock reply
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: image ? 'Nice image!' : 'Thanks for your message!',
          sender: 'them',
          timestamp: Date.now() + 1,
        },
      ]);
      setSending(false);
    }, 1200);
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

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageRow,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage,
      item.text === 'Hello! How can I help you?' && styles.greetingMessage
    ]}>
      {item.text ? <Text style={styles.messageText}>{item.text}</Text> : null}
      {item.image ? <Image source={{ uri: item.image }} style={styles.messageImage} /> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/chat')} style={styles.backButton}>
          <Text style={{ color: '#2563EB', fontSize: 18 }}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat with {chatName}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={{ color: '#2563EB', fontSize: 18 }}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          editable={!sending}
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity onPress={() => sendMessage(input)} style={styles.sendButton} disabled={sending}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
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
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
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
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginTop: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  imageButton: {
    padding: 4,
  },
  greetingMessage: {
    backgroundColor: '#899499', // gray
  },
}); 