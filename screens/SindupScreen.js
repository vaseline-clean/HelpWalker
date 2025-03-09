import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_password: '',
    user_phone: '',
    user_address: '',
    score: 0, // ค่าเริ่มต้นเป็น 0
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignup = async () => {
    const { user_name, user_email, user_password, user_phone, user_address } = formData;
    if (!user_name || !user_email || !user_password || !user_phone || !user_address) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      const response = await fetch('http://10.30.136.56:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.clone().json();
      } catch (error) {
        const responseText = await response.text();
        console.error('Response text:', responseText);
        data = { message: responseText };
      }

      if (response.ok) {
        Alert.alert('สำเร็จ', 'สมัครใช้งานสำเร็จแล้ว');
        navigation.navigate('Login');
      } else {
        Alert.alert('ข้อผิดพลาด', data.message || 'เกิดข้อผิดพลาดในการสมัครใช้งาน');
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>สร้างบัญชีใหม่</Text>

      <TextInput
        style={styles.input}
        placeholder="ชื่อ"
        value={formData.user_name}
        onChangeText={(text) => handleInputChange('user_name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={formData.user_email}
        keyboardType="email-address"
        onChangeText={(text) => handleInputChange('user_email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        value={formData.user_password}
        secureTextEntry
        onChangeText={(text) => handleInputChange('user_password', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="เบอร์โทรศัพท์"
        value={formData.user_phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleInputChange('user_phone', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="ที่อยู่"
        value={formData.user_address}
        onChangeText={(text) => handleInputChange('user_address', text)}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>สมัครใช้งาน</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>กลับไปหน้าล็อคอิน</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f5ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  signupButton: {
    backgroundColor: '#6666ff',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: '#FF0033',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});