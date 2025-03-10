import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';  // ใช้ jwt-decode ในการถอดรหัส token
import Icon from 'react-native-vector-icons/Ionicons';  // นำเข้าไอคอนจาก react-native-vector-icons

export default function EditProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);  // สถานะการโหลดข้อมูล

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

        if (response.ok) {
          const data = await response.json();
          // ตรวจสอบว่า data มีค่าหรือไม่ก่อน
          if (data && data.name && data.email && data.phone) {
            setUserData({
              name: data.name,
              email: data.email,
              phone: data.phone,
            });
          } else {
            Alert.alert('ข้อผิดพลาด', 'ข้อมูลผู้ใช้ไม่ถูกต้อง');
          }
        } else {
          Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      } finally {
        setLoading(false);  // การโหลดเสร็จสิ้น
      }
    };

    if (token && userId) {
      fetchUserData();
    } else {
      setLoading(false);
    }
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

      if (response.ok) {
        Alert.alert('สำเร็จ', 'บันทึกข้อมูลสำเร็จ');
        navigation.goBack();
      } else {
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
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
      {/* Header แบบมีไอคอนย้อนกลับ */}
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

      <Text style={styles.label}>อีเมล:</Text>
      <TextInput
        style={styles.input}
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
      />

      <Text style={styles.label}>เบอร์โทร:</Text>
      <TextInput
        style={styles.input}
        value={userData.phone}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
      />

      {/* ปรับปุ่มบันทึกให้มีสไตล์ */}
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
    marginTop: 20,  // ขยับลงมาจากด้านบน
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
    backgroundColor: '#4CAF50',  // สีพื้นหลังของปุ่ม
    paddingVertical: 12,  // การตั้งค่าระยะห่างด้านบน-ล่าง
    paddingHorizontal: 20,  // การตั้งค่าระยะห่างด้านข้าง
    borderRadius: 8,  // มุมโค้ง
    marginTop: 20,  // ช่องว่างด้านบน
    alignItems: 'center',  // จัดตำแหน่งข้อความในปุ่มให้อยู่ตรงกลาง
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',  // สีของข้อความในปุ่ม
    fontWeight: 'bold',
  },
});
