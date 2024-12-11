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
      <TouchableOpacity style={[styles.button, styles.phoneButton]} onPress={handlePhoneLogin}>
      <Image source={require('../screens/assets/Phone.png')} style={styles.icon} />
        <Text style={styles.buttonText}>ล็อกอินด้วยเบอร์โทรศัพท์</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#4267B2',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  phoneButton: {
    backgroundColor: '#34A853',
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
});
