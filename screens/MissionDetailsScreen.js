import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function MissionDetailsScreen({ route, navigation }) {
  const { mission } = route.params;
  const { _id: taskId, title: missionTitle, description: missionDetails, createdBy, status, createdAt, updatedAt } = mission;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://10.30.136.56:3001/tasks/${taskId}`)
      .then(response => {
        setTask(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [taskId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task not found</Text>
      </View>
    );
  }

  const { creatorName, creatorPhone, address } = task;

  return (
    <View style={styles.container}>
      {/* ข้อมูลผู้สร้างภารกิจ */}
      <View style={styles.card}>
        <Text style={styles.userName}>{creatorName}</Text>
        <Text style={styles.userPhone}>{creatorPhone}</Text>
      </View>

      {/* รายละเอียดภารกิจ */}
      <View style={styles.card}>
        <Text style={styles.missionTitle}>{missionTitle}</Text>
        <Text style={styles.missionDetailsTitle}>รายละเอียดภารกิจ</Text>
        <Text style={styles.missionDetails}>{missionDetails}</Text>
      </View>

      {/* ที่อยู่ */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>ที่อยู่ของผู้สร้างภารกิจ</Text>
        <Text style={styles.address}>{address}</Text>
      </View>

      {/* ปุ่มรับภารกิจ */}
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => navigation.navigate('ChatScreen', { 
          creatorName, 
          creatorPhone, 
          missionTitle 
        })}
      >
        <Text style={styles.acceptButtonText}>รับภารกิจ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  userPhone: {
    fontSize: 16,
    color: '#555',
  },
  missionTitle: {
    fontSize: 18,
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
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
