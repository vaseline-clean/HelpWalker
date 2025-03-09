import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FeedScreen({ route, navigation }) {
  const [missions, setMissions] = useState([]);

  const fetchAllTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://10.30.136.56:3001/tasks/get-allTasks', {
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
    }
  };

  // เรียกใช้งาน fetchAllTasks เมื่อเริ่มต้น
  useEffect(() => {
    fetchAllTasks();
  }, []);

  // ใช้ useEffect เพื่อตรวจจับ newMission ที่ถูกส่งมาจาก PostScreen
  useEffect(() => {
    if (route.params?.newMission) {
      setMissions((prevMissions) => [route.params.newMission, ...prevMissions]);
    }
  }, [route.params?.newMission]);

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ฟีด" />
      
      {/* ปุ่มรีเฟรช */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchAllTasks}>
        <Text style={styles.refreshText}>รีเฟรช</Text>
      </TouchableOpacity>

      <FlatList
        data={missions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.missionItem}>
            <Text style={styles.missionTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.reward}>🎁 {item.reward}</Text>

            {/* ปุ่มดูรายละเอียด */}
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigation.navigate('MissionDetail', { missionId: item._id })}
            >
              <Text style={styles.buttonText}>ดูรายละเอียด</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีภารกิจ</Text>}
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
  refreshButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  refreshText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  detailButton: {
    backgroundColor: '#0078fe',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
