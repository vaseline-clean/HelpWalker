import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/Ionicons';

export default function EditProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({ name: '', phone: '', address: '' });
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          const decodedToken = jwtDecode(storedToken);
          setUserId(decodedToken.user_id);
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://10.30.136.56:3001/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUserData({ name: data.user_name, phone: data.user_phone, address: data.user_address || '' });
        } else {
          Alert.alert('ข้อผิดพลาด', data.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token, userId]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://10.30.136.56:3001/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_name: userData.name,
          user_phone: userData.phone,
          user_address: userData.address,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        Alert.alert('สำเร็จ', 'บันทึกข้อมูลสำเร็จ');
        navigation.goBack();
      } else {
        Alert.alert('ข้อผิดพลาด', responseData.message || 'ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>ชื่อ:</Text>
      <TextInput
        style={styles.input}
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
      />

      <Text style={styles.label}>เบอร์โทร:</Text>
      <TextInput
        style={styles.input}
        value={userData.phone}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
      />

      <Text style={styles.label}>ที่อยู่:</Text>
      <TextInput
        style={styles.input}
        value={userData.address}
        onChangeText={(text) => setUserData({ ...userData, address: text })}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>บันทึก</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    marginTop: 1,
    marginLeft: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
