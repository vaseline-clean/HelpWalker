import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AcceptTaskScreen({ route, navigation }) {
  const { taskId } = route.params || {}; // Add a default empty object to handle undefined route.params
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    axios.get(`http://10.30.136.56:3001/tasks/${taskId}`)
      .then(response => {
        setTask(response.data);
        setLoading(false);
        console.log("Task Data:", response.data);
      })
      .catch(error => {
        console.error("Error fetching task:", error);
        setLoading(false);
      });
  }, [taskId]);

  const handleDelete = async (taskId) => {
    Alert.alert(
      "ยืนยันการลบ?",
      "คุณแน่ใจหรือไม่ว่าต้องการลบภารกิจนี้?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบ",
          onPress: async () => {
            try {
              const storedToken = await AsyncStorage.getItem('userToken');
              await fetch(`http://10.30.136.56:3001/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${storedToken}`,
                },
              });

              Alert.alert('สำเร็จ', 'ลบภารกิจเรียบร้อยแล้ว');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('ข้อผิดพลาด', 'ไม่สามารถลบภารกิจได้');
            }
          },
        },
      ]
    );
  };

  const handleRedo = async (taskId) => {
    Alert.alert(
      "ยืนยันการทำใหม่?",
      "คุณต้องการย้ายภารกิจนี้กลับไปที่รายการรอดำเนินการหรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ยืนยัน",
          onPress: async () => {
            try {
              const storedTasks = JSON.parse(await AsyncStorage.getItem('completedTasks')) || [];
              const taskToRedo = storedTasks.find(task => task._id === taskId);
              
              if (!taskToRedo) return;

              // อัปเดตสถานะเป็น 'pending'
              taskToRedo.status = 'pending';

              // ลบออกจาก completedTasks และเพิ่มกลับไปยัง pendingTasks
              const updatedCompletedTasks = storedTasks.filter(task => task._id !== taskId);
              await AsyncStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));

              const pendingTasks = JSON.parse(await AsyncStorage.getItem('pendingTasks')) || [];
              pendingTasks.push(taskToRedo);
              await AsyncStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));

              Alert.alert('สำเร็จ', 'ภารกิจถูกย้ายกลับไปยังรายการที่รอดำเนินการ');
              navigation.goBack();
            } catch (error) {
              console.error('Error updating task status:', error);
              Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะภารกิจได้');
            }
          },
        },
      ]
    );
  };

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

  const { title, description, creatorName, creatorPhone, address, reward, latitude, longitude } = task;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* รายละเอียดภารกิจ */}
      {title || description ? (
        <View style={styles.card}>
          {title && <Text style={styles.missionTitle}>{title}</Text>}
          {description && (
            <>
              <Text style={styles.missionDetailsTitle}>รายละเอียดภารกิจ</Text>
              <Text style={styles.missionDetails}>{description}</Text>
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
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`http://10.30.136.56:3001/tasks/${taskId}/accept`, { // Update the URL to include /accept
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

            Alert.alert('สำเร็จ', 'คุณได้รับภารกิจเรียบร้อยแล้ว');
            console.log("Task Accepted:", task);
          } catch (error) {
            console.error('Error accepting task:', error);
            Alert.alert('ข้อผิดพลาด', `ไม่สามารถรับภารกิจได้: ${error.message}`);
          }
        }}
      >
        <Text style={styles.acceptButtonText}>✅ รับภารกิจ</Text>
      </TouchableOpacity>

      {/* ปุ่มทำใหม่และลบ */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.redoButton} onPress={() => handleRedo(task._id)}>
          <Text style={styles.buttonText}>ทำใหม่อีกครั้ง</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(task._id)}>
          <Text style={styles.buttonText}>ลบ</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row', // ปุ่มอยู่ข้างกัน
    justifyContent: 'space-between',
    marginTop: 10,
  },
  redoButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 8,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
