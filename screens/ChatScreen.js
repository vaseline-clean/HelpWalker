import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ route }) {
  const { chat } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ownerMessage, setOwnerMessage] = useState(''); // State for the message to the task owner
  const [error, setError] = useState(null); // Add error state
  const [userToken, setUserToken] = useState(null); // State for user token

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (error) {
        console.error('Failed to fetch user token:', error);
      }
    };

    fetchUserToken();
  }, []);

  useEffect(() => {
    if (userToken) {
      axios.get(`http://10.30.136.56:3001/chat/messages/${chat.sender._id}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch messages:', error);
          setError('Failed to fetch messages'); // Set error message
        });
    }
  }, [chat.sender._id, userToken]);

  const sendMessage = () => {
    if (newMessage.trim() && userToken) {
      axios.post('http://10.30.136.56:3001/chat/messages', {
        userId: chat.sender._id,
        sender: chat.sender._id,
        text: newMessage,
        messageType: 'text'
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      .then(response => {
        setMessages([...messages, response.data.chat.messages.pop()]);
        setNewMessage('');
      })
      .catch(error => {
        console.error('Failed to send message:', error);
        setError('Failed to send message'); // Set error message
      });
    }
  };

  const sendOwnerMessage = () => {
    if (ownerMessage.trim() && userToken) {
      axios.post('http://10.30.136.56:3001/chat/messages', {
        userId: chat.sender._id,
        sender: chat.sender._id,
        text: ownerMessage,
        messageType: 'text'
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      .then(response => {
        setMessages([...messages, response.data.chat.messages.pop()]);
        setOwnerMessage('');
      })
      .catch(error => {
        console.error('Failed to send message:', error);
        setError('Failed to send message'); // Set error message
      });
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>} {/* Display error message */}
      {messages.length === 0 ? (
        <Text style={styles.noMessagesText}>No messages yet. Start the conversation!</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.senderName}>{item.sender ? item.sender.name : 'Unknown'}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={ownerMessage}
          onChangeText={setOwnerMessage}
          placeholder="Message the task owner"
        />
        <Button title="Send to Owner" onPress={sendOwnerMessage} />
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  noMessagesText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
});