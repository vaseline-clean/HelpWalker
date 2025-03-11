import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, Button, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';
import ChatScreen from './ChatScreen';

export default function ChatListScreen({ navigation, route }) {
  const user = route && route.params ? route.params.user : null;
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [noChats, setNoChats] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userToken, setUserToken] = useState(null); // State for user token

  const createNewChat = () => {
    const newChat = {
      _id: 'new_chat_id',
      sender: {
        _id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      taskId: 'new_task_id',
      timestamp: new Date(),
      text: '',
    };
    navigation.navigate('ChatScreen', { chat: newChat });
  };

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
    if (user && user.id && userToken) {
      axios.get(`http://10.30.136.56:3001/chat/messages/${user.id}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
        .then(response => {
          if (response.data.length === 0) {
            setNoChats(true);
            Alert.alert('Notification', 'ยังไม่มีการพูดคุย');
          } else {
            setChats(response.data);
            setFilteredChats(response.data);
            setNoChats(false);
          }
        })
        .catch(error => {
          console.error('Failed to fetch chats:', error);
          if (error.response && error.response.status === 404) {
            Alert.alert('Error', 'No chats found for this user.');
          } else if (error.message && error.message.includes('JSON')) {
            Alert.alert('Error', 'Error parsing server response. Please try again later.');
          } else {
            Alert.alert('Error', 'Failed to fetch chats. Please try again later.');
          }
        });
    }
  }, [user, userToken]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat => chat.sender.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredChats(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="Chats" />
      {noChats ? (
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>No chats found for this user.</Text>
          <Button title="Create New Chat" onPress={createNewChat} />
        </View>
      ) : (
        <FlatList
          data={filteredChats}
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
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 18,
    color: '#888',
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