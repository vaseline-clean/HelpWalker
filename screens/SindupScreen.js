import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    score: 0, // ค่าเริ่มต้นเป็น 0
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignup = async () => {
    const { name, email, password, phone, address } = formData;
    if (!name || !email || !password || !phone || !address) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      const response = await fetch('http://your-backend-url/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('สำเร็จ', 'สมัครใช้งานสำเร็จแล้ว');
        navigation.navigate('Login');
      } else {
        Alert.alert('ข้อผิดพลาด', data.message || 'เกิดข้อผิดพลาดในการสมัครใช้งาน');
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert('สมัครใช้งานด้วย Google', 'ฟังก์ชันนี้อยู่ระหว่างการพัฒนา');
    // เพิ่มฟังก์ชันการสมัครด้วย Google ที่นี่
  };

  const handleFacebookSignup = () => {
    Alert.alert('สมัครใช้งานด้วย Facebook', 'ฟังก์ชันนี้อยู่ระหว่างการพัฒนา');
    // เพิ่มฟังก์ชันการสมัครด้วย Facebook ที่นี่
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>สร้างบัญชีใหม่</Text>

      {/* ฟอร์มกรอกข้อมูล */}
      <TextInput
        style={styles.input}
        placeholder="ชื่อ"
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={formData.email}
        keyboardType="email-address"
        onChangeText={(text) => handleInputChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        value={formData.password}
        secureTextEntry
        onChangeText={(text) => handleInputChange('password', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="เบอร์โทรศัพท์"
        value={formData.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleInputChange('phone', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="ที่อยู่"
        value={formData.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />

      {/* ปุ่มสมัครใช้งาน */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>สมัครใช้งาน</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
         style={styles.linkButton}
         onPress={() => navigation.navigate('AnotherLoginScreen')}
         >
            <Text style={styles.linkText1}>เลือกวิธีสมัครแบบอื่น</Text>
      </TouchableOpacity>


      {/* ปุ่มกลับไปหน้าล็อคอิน */}
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
  orText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: '#FF0033',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  linkText1: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
