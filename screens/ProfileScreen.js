import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log("Retrieved Token:", storedToken);

        if (storedToken) {
          setToken(storedToken);
          const decodedToken = jwtDecode(storedToken);
          console.log("Decoded Token:", decodedToken);

          if (decodedToken.user_id) {
            setUserId(decodedToken.user_id);
          } else {
            console.warn("user_id is missing in token");
          }
        } else {
          console.warn("No token found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };

    getToken();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (token && userId) {
        fetchUserData();
      }
    }, [token, userId])
  );

  const fetchUserData = async () => {
    if (!token || !userId) return;

    try {
      setLoading(true);

      const response = await fetch(`http://10.30.136.56:3001/user/${userId}`, {

        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Fix template literal
        },
      });

      const data = await response.json();
      console.log("Fetched User Data:", data);

      if (data && data.user_name && data.user_email && data.user_phone) {
        setUserData({
          name: data.user_name, 
          email: data.user_email, 
          phone: data.user_phone,
          address: data.user_address
        });
      } else {
        Alert.alert('ข้อผิดพลาด', 'ไม่พบข้อมูลผู้ใช้');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('LoginScreen');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.label}>ชื่อ:</Text>
          <Text style={styles.info}>{userData.name}</Text>

          <Text style={styles.label}>อีเมล:</Text>
          <Text style={styles.info}>{userData.email}</Text>

          <Text style={styles.label}>เบอร์โทร:</Text>
          <Text style={styles.info}>{userData.phone}</Text>

          <Text style={styles.label}>ที่อยู่:</Text>
          <Text style={styles.info}>{userData.address}</Text>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>แก้ไขโปรไฟล์</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});