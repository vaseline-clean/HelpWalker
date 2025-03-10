import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomHeader from '../components/CustomHeader';
import MissionDetailsScreen from './MissionDetailsScreen';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function ChatScreen({ navigation }) {
  const [chats, setChats] = useState([
    { id: '1', userId: 'user1', lastMessage: 'สวัสดี! มีอะไรให้ช่วยไหม?', time: '8:36 am', avatar: 'https://example.com/avatar1.png' },
    { id: '2', userId: 'user2', lastMessage: 'ขอข้อมูลเพิ่มเติมเกี่ยวกับงานหน่อยครับ', time: '8:37 am', avatar: 'https://example.com/avatar2.png' },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (selectedChat) {
      socket.emit('joinChat', selectedChat.id);

      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [selectedChat]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const message = {
      chatId: selectedChat.id,
      text: inputText,
      sender: 'me',
      timestamp: new Date(),
    };

    socket.emit('sendMessage', message);
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
                  <Text style={styles.nameText}>{item.userId}</Text>
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
      <CustomHeader navigation={navigation} title={selectedChat.userId} onBack={() => setSelectedChat(null)} />

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
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
  // ...existing styles...
});