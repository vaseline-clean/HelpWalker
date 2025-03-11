import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';  // เพิ่มการ import jwt-decode

export default function ChatScreen({ route }) {
  const { chat } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ownerMessage, setOwnerMessage] = useState('');
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [taskId, setTaskId] = useState(null); // State สำหรับเก็บ taskId
  const [userId, setUserId] = useState(null);  // State สำหรับเก็บ userId จาก token

  // ดึง token จาก AsyncStorage เมื่อ component เริ่มทำงาน
 useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);  // เก็บ token ใน state
          const decodedToken = jwtDecode(token);  // ถอดรหัส token
          console.log('Decoded Token:', decodedToken);
          setUserId(decodedToken.user_id);  // เก็บ userId จาก decoded token
          console.log('User ID:', decodedToken.user_id);
        } else {
          setError('No userToken found');
        }
      } catch (error) {
        console.error('Failed to fetch userToken:', error);
        setError('Failed to fetch userToken');
      }
    };

    fetchUserToken();
  }, []); // ดึง token เมื่อเริ่ม component


  // ดึง taskId จาก AsyncStorage
  useEffect(() => {
    const fetchTaskId = async () => {
      try {
        const task = await AsyncStorage.getItem('taskId');
        console.log('Fetched taskId:', task); // log ค่า taskId ที่ดึงออกมาจาก AsyncStorage
        if (task) {
          setTaskId(task);
        } else {
          setError('No taskId found. Please select a task.');
        }
      } catch (error) {
        console.error('Failed to fetch taskId:', error);
        setError('Failed to fetch taskId');
      }
    };

    fetchTaskId();
  }, []); // ดึง taskId เมื่อเริ่ม component

   // ดึงข้อมูล chat ของ user_id และ taskId
  useEffect(() => {
    if (userToken && taskId && userId) {
      console.log('Fetching messages for userId:', userId, 'and taskId:', taskId);
      axios.get(`http://10.30.136.56:3001/chat/messages/${taskId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params: { userId: userId, taskId: taskId } // ส่ง userId และ taskId เป็นพารามิเตอร์
      })
      .then(response => {
        console.log('Fetched messages:', response.data);
        if (response.data && response.data.messages) {
          setMessages(response.data.messages);  // ถ้ามีข้อมูลข้อความ
          setError('');
        } else {
          setError('No messages found');
        }
      })
      .catch(error => {
        console.error('Failed to fetch messages:', error);
        setError('Failed to fetch messages');
      });
    } else {
      setError('Missing userToken or taskId');
    }
  }, [userToken, taskId, userId]); // ตรวจสอบการเปลี่ยนแปลงของ userToken, taskId และ userId
  // ฟังก์ชันสำหรับส่งข้อความของผู้ใช้งาน
  const sendMessage = () => {
    if (!newMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    if (!userToken) {
      setError('Please make sure you have a valid token');
      return;
    }

    if (!taskId) {
      setError('Please provide a valid taskId');
      return;
    }

    axios.post('http://10.30.136.56:3001/chat/messages', {
      userId: chat.sender._id,
      sender: chat.sender._id,
      taskId: taskId,
      text: newMessage,
      messageType: 'text',
    }, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then(response => {
        setMessages(prevMessages => [...prevMessages, ...response.data.chat.messages]);
        setNewMessage('');
      })
      .catch(error => {
        console.error('Failed to send message:', error);
        setError('Failed to send message');
      });
  };

  const sendOwnerMessage = () => {
    if (ownerMessage.trim() && userToken && taskId) {
      // ส่งข้อมูลข้อความไปยังเจ้าของ task
      axios.post('http://10.30.136.56:3001/chat/messages', {
        userId: chat.sender._id,
        sender: chat.sender._id,
        taskId: taskId,
        text: ownerMessage,
        messageType: 'text'
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`,  // ตรวจสอบว่า token ถูกต้อง
          'Content-Type': 'application/json'  // ตรวจสอบว่า Content-Type ถูกต้อง
        }
      })
      .then(response => {
        setMessages(prevMessages => [...prevMessages, response.data.chat.messages.pop()]);
        setOwnerMessage('');
      })
      .catch(error => {
        console.error('Failed to send message:', error);
        setError('Failed to send message');
      });
    } else {
      setError('Please enter a message and make sure you have a valid token');
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

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
