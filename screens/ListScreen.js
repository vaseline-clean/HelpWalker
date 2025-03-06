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

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
      console.log('Stored Token:', storedToken); // Debugging token
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://10.30.136.56:3001/tasks');
        const data = await response.json();
        console.log('Fetched Tasks:', data); // Debugging fetched tasks
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลภารกิจได้');
      }
    };

    fetchTasks();
  }, [token]);

  const handleComplete = (id) => {
    console.log(`ภารกิจ ${id} เสร็จแล้ว`);
  };

  const handleDelete = (id) => {
    console.log(`ลบภารกิจ ${id}`);
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="รายการ" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={() => handleComplete(task.id)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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