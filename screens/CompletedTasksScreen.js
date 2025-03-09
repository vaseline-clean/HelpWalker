import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskCard = ({ task }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.status}>สถานะ: {task.status}</Text> {/* Show status */}
    </View>
  );
};

export default function CompletedTasksScreen({ navigation }) {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const storedCompletedTasks = JSON.parse(await AsyncStorage.getItem('completedTasks')) || [];
        setCompletedTasks(storedCompletedTasks);
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