import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function FeedScreen({ route, navigation }) {
  const [missions, setMissions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // state สำหรับจัดการการรีเฟรช

  // ฟังก์ชันในการดึงข้อมูลภารกิจจาก API
  const fetchAllTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.38.222:3000/tasks/get-allTasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMissions(data);
      } else {
        Alert.alert('ข้อผิดพลาด', data.message || 'ไม่สามารถดึงข้อมูลภารกิจได้');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลภารกิจได้');
    } finally {
      setIsRefreshing(false); // เมื่อการรีเฟรชเสร็จสิ้น
    }
  };

  // ดึงข้อมูลภารกิจเมื่อหน้าจอโฟกัส
  useFocusEffect(
    React.useCallback(() => {
      fetchAllTasks();
    }, []) // ทำงานเมื่อหน้าจอโฟกัส
  );

  // ใช้ effect นี้เพื่อตรวจจับการส่งข้อมูล newMission จากหน้าจอ PostScreen
  useEffect(() => {
    if (route.params?.newMission) {
      setMissions((prevMissions) => [route.params.newMission, ...prevMissions]); // เพิ่มภารกิจใหม่ที่ตำแหน่งแรก
    }
  }, [route.params?.newMission]);

  const handlePress = (mission) => {
    navigation.navigate('MissionDetailsScreen', { mission });
  };

  // ฟังก์ชันสำหรับการรีเฟรช
  const onRefresh = () => {
    setIsRefreshing(true); // กำหนดให้กำลังรีเฟรช
    fetchAllTasks(); // เรียกฟังก์ชันดึงข้อมูลใหม่
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ฟีด" />
      <FlatList
        data={missions}
        extraData={missions} // ให้ FlatList รีเฟรชเมื่อ missions เปลี่ยน
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.missionItem}>
            <Text style={styles.missionTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.reward}>🎁 {item.reward}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => handlePress(item)} // เมื่อกดปุ่มจะไปที่หน้ารายละเอียดภารกิจ
            >
              <Text style={styles.detailsButtonText}>ดูรายละเอียด</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีภารกิจ</Text>}
        // การเพิ่ม RefreshControl เพื่อใช้ในการรีเฟรชข้อมูล
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 1,
  },
  missionItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reward: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#0078fe',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  detailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
