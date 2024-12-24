import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MissionDetailsScreen({ route, navigation }) {
  const { missionTitle, missionDetails, creatorName, creatorPhone, address } = route.params;

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
    backgroundColor: '#FF7D54',
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
