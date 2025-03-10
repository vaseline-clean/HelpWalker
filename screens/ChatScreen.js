// ChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import CustomHeader from '../components/CustomHeader';

export default function ChatScreen({ route }) {
  const { chat } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/chat/messages/${chat.taskId}`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch messages:', error);
      });
  }, [chat.taskId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      axios.post('http://localhost:3001/chat/messages', {
        taskId: chat.taskId,
        sender: chat.sender._id,
        text: newMessage,
        messageType: 'text'
      })
      .then(response => {
        setMessages([...messages, response.data]);
        setNewMessage('');
      })
      .catch(error => {
        console.error('Failed to send message:', error);
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title={chat.name} onBack={() => navigation.goBack()} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>

          <TouchableOpacity style={styles.contactItem} onPress={() => handleChat(item.id)}>
            <Text style={styles.contactName}>{item.name}</Text>
          </TouchableOpacity>

        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
  },
  senderName: {
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 5,
    padding: 10,
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