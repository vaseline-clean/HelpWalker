import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function PostScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mission, setMission] = useState('');
  const [reward, setReward] = useState('');
  const [region, setRegion] = useState({
    latitude: 13.7563, // ค่าเริ่มต้น (กรุงเทพฯ)
    longitude: 100.5018,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);

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
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
  };

  // ฟังก์ชันเลือกตำแหน่งบนแผนที่
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
  };

  // ฟังก์ชันสร้างภารกิจ
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
        <TextInput style={[styles.input, styles.textArea]} value={mission} onChangeText={setMission} placeholder="กรอกภารกิจที่ต้องการให้ช่วย" multiline />

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

