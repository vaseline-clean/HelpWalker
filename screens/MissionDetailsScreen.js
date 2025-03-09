import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function MissionDetailsScreen({ route, navigation }) {
  const { mission } = route.params;
  const { _id: taskId, title: missionTitle, description: missionDetails, createdBy, status, createdAt, updatedAt } = mission;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    axios.get(`http://10.30.136.56:3001/tasks/${taskId}?populate=createdBy`) // Include createdBy reference
      .then(response => {
        setTask(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to load task details'); // Set error message
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

  if (error) { // Display error message
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
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

  const { creatorName, creatorPhone, address } = task.createdBy; // Access createdBy details

  return (
    <View style={styles.container}>
      {/* ปุ่มย้อนกลับ */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
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
    fontSize: 20,
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
    marginBottom: 20,
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
