import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

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

        const response = await fetch(`http://10.30.136.56:3001/users/${userId}`, {
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

  const handleSave = async () => {
    try {
      const response = await fetch(`http://10.30.136.56:3001/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      Alert.alert('สำเร็จ', 'ข้อมูลผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ชื่อ</Text>
      <TextInput
        style={styles.input}
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
        placeholder="กรอกชื่อ"
      />

      <Text style={styles.label}>อีเมล</Text>
      <TextInput
        style={styles.input}
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
        placeholder="กรอกอีเมล"
      />

      <Text style={styles.label}>เบอร์โทร</Text>
      <TextInput
        style={styles.input}
        value={userData.phone}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
        placeholder="กรอกเบอร์โทร"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>บันทึก</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
