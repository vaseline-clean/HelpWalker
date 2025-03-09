import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const TaskCard = ({ task, onDelete }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.status}>สถานะ: {String(task.status)}</Text> 
      {/* ปุ่มลบ */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task._id)}>
        <Text style={styles.buttonText}>ลบ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function CompletedTasksScreen({ navigation }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchCompletedTasks(); // เรียกฟังก์ชันเพื่อดึงข้อมูลเมื่อเริ่มต้น
  }, []);

  const fetchCompletedTasks = async () => {
    try {
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
              // ลบข้อมูลจากฐานข้อมูล
              const storedToken = await AsyncStorage.getItem('userToken');
              await fetch(`http://10.30.136.56:3001/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${storedToken}`,
                },
              });

              // ลบจาก AsyncStorage
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

  const handleRefresh = () => {
    fetchCompletedTasks(); // เรียกฟังก์ชันเพื่อรีเฟรชข้อมูล
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ประวัติภารกิจสำเร็จ" />
      
      {/* ปุ่มรีเฟรช */}
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.buttonText}>รีเฟรช</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <TaskCard key={task._id} task={task} onDelete={handleDelete} />
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
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  refreshButton: {
    margin: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
