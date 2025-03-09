import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const TaskCard = ({ task }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.status}>สถานะ: {String(task.status)}</Text> 
    </View>
  );
};

export default function CompletedTasksScreen({ navigation }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
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

    fetchCompletedTasks();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ประวัติภารกิจสำเร็จ" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
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
});