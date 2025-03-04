import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CustomHeader from '../components/CustomHeader';

export default function FeedScreen({ route, navigation }) {
  const [missions, setMissions] = useState([]);

  // ใช้ useEffect เพื่อตรวจจับ newMission ที่ถูกส่งมาจาก PostScreen
  useEffect(() => {
    if (route.params?.newMission) {
      setMissions((prevMissions) => [route.params.newMission, ...prevMissions]);
    }
  }, [route.params?.newMission]);

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="ฟีด" />
      <FlatList
        data={missions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.missionItem}>
            <Text style={styles.missionTitle}>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>{item.mission}</Text>
            <Text style={styles.reward}>🎁 {item.reward}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีภารกิจ</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  missionItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reward: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#0078fe',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});
