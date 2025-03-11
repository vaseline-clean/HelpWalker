import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';  // เพิ่มการ import jwt-decode

export default function ChatScreen({ route }) {
  const { taskId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // ดึง token จาก AsyncStorage เมื่อ component เริ่มทำงาน
  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);  // เก็บ token ใน state
          const decodedToken = jwtDecode(token);  // ถอดรหัส token
          console.log('Decoded Token:', decodedToken);
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

  // ดึงข้อมูลผู้ใช้จาก taskId
  useEffect(() => {
    if (userToken && taskId) {
      console.log('Fetching user info for taskId:', taskId);
      axios.get(`http://10.30.136.56:3001/users/${taskId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      .then(response => {
        console.log('Fetched user info:', response.data);
        setUserInfo(response.data);  // เก็บข้อมูลผู้ใช้
        setError('');
      })
      .catch(error => {
        console.error('Failed to fetch user info:', error);
        setError('Failed to fetch user info');
      });
    } else {
      setError('Missing userToken or taskId');
    }
  }, [userToken, taskId]); // ตรวจสอบการเปลี่ยนแปลงของ userToken และ taskId

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {userInfo ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>Name: {userInfo.name}</Text>
          <Text style={styles.userPhone}>Phone: {userInfo.phone}</Text>
          <Text style={styles.userEmail}>Email: {userInfo.email}</Text>
        </View>
      ) : (
        <Text style={styles.noUserInfoText}>No user information available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  userInfoContainer: {
    marginBottom: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  userPhone: {
    fontSize: 16,
    marginTop: 5,
  },
  userEmail: {
    fontSize: 16,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  noUserInfoText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
});
