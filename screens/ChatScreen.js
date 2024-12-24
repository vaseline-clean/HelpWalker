import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomHeader from '../components/CustomHeader';
import MissionDetailsScreen from './MissionDetailsScreen';

export default function ChatScreen({ navigation }) {
  const [chats, setChats] = useState([
    { id: '1', name: 'Munin', lastMessage: 'สวัสดี! มีอะไรให้ช่วยไหม?', time: '8:36 am', avatar: 'https://example.com/avatar1.png' },
    { id: '2', name: 'Arun', lastMessage: 'ขอข้อมูลเพิ่มเติมเกี่ยวกับงานหน่อยครับ', time: '8:37 am', avatar: 'https://example.com/avatar2.png' },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([
    { id: '1', text: 'สวัสดี! มีอะไรให้ช่วยไหม?', sender: 'other' },
    { id: '2', text: 'สวัสดีครับ ขอข้อมูลเพิ่มเติมเกี่ยวกับงานหน่อยครับ', sender: 'me' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    setMessages([
      ...messages,
      { id: Date.now().toString(), text: inputText, sender: 'me' },
    ]);
    setInputText('');
  };

  if (!selectedChat) {
    return (
      <View style={styles.container}>
        <CustomHeader navigation={navigation} title="Chats" />

        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItemContainer}
              onPress={() => setSelectedChat(item)}
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.chatContentContainer}>
                <View style={styles.chatHeader}>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.lastMessageText}>{item.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chatListContainer}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title={selectedChat.name} onBack={() => setSelectedChat(null)} />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === 'me' ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="พิมพ์ข้อความ..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>ส่ง</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatListContainer: {
    padding: 10,
  },
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatContentContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  lastMessageText: {
    color: '#555',
    marginTop: 2,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0078fe',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#0078fe',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

