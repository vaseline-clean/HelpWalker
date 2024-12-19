import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/CustomHeader';

export default function FeedScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  // ฟังก์ชันสำหรับการนำทางไปยังหน้ารายละเอียดภารกิจ
  const handleAcceptMission = () => {
    navigation.navigate('MissionDetails', {
      missionTitle: 'ต้องการคนช่วยลดน้ำต้นไม้ที่บ้าน',
      missionDetails:
        'ลดต้นไม้หน้าบ้านทั้งหมด และหลังบ้าน ใช้ที่รดน้ำต้นไม้... ' +
        'ควรใช้น้ำแรงพอประมาณเพื่อไม่ให้ดินกระเด็นไปทั่ว',
      creatorName: 'Munin Phoolphon',
      creatorPhone: '080-xxx-xxxx',
      creatorIcon: require('./assets/creator_icon.png'), // เพิ่ม icon ของ creator
      address: '99 หมู่ 9 ตำบล ห้วยแถ่ อำเภอ ชนบท จังหวัด ขอนแก่น 41350',
    });
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
        <Image source={require('./assets/user_icon.png')} style={styles.userIcon} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>Munin Phoolphon</Text>
          <Text style={styles.userPhone}>080-xxx-xxxx</Text>
        </View>
      </View>

      {/* Mission Box */}
      <View style={styles.missionBox}>
        {/* Creator Icon */}
        <View style={styles.creatorInfo}>
          <Image source={require('./assets/creator_icon.png')} style={styles.creatorIcon} />
          <Text style={styles.creatorName}>ภารกิจโดย: Munin Phoolphon</Text>
        </View>

        {/* ข้อมูลภารกิจ */}
        <Text style={styles.missionInfo}>
          ภารกิจ: ลดน้ำต้นไม้ที่บ้าน {'\n'}เวลาสิ้นสุด: 12 ธันวาคม 2024
        </Text>

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
    padding: 20,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  creatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
  },
  missionInfo: {
    fontSize: 14,
    color: '#004d40',
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: '#00796b',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
