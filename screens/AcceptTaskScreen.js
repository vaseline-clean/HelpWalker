import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AcceptTaskScreen({ navigation }) {
  const [taskId, setTaskId] = useState(null); // state เพื่อเก็บ taskId
  const [task, setTask] = useState(null); // state เพื่อเก็บข้อมูลภารกิจ
  const [loading, setLoading] = useState(true); // state เพื่อจัดการสถานะการโหลด

  useEffect(() => {
    // ดึง taskId จาก AsyncStorage
    const fetchTaskId = async () => {
      const storedTaskId = await AsyncStorage.getItem('taskId');
      if (storedTaskId) {
        setTaskId(storedTaskId); // ถ้ามี taskId ให้เซ็ตไว้ใน state
        console.log("taskId saved:", storedTaskId);
      } else {
        console.log("taskId is missing");
      }
    };

    fetchTaskId();
  }, []);

  useEffect(() => {
    // ตรวจสอบว่า taskId มีค่าหรือไม่
    if (!taskId) {
      setLoading(false); // ถ้าไม่มี taskId ให้หยุดการโหลด
      return;
    }

    // ดึงข้อมูลภารกิจจาก API
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://10.30.136.56:3001/tasks/${taskId}`);
        setTask(response.data);
        setLoading(false);
        console.log("Task Data:", response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]); // ฟังการเปลี่ยนแปลงของ taskId

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
            const response = await fetch(`http://10.30.136.56:3001/tasks/${taskId}/accept`, {
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  missionDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  missionDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
  userPhone: {
    fontSize: 16,
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#333',
  },
  reward: {
    fontSize: 16,
    color: '#333',
  },
  map: {
    height: 250,
    borderRadius: 12,
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  redoButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
