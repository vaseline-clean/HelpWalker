import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';// Import AsyncStorage

export default function MissionDetailsScreen({ route, navigation }) {
  const { mission } = route.params;

  // Check if mission is undefined
  if (!mission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>ไม่พบข้อมูลภารกิจ</Text>
      </View>
    );
  }

  const { _id: taskId, title: missionTitle, description: missionDetails } = mission;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptedTasks, setAcceptedTasks] = useState([]); // New state variable

  useEffect(() => {
    axios.get(`http://10.30.136.56:3001/tasks/${taskId}`)
      .then(response => {
        setTask(response.data);
        setLoading(false);
        console.log("Task Data:", response.data); // ตรวจสอบข้อมูลจาก API
      })
      .catch(error => {
        console.error("Error fetching task:", error);
        setLoading(false);
      });

  }, [taskId, mission.createdBy]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>ไม่พบข้อมูลภารกิจ</Text>
      </View>
    );
  }

  const { creatorName, creatorPhone, address, reward, latitude, longitude } = task;

  console.log("Extracted Coordinates:", latitude, longitude);

  const handleAcceptMission = async () => {
    try {
      // บันทึก taskId ลงใน AsyncStorage
      await AsyncStorage.setItem('taskId', taskId);
      console.log('taskId saved:', taskId);

      // นำทางไปยังหน้าถัดไปพร้อมกับข้อมูล
      navigation.navigate('ChatScreen', {
        chat: {
          sender: { _id: taskId, name: creatorName, phone: creatorPhone },
          missionTitle
        },
        taskId // ส่ง taskId ไปด้วย
      });
    } catch (error) {
      console.error('Failed to save taskId:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* รายละเอียดภารกิจ */}
      {missionTitle || missionDetails ? (
        <View style={styles.card}>
          {missionTitle && <Text style={styles.missionTitle}>{missionTitle}</Text>}
          {missionDetails && (
            <>
              <Text style={styles.missionDetailsTitle}>รายละเอียดภารกิจ</Text>
              <Text style={styles.missionDetails}>{missionDetails}</Text>
            </>
          )}
        </View>
      ) : null}

      {/* ข้อมูลผู้สร้างภารกิจ */}
      {creatorName || creatorPhone ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 ผู้สร้างภารกิจ</Text>
          {creatorName && <Text style={styles.userName}>{creatorName}</Text>}
          {creatorPhone && <Text style={styles.userPhone}>📞 {creatorPhone}</Text>}
        </View>
      ) : null}

      {/* ที่อยู่ของผู้สร้างภารกิจ */}
      {address ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📍 ที่อยู่</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
      ) : null}

      {/* ของตอบแทน */}
      {reward ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎁 ของตอบแทน</Text>
          <Text style={styles.reward}>{reward}</Text>
        </View>
      ) : null}

      {/* แผนที่ */}
      {latitude && longitude ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🗺 ตำแหน่งภารกิจ</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        </View>
      ) : (
        <Text style={styles.errorText}>❌ ไม่พบตำแหน่งพิกัด</Text>
      )}

      {/* ปุ่มรับภารกิจ */}
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={async () => {
          try {
            // Remove the task from the feed
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`http://10.30.136.56:3001/tasks/${taskId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ status: 'accepted' }),
            });

            if (!response.ok) {
              if (response.status === 404) {
                throw new Error('Task not found. It might have been removed.');
              }
              const errorText = await response.text();
              throw new Error(`Network response was not ok: ${errorText}`);
            }

            // Refresh accepted tasks
            const acceptedTasksResponse = await fetch(`http://10.30.136.56:3001/tasks/accepted?createdBy=${task.createdBy}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });

            if (!acceptedTasksResponse.ok) {
              const errorText = await acceptedTasksResponse.text();
              throw new Error(`Network response was not ok: ${errorText}`);
            }

            const acceptedTasksText = await acceptedTasksResponse.text();
            let acceptedTasks;
            try {
              acceptedTasks = JSON.parse(acceptedTasksText);
            } catch (error) {
              throw new Error('Failed to parse JSON response');
            }

            await AsyncStorage.setItem('acceptedTasks', JSON.stringify(acceptedTasks));

            // Show success alert
            Alert.alert('สำเร็จ', 'คุณได้รับภารกิจเรียบร้อยแล้ว');
            console.log("Task Accepted:", task);
          } catch (error) {
            console.error('Error accepting task:', error);
            Alert.alert('ข้อผิดพลาด', `ไม่สามารถรับภารกิจได้: ${error.message}`);
          }
        }}
        <Text style={styles.acceptButtonText}>✅ รับภารกิจ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  missionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  missionDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#555',
  },
  missionDetails: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0078fe',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#555',
  },
  address: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  reward: {
    fontSize: 16,
    color: '#d97706',
    fontWeight: 'bold',
    lineHeight: 22,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
