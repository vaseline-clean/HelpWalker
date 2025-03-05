import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';

export default function ProfindScreen({ navigation }) {
  const [profileData, setProfileData] = useState({
    name: '',
    email: 'example@gmail.com', // ค่าเริ่มต้นเป็นตัวอย่างอีเมล
    phone: '',
    address: '',
  });

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSaveProfile = async () => {
    const { name, phone, address } = profileData;
    if (!name || !phone || !address) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      // เรียก API สำหรับอัปเดตข้อมูลโปรไฟล์
      const response = await fetch('http://your-backend-url/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('สำเร็จ', 'อัปเดตโปรไฟล์เรียบร้อยแล้ว');
      } else {
        Alert.alert('ข้อผิดพลาด', data.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  const handleSelectImage = () => {
    Alert.alert('เปลี่ยนรูปภาพโปรไฟล์', 'ฟังก์ชันนี้อยู่ระหว่างการพัฒนา');
    // เพิ่มฟังก์ชันการเลือกรูปภาพโปรไฟล์ (เช่น Image Picker) ที่นี่
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>แก้ไขโปรไฟล์</Text>

      {/* รูปโปรไฟล์ */}
      <TouchableOpacity onPress={handleSelectImage}>
        <Image
          source={require('./assets/user_icon.png')} // ไฟล์ภาพ placeholder
          style={styles.profileImage}
        />
        <Text style={styles.changeImageText}>เปลี่ยนรูปภาพ</Text>
      </TouchableOpacity>

      {/* ชื่อ */}
      <TextInput
        style={styles.input}
        placeholder="ชื่อ"
        value={profileData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      {/* อีเมล */}
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={profileData.email}
        editable={false} // อีเมลเป็นข้อมูลที่ไม่สามารถแก้ไขได้
      />

      {/* เบอร์โทรศัพท์ */}
      <TextInput
        style={styles.input}
        placeholder="เบอร์โทรศัพท์"
        value={profileData.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleInputChange('phone', text)}
      />

      {/* ที่อยู่ */}
      <TextInput
        style={styles.input}
        placeholder="ที่อยู่"
        value={profileData.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />

      {/* ปุ่มบันทึก */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>บันทึกโปรไฟล์</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5ff',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changeImageText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  input: {
    width: '100%',
    height: 50,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
