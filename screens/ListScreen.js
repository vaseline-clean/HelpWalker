import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const TaskCard = ({ task, onComplete, onDelete }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={onComplete}>
          <Text style={styles.buttonText}>เสร็จ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
          <Text style={styles.buttonText}>ลบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        setUserId(decodedToken.user_id);
      }
    };
    getToken();
  }, []);

  const fetchTasks = async () => {
    try {
      if (!token || !userId) return;

      const response = await fetch(`http://10.30.136.56:3001/tasks/user-tasks/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลภารกิจได้');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token, userId]);

  const handleComplete = async (task) => {
    Alert.alert(
      "ยืนยันการเสร็จสิ้น?",
      "คุณแน่ใจหรือไม่ว่าต้องการทำภารกิจนี้ให้สำเร็จ?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ยืนยัน",
          onPress: async () => {
            try {
              await fetch(`http://10.30.136.56:3001/tasks/${task._id}/complete`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              const completedTasks = JSON.parse(await AsyncStorage.getItem('completedTasks')) || [];
              await AsyncStorage.setItem('completedTasks', JSON.stringify([...completedTasks, task]));
              
              setTasks((prevTasks) => prevTasks.filter((t) => t._id !== task._id));
            } catch (error) {
              console.error('Error completing task:', error);
              Alert.alert('ข้อผิดพลาด', 'ไม่สามารถทำภารกิจให้สำเร็จได้');
            }
          },
        },
      ]
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      "ยืนยันการลบ?",
      "คุณแน่ใจหรือไม่ว่าต้องการลบภารกิจนี้?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบ",
          onPress: async () => {
            try {
              await fetch(`http://10.30.136.56:3001/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });

              setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('ข้อผิดพลาด', 'ไม่สามารถลบภารกิจได้');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="รายการ" />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchTasks}>
          <Text style={styles.refreshText}>รีเฟรช</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('CompletedTasksScreen')}>
          <Text style={styles.historyText}>ประวัติภารกิจสำเร็จ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onComplete={() => handleComplete(task)}
              onDelete={() => handleDelete(task._id)}
            />
          ))
        ) : (
          <Text style={styles.noTaskText}>ไม่มีภารกิจในขณะนี้</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    flex: 1,
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  historyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
    marginHorizontal: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
