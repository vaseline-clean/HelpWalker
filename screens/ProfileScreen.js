import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import Icon from 'react-native-vector-icons/Ionicons';

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('LoginScreen');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  const handleBack = () => {
    navigation.goBack(); // กลับไปหน้าก่อนหน้า
  };

  return (
    <View style={styles.container}>
      {/* ปุ่มย้อนกลับเป็นไอคอน */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="arrow-back" size={30} color="#000" /> {/* ใช้ไอคอนย้อนกลับ */}
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>ชื่อ:</Text>
        <Text style={styles.info}>{userData.name}</Text>

        <Text style={styles.label}>อีเมล:</Text>
        <Text style={styles.info}>{userData.email}</Text>

        <Text style={styles.label}>เบอร์โทร:</Text>
        <Text style={styles.info}>{userData.phone}</Text>

        {/* ปรับแต่งปุ่มแก้ไขโปรไฟล์ */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>แก้ไขโปรไฟล์</Text>
        </TouchableOpacity>

        {/* ปรับแต่งปุ่มออกจากระบบ */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60, // เพิ่มระยะห่างด้านบนให้ไอคอนย้อนกลับและคอนเทนต์ลงมาอีก
  },
  backButton: {
    position: 'absolute',
    top: 40,   // ปรับตำแหน่งจากด้านบนเพื่อให้ห่างจากขอบมากขึ้น
    left: 10,  // ตำแหน่งจากด้านซ้าย
    zIndex: 1, // ให้ไอคอนปรากฏขึ้นบนสุด
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,  // เพิ่มระยะห่างด้านบนจากชื่อ
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 5,  // เพิ่มระยะห่างระหว่างข้อมูล
    color: '#555',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  // สไตล์สำหรับปุ่มแก้ไขโปรไฟล์
  editButton: {
    backgroundColor: '#4CAF50',  // สีพื้นหลังของปุ่ม
    paddingVertical: 12,  // การตั้งค่าระยะห่างด้านบน-ล่าง
    paddingHorizontal: 20,  // การตั้งค่าระยะห่างด้านข้าง
    borderRadius: 8,  // มุมโค้ง
    marginTop: 40,  // ช่องว่างด้านบน
    marginBottom: 20,  // ช่องว่างระหว่างปุ่ม
    alignItems: 'center',  // จัดตำแหน่งข้อความในปุ่มให้อยู่ตรงกลาง
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',  // สีของข้อความในปุ่ม
    fontWeight: 'bold',
  },
  // สไตล์สำหรับปุ่มออกจากระบบ
  logoutButton: {
    backgroundColor: '#f44336',  // สีพื้นหลังของปุ่มออกจากระบบ
    paddingVertical: 12,  // การตั้งค่าระยะห่างด้านบน-ล่าง
    paddingHorizontal: 20,  // การตั้งค่าระยะห่างด้านข้าง
    borderRadius: 8,  // มุมโค้ง
    alignItems: 'center',  // จัดตำแหน่งข้อความในปุ่มให้อยู่ตรงกลาง
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',  // สีของข้อความในปุ่ม
    fontWeight: 'bold',
  },
});
