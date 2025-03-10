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
          <TouchableOpacity style={styles.contactItem} onPress={() => handleChat(item.id)}>
            <Text style={styles.contactName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 16,
  },
});