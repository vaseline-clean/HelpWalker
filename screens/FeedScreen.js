import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode'; // Fix import statement

export default function FeedScreen({ route, navigation }) {
  const [missions, setMissions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 📌 ฟังก์ชันดึงข้อมูลภารกิจ
  const fetchAllTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      console.log("User ID:", userId); // ตรวจสอบค่า userId ที่ดึงมา

      const response = await fetch('http://10.30.136.56:3001/tasks/get-allTasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Fetched Data:", data); // ตรวจสอบข้อมูลที่ได้รับ

        // ✅ แปลง userId เป็น string ถ้าจำเป็น แล้วกรองเฉพาะภารกิจที่ไม่ใช่ของผู้ใช้
        const filteredMissions = data.filter(task => task.status !== 'completed' && String(task.userId) !== String(userId));
        
        setMissions(filteredMissions);
      } else {
        Alert.alert('ข้อผิดพลาด', data.message || 'ไม่สามารถดึงข้อมูลภารกิจได้');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลภารกิจได้');
    } finally {
      setIsRefreshing(false);
    }
  };

  // 📌 รีเฟรชข้อมูลเมื่อหน้าจอโฟกัส
  useFocusEffect(
    React.useCallback(() => {
      fetchAllTasks();
    }, [])
  );

  // 📌 อัปเดตรายการเมื่อมีการรับ params จากหน้ารายละเอียดภารกิจ
  useEffect(() => {
    if (route.params?.completedMissionId) {
      setMissions(prevMissions => prevMissions.filter(mission => mission._id !== route.params.completedMissionId));
    }
    if (route.params?.acceptedTask) {
      setMissions(prevMissions => prevMissions.filter(mission => mission._id !== route.params.acceptedTask._id));
    }
  }, [route.params?.completedMissionId, route.params?.acceptedTask]);

  const handlePress = (mission) => {
    navigation.navigate('MissionDetailsScreen', { mission });
  };

  // 📌 ฟังก์ชันรีเฟรชข้อมูล
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAllTasks();
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ฟีด" />
      <FlatList
        data={missions}
        extraData={missions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.missionItem}>
            <Text style={styles.missionTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.reward}>🎁 {item.reward}</Text>
            <TouchableOpacity style={styles.detailsButton} onPress={() => handlePress(item)}>
              <Text style={styles.detailsButtonText}>ดูรายละเอียด</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีภารกิจ</Text>}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
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