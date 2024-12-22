import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
    } else {
      // นำทางไปยัง FeedScreen หลังจากล็อกอินสำเร็จ
      navigation.replace('MainTabs');
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
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ล็อกอิน</Text>
      </TouchableOpacity>

      {/*ปุ่มสำหรัยไปยังหน้าสมัคร*/}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('AnotherLoginScreen')}
      >
        <Text style={styles.linkText1}>ยังไม่มีบัญชี?</Text>
      </TouchableOpacity>

      {/* ปุ่มสำหรับไปยัง AnotherLoginScreen */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('AnotherLoginScreen')}
      >
        <Text style={styles.linkText}>เลือกวิธีการเข้าสู่ระบบอื่น</Text>
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
