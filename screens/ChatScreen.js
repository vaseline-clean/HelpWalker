
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

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

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.senderName}>{item.sender.name}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 10,
    backgroundColor: '#fff',
  },
  messageContainer: {
    marginBottom: 10,
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

  },
});