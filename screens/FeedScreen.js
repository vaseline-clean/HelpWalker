import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';

export default function FeedScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  // ฟังก์ชันสำหรับการแสดงรายละเอียดภารกิจ
  const handleAcceptMission = () => {
    Alert.alert(
      'รายละเอียดภารกิจ',
      'นี่คือภารกิจที่คุณต้องทำ: \n- เป้าหมาย: เก็บขยะในพื้นที่สาธารณะ\n- เวลาสิ้นสุด: 12 ธันวาคม 2024',
      [{ text: 'ตกลง', onPress: () => console.log('Mission Accepted') }]
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        showSearchBar={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* User Info Box */}
      <View style={styles.userInfoBox}>
        <Image 
          source={require('./assets/user_icon.png')} 
          style={styles.userIcon} 
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userPhone}>+66 64 103 4071</Text>
        </View>
      </View>

      {/* Mission Box */}
      <View style={styles.missionBox}>
        {/* ชื่อผู้สร้าง */}
        <Text style={styles.creatorName}>ผู้สร้าง: Alice</Text>

        {/* ข้อมูลภารกิจ */}
        <Text style={styles.missionInfo}>
          ภารกิจ: เก็บขยะในพื้นที่สาธารณะ{'\n'}เวลาสิ้นสุด: 12 ธันวาคม 2024
        </Text>

        {/* Creator Icon */}
        <Image 
          source={require('./assets/creator_icon.png')} 
          style={styles.creatorIcon} 
        />

        {/* ปุ่มรับภารกิจ */}
        <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptMission}>
          <Text style={styles.acceptButtonText}>รับภารกิจ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userPhone: {
    fontSize: 14,
    color: '#555',
  },
  missionBox: {
    margin: 10,
    padding: 30,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 5,
  },
  missionInfo: {
    fontSize: 14,
    color: '#004d40',
    marginBottom: 10,
  },
  creatorIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  acceptButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#00796b',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
