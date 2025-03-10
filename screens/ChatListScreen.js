import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import ChatScreen from './ChatScreen';

export default function ChatListScreen({ navigation }) {
  const [chats, setChats] = useState([
    { id: '1', name: 'Munin', lastMessage: 'สวัสดี! มีอะไรให้ช่วยไหม?', time: '8:36 am', avatar: 'https://example.com/avatar1.png' },
    { id: '2', name: 'Arun', lastMessage: 'ขอข้อมูลเพิ่มเติมเกี่ยวกับงานหน่อยครับ', time: '8:37 am', avatar: 'https://example.com/avatar2.png' },
  ]);

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="Chats" />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItemContainer}
            onPress={() => navigation.navigate('ChatScreen', { chat: item })}
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
});