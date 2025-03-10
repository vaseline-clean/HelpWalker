import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, Button } from 'react-native';
import axios from 'axios';
import CustomHeader from '../components/CustomHeader';
import ChatScreen from './ChatScreen';

export default function ChatListScreen({ navigation, route }) {
  const { user } = route.params;
  const [chats, setChats] = useState([]);
  const [retry, setRetry] = useState(false);

  const fetchChats = () => {
    if (user) {
      axios.get(`http://localhost:3001/chat/messages/${user.id}`)
        .then(response => {
          setChats(response.data);
          setRetry(false);
        })
        .catch(error => {
          console.error('Failed to fetch chats:', error);
          Alert.alert('Error', 'Failed to fetch chats. Please try again later.');
          setRetry(true);
        });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="Chats" />
      {retry ? (
        <View style={styles.retryContainer}>
          <Text style={styles.errorText}>Failed to fetch chats. Please try again later.</Text>
          <Button title="Retry" onPress={fetchChats} />
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id} // Ensure each item has a unique key
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItemContainer}
              onPress={() => navigation.navigate('ChatScreen', { chat: item })}
            >
              <Image source={{ uri: item.sender.avatar }} style={styles.avatar} />
              <View style={styles.chatContentContainer}>
                <View style={styles.chatHeader}>
                  <Text style={styles.nameText}>{item.sender.name}</Text>
                  <Text style={styles.timeText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                </View>
                <Text style={styles.lastMessageText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chatListContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  retryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
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
});