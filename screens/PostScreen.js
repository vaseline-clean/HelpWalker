import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { jwtDecode } from 'jwt-decode';

export default function PostScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mission, setMission] = useState('');
  const [reward, setReward] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 13.7563, // ค่าเริ่มต้น (กรุงเทพฯ)
    longitude: 100.5018,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // ดึงตำแหน่งปัจจุบัน
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('การเข้าถึงถูกปฏิเสธ', 'กรุณาเปิดใช้งาน GPS เพื่อใช้ฟีเจอร์นี้');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setSelectedLocation({ latitude, longitude });
    setRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
  };

  // Get token from AsyncStorage and post task with user_id
  const handlePostTask = async () => {
  try {
    // ดึง token
    const token = await AsyncStorage.getItem('userToken'); // ใช้ชื่อเดียวกัน
    if (!token) {
      Alert.alert('ข้อผิดพลาด', 'คุณต้องเข้าสู่ระบบก่อน');
      return;
    }

    // ถอดรหัส token เพื่อดึง user_id
const decodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken); // ตรวจสอบโครงสร้าง token

    const user_id = decodedToken?.user_id || decodedToken?.id; // ตรวจสอบว่าค่าถูกต้อง

    if (!user_id) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้จาก Token ได้');
      return;
    }

    // ส่งข้อมูลไปยัง API
    const response = await fetch('http://10.30.136.56:3001/tasks/add-tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // เผื่อ API ต้องการ Authentication
      },
      body: JSON.stringify({
        title: name,
        description: mission,
        createdBy: user_id, // ส่ง user_id
        reward: reward,
        address: address,
      }),
    });

    const data = await response.json();
    console.log('Task Created:', data);
    Alert.alert('สำเร็จ', 'ภารกิจถูกสร้างเรียบร้อยแล้ว!');
  } catch (error) {
    console.error('Error posting task:', error);
    Alert.alert('ข้อผิดพลาด', 'ไม่สามารถสร้างภารกิจได้');
  }
};

  const createMission = () => {
    if (!name || !address || !mission) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    Alert.alert(
      'ภารกิจถูกสร้างแล้ว!',
      `ชื่อ: ${name}\nที่อยู่: ${address}\nภารกิจ: ${mission}\nของตอบแทน: ${reward || 'ไม่มีระบุ'}`
    );

    // ล้างฟอร์ม
    setName('');
    setAddress('');
    setMission('');
    setReward('');
    setSelectedLocation(null);
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="โพส" />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>ชื่อ-นามสกุล</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="กรอกชื่อ-นามสกุล" />

        <Text style={styles.label}>ที่อยู่</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="กรอกที่อยู่" />

        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>📍 ใช้ตำแหน่งของฉัน</Text>
        </TouchableOpacity>

        <MapView style={styles.map} region={region} onPress={handleMapPress}>
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>

        <Text style={styles.label}>ภารกิจที่ต้องการให้ช่วย</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={mission}
          onChangeText={setMission}
          placeholder="กรอกภารกิจที่ต้องการให้ช่วย"
          multiline
        />

        <Text style={styles.label}>ของตอบแทน (ไม่จำเป็นต้องเป็นเงิน)</Text>
        <TextInput style={styles.input} value={reward} onChangeText={setReward} placeholder="กรอกของตอบแทน (ถ้ามี)" />

        <TouchableOpacity style={styles.button} onPress={createMission}>
          <Text style={styles.buttonText}>สร้างภารกิจ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
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

  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  locationButton: {
    backgroundColor: '#34c759',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
});
