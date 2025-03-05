import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [user_email, setEmail] = useState('');
  const [user_password, setPassword] = useState('');

  const handleLogin = async () => {
    if (user_email === '' || user_password === '') {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }

    try {
      const response = await fetch('http://10.30.136.55:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_email, user_password }),
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
        // บันทึก token ลงใน AsyncStorage หรือ Context ไว้ใช้งานในการเรียก API ต่อไป
        // และนำทางไปยัง FeedScreen หลังจากล็อกอินสำเร็จ
        navigation.replace('MainTabs');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาดในการล็อกอิน');
      }
    } catch (error) {
      if (error.message === 'Network request failed') {
        alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      } else {
        alert('เกิดข้อผิดพลาดในการล็อกอิน');
      }
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>เข้าสู่ระบบ</Text>

      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        keyboardType="email-address"
        value={user_email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        secureTextEntry
        value={user_password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ล็อกอิน</Text>
      </TouchableOpacity>

      {/* ปุ่มสำหรับไปยัง AnotherLoginScreen */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('AnotherLoginScreen')}
      >
        <Text style={styles.linkText}>เลือกวิธีการเข้าสู่ระบบอื่น</Text>
      </TouchableOpacity>
      
      {/* ปุ่มสำหรับไปยังหน้าสมัคร */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('SindupScreen')}
      >
        <Text style={styles.linkText1}>ยังไม่มีบัญชี?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  linkText1: {
    color: '#FF0033',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
