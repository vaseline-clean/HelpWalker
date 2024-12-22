import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function AnotherLoginScreen({ navigation }) {
  const handleFacebookLogin = () => {
    alert('เข้าสู่ระบบด้วย Facebook');
    // เพิ่มฟังก์ชันการล็อกอิน Facebook ที่นี่
  };

  const handleGoogleLogin = () => {
    alert('เข้าสู่ระบบด้วย Google');
    // เพิ่มฟังก์ชันการล็อกอิน Google ที่นี่
  };

  const handlePhoneLogin = () => {
    alert('เข้าสู่ระบบด้วยเบอร์โทรศัพท์');
    // เพิ่มฟังก์ชันการล็อกอินด้วยเบอร์โทรศัพท์ที่นี่
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เลือกวิธีการเข้าสู่ระบบ</Text>

      {/* ปุ่มล็อกอินด้วย Facebook */}
      <TouchableOpacity style={[styles.button, styles.facebookButton]} onPress={handleFacebookLogin}>
        <Image source={require('../screens/assets/facebook.png')} style={styles.icon} />
        <Text style={styles.buttonText}>ล็อกอินด้วย Facebook</Text>
      </TouchableOpacity>

      {/* ปุ่มล็อกอินด้วย Google */}
      <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin}>
        <Image source={require('../screens/assets/google.png')} style={styles.icon} />
        <Text style={styles.buttonText}>ล็อกอินด้วย Google</Text>
      </TouchableOpacity>

      {/* ปุ่มล็อกอินด้วยเบอร์โทรศัพท์ */}
      {/* <TouchableOpacity style={[styles.button, styles.phoneButton]} onPress={handlePhoneLogin}>
        <Image source={require('../screens/assets/Phone.png')} style={styles.icon} />
        <Text style={styles.buttonText}>ล็อกอินด้วยเบอร์โทรศัพท์</Text>
      </TouchableOpacity> */}

      {/* ปุ่มกลับไปหน้า LoginScreen */}
      <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>กลับไปหน้าล็อคอิน</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  facebookButton: {
    backgroundColor: '#6666ff',
  },
  googleButton: {
    backgroundColor: '#FF6666',
  },
  phoneButton: {
    backgroundColor: '#34A853',
  },
  backButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  linkText: {
    color: '#FF0033',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
