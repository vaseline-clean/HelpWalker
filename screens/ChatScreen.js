
// ChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import CustomHeader from '../components/CustomHeader';

export default function ChatScreen({ route, navigation }) {
  const { chat } = route.params;
  const [messages, setMessages] = useState([
    { id: '1', text: 'สวัสดี! มีอะไรให้ช่วยไหม?', sender: 'other' },
    { id: '2', text: 'สวัสดีครับ ขอข้อมูลเพิ่มเติมเกี่ยวกับงานหน่อยครับ', sender: 'me' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: 'me' }]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title={chat.name} onBack={() => navigation.goBack()} />

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export default function ChatScreen({ route, navigation }) {
  const { missionId, userId, ownerId } = route.params || {};
  const [contacts, setContacts] = useState([]);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        setCurrentUserId(decodedToken.user_id);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (!token || !currentUserId) return;

        const response = await fetch(`http://10.30.136.56:3001/users/${currentUserId}/contacts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setContacts(data.contacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, [token, currentUserId]);

  useEffect(() => {
    if (missionId && userId && ownerId) {
      navigation.navigate('IndividualChatScreen', { contactId: ownerId });
    }
  }, [missionId, userId, ownerId]);

  const handleChat = (contactId) => {
    navigation.navigate('IndividualChatScreen', { contactId });
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (

          <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>

          <TouchableOpacity style={styles.contactItem} onPress={() => handleChat(item.id)}>
            <Text style={styles.contactName}>{item.name}</Text>
          </TouchableOpacity>

        )}
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

  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 16,

  },
});