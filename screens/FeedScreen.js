import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export default function FeedScreen({ navigation }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false); // เพิ่ม state โหลดข้อมูล

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
      <TouchableOpacity style={styles.refreshButton} onPress={fetchMissions}>
        <Text style={styles.refreshText}>รีเฟรช</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0078fe" />
      ) : missions.length > 0 ? (
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.missionItem}>
              <Text style={styles.missionTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.reward}>รางวัล: {item.reward}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>ไม่มีภารกิจ</Text>
      )}
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
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: '#0078fe',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
  },
});

