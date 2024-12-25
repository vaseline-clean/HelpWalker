import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';

export default function PostScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mission, setMission] = useState('');
  const [reward, setReward] = useState('');

  // ฟังก์ชันสำหรับการสร้างโพสต์ภารกิจ
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
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="โพส" />

      {/* ฟอร์มสำหรับการสร้างภารกิจ */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>ชื่อ-นามสกุล</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="กรอกชื่อ-นามสกุล"
        />

        <Text style={styles.label}>ที่อยู่</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="กรอกที่อยู่"
        />

        <Text style={styles.label}>ภารกิจที่ต้องการให้ช่วย</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={mission}
          onChangeText={setMission}
          placeholder="กรอกภารกิจที่ต้องการให้ช่วย"
          multiline
        />

        <Text style={styles.label}>ของตอบแทน (ไม่จำเป็นต้องเป็นเงิน)</Text>
        <TextInput
          style={styles.input}
          value={reward}
          onChangeText={setReward}
          placeholder="กรอกของตอบแทน (ถ้ามี)"
        />

        {/* ปุ่มสร้างภารกิจ */}
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
