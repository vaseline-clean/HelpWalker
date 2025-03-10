import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function MissionDetailsScreen({ route, navigation }) {
  const { mission } = route.params;
  const { _id: taskId, title: missionTitle, description: missionDetails } = mission;
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>ไม่พบข้อมูลภารกิจ</Text>
      </View>
    );
  }

  const { creatorName, creatorPhone, address, reward } = task;

  return (
    <View style={styles.container}>
      {/* รายละเอียดภารกิจ */}
      {missionTitle || missionDetails ? (
        <View style={styles.card}>
          {missionTitle && <Text style={styles.missionTitle}>{missionTitle}</Text>}
          {missionDetails && (
            <>
              <Text style={styles.missionDetailsTitle}>รายละเอียดภารกิจ</Text>
              <Text style={styles.missionDetails}>{missionDetails}</Text>
            </>
          )}
        </View>
      ) : null}

      {/* ข้อมูลผู้สร้างภารกิจ */}
      {creatorName || creatorPhone ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 ผู้สร้างภารกิจ</Text>
          {creatorName && <Text style={styles.userName}>{creatorName}</Text>}
          {creatorPhone && <Text style={styles.userPhone}>📞 {creatorPhone}</Text>}
        </View>
      ) : null}

      {/* ที่อยู่ของผู้สร้างภารกิจ */}
      {address ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📍 ที่อยู่</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
      ) : null}

      {/* ของตอบแทน */}
      {reward ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎁 ของตอบแทน</Text>
          <Text style={styles.reward}>{reward}</Text>
        </View>
      ) : null}

      {/* ปุ่มรับภารกิจ */}
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => navigation.navigate('ChatScreen', { 
          creatorName, 
          creatorPhone, 
          missionTitle 
        })}
      >
        <Text style={styles.acceptButtonText}>✅ รับภารกิจ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  missionTitle: {
    fontSize: 22,
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
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0078fe',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#555',
  },
  address: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  reward: {
    fontSize: 16,
    color: '#d97706',
    fontWeight: 'bold',
    lineHeight: 22,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
