import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode } from 'jwt-decode';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        setUserId(decodedToken.user_id);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token || !userId) return;

        const response = await fetch(`http://10.30.136.56:3001/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUserData({
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      }
    };

    fetchUserData();
  }, [token, userId]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ชื่อ:</Text>
      <Text style={styles.info}>{userData.name}</Text>

      <Text style={styles.label}>อีเมล:</Text>
      <Text style={styles.info}>{userData.email}</Text>

      <Text style={styles.label}>เบอร์โทร:</Text>
      <Text style={styles.info}>{userData.phone}</Text>

      <Button title="แก้ไขโปรไฟล์" onPress={() => navigation.navigate('EditProfileScreen')} />
      <Button title="ออกจากระบบ" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
});