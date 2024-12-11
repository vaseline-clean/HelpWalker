import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MissionDetailsScreen({ route }) {
  const { missionTitle, missionDetails, creatorName, creatorPhone, address } = route.params;

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.card}>
        <Text style={styles.userName}>{creatorName}</Text>
        <Text style={styles.userPhone}>{creatorPhone}</Text>
      </View>

      {/* Mission Details */}
      <View style={styles.card}>
        <Text style={styles.missionTitle}>{missionTitle}</Text>
        <Text style={styles.missionDetailsTitle}>รายละเอียดภารกิจ</Text>
        <Text style={styles.missionDetails}>{missionDetails}</Text>
      </View>

      {/* Address */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>ที่อยู่ของผู้สร้างภารกิจ</Text>
        <Text style={styles.address}>{address}</Text>
      </View>

      {/* Accept Button */}
      <TouchableOpacity style={styles.acceptButton}>
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
