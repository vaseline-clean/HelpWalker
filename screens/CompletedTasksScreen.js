import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const TaskCard = ({ task, onDelete, onRedo }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.status}>สถานะ: {String(task.status)}</Text>

      {/* ✅ ปุ่ม "ทำใหม่อีกครั้ง" และ "ลบ" อยู่ข้างกัน */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.redoButton} onPress={() => onRedo(task._id)}>
          <Text style={styles.buttonText}>ทำใหม่อีกครั้ง</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task._id)}>
          <Text style={styles.buttonText}>ลบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function CompletedTasksScreen({ navigation }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      setIsRefreshing(true);
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        const user_id = decodedToken?.user_id || decodedToken?.id;
        setUserId(user_id);

        const storedCompletedTasks = JSON.parse(await AsyncStorage.getItem('completedTasks')) || [];
        const userTasks = storedCompletedTasks.filter(task => task.createdBy === user_id);
        setCompletedTasks(userTasks);
      }
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลภารกิจที่เสร็จสิ้นได้');
    } finally {
      setIsRefreshing(false);
    }
  };

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

              const updatedTasks = completedTasks.filter((task) => task._id !== taskId);
              setCompletedTasks(updatedTasks);
              await AsyncStorage.setItem('completedTasks', JSON.stringify(updatedTasks));

              Alert.alert('สำเร็จ', 'ลบภารกิจเรียบร้อยแล้ว');
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
            const storedToken = await AsyncStorage.getItem('userToken');
            if (!storedToken) throw new Error("Token not found");

            // **📡 อัปเดตสถานะในเซิร์ฟเวอร์**
            const response = await fetch(`http://10.30.136.56:3001/tasks/${taskId}/redo`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`,
              },
              body: JSON.stringify({ status: 'pending' }), // 🔄 เปลี่ยนสถานะเป็น "pending"
            });

            if (!response.ok) throw new Error("Failed to update task status");

            // **🔄 อัปเดตใน AsyncStorage**
            const storedTasks = JSON.parse(await AsyncStorage.getItem('completedTasks')) || [];
            const taskToRedo = storedTasks.find(task => task._id === taskId);
            
            if (!taskToRedo) return;

            taskToRedo.status = 'pending';

            // ลบออกจาก completedTasks และเพิ่มกลับไปยัง pendingTasks
            const updatedCompletedTasks = storedTasks.filter(task => task._id !== taskId);
            await AsyncStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));

            const pendingTasks = JSON.parse(await AsyncStorage.getItem('pendingTasks')) || [];
            pendingTasks.push(taskToRedo);
            await AsyncStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));

            setCompletedTasks(updatedCompletedTasks);
            Alert.alert('สำเร็จ', 'ภารกิจถูกย้ายกลับไปยังรายการที่รอดำเนินการ');
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
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ประวัติภารกิจสำเร็จ" />

      <ScrollView 
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchCompletedTasks} />}
      >
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <TaskCard key={task._id} task={task} onDelete={handleDelete} onRedo={handleRedo} />
          ))
        ) : (
          <Text style={styles.noTaskText}>ไม่มีภารกิจที่เสร็จสิ้นในขณะนี้</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 1,
  },
  scrollView: {
    paddingBottom: 16,
  },
  noTaskText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    top: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  status: {
    fontSize: 14,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row', // ✅ ปุ่มอยู่ข้างกัน
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
