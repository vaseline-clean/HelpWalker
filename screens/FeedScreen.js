import React, { useState, useEffect } from 'react';

import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function FeedScreen({ navigation }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false); // เพิ่ม state โหลดข้อมูล


  useEffect(() => {
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

    fetchAllTasks();
  }, []);

  // ใช้ useEffect เพื่อตรวจจับ newMission ที่ถูกส่งมาจาก PostScreen


  useEffect(() => {
    fetchMissions();
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        return token;
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      console.error('Error getting token:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลโทเค็นได้');
    }
  };

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      const response = await fetch('http://10.30.136.56:3001/tasks/all-tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseText = await response.text();
      console.log('Response Status:', response.status);
      console.log('Response Text:', responseText);

      if (response.status === 200) {
        try {
          const data = JSON.parse(responseText);
          console.log('Parsed Data:', data);
          if (Array.isArray(data) && data.length > 0) {
            setMissions(data);
            console.log('Missions set:', data);
          } else {
            setMissions([]);
            console.log('No missions found');
          }
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          Alert.alert('ข้อผิดพลาด', 'ข้อมูลจากเซิร์ฟเวอร์ไม่ถูกต้อง');
        }
      } else {
        console.error('Error fetching missions:', responseText);
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลภารกิจได้');
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลภารกิจได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ฟีด" />

      <FlatList
        data={missions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.missionItem}>
            <Text style={styles.missionTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.reward}>🎁 {item.reward}</Text>
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
    padding: 10,
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
});

