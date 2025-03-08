import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';

export default function CompletedTasksScreen({ navigation }) {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const storedTasks = await AsyncStorage.getItem('completedTasks');
      if (storedTasks) {
        setCompletedTasks(JSON.parse(storedTasks));
      }
    };
    fetchCompletedTasks();
  }, []);

  const clearHistory = async () => {
    Alert.alert("ล้างประวัติ?", "คุณแน่ใจหรือไม่ว่าต้องการลบภารกิจทั้งหมด?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        onPress: async () => {
          await AsyncStorage.removeItem('completedTasks');
          setCompletedTasks([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ประวัติภารกิจ" />
      
      <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
        <Text style={styles.clearText}>ล้างประวัติ</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {completedTasks.length > 0 ? (
          completedTasks.map((task, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.title}>{task.title}</Text>
              <Text style={styles.description}>{task.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTaskText}>ยังไม่มีภารกิจที่เสร็จสิ้น</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  scrollView: { paddingBottom: 16 },
  noTaskText: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 16, elevation: 3 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 14, color: '#666' },
  clearButton: { backgroundColor: '#FF5733', padding: 10, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  clearText: { color: '#fff', fontWeight: 'bold' },
});
