import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'; // เพิ่ม Text และ TouchableOpacity
import CustomHeader from '../components/CustomHeader'; 

// คอมโพเนนต์ TaskCard
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

// หน้าจอ ListScreen
export default function ListScreen({ navigation }) {
  const tasks = [
    {
      id: 1,
      title: 'รัตพงษ์ ปานเจริญ',
      description: 'มาเก็บมะม่วงที่บ้านในถึงที่43ยอดต้นที่38ต้นที่22',
    },
    {
      id: 2,
      title: 'ตัวอย่างภารกิจที่ 2',
      description: 'รายละเอียดของภารกิจที่ 2',
    },
  ];

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
