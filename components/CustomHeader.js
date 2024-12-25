import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CustomHeader({
  navigation,
  title = '',
  showSearchBar = false,
  searchQuery = '',
  setSearchQuery = () => {},
}) {
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      alert('ไม่มีหน้าก่อนหน้าให้ย้อนกลับ');
    }
  };

  const handleUserIconPress = () => {
    Alert.alert(
      'โปรไฟล์',
      'คุณต้องการทำอะไร?',
      [
        {
          text: 'แก้ไขโปรไฟล์',
          onPress: () => {
            // ไปยังหน้าตกแต่งโปรไฟล์
            navigation.navigate('ProfindScreen');
          },
        },
        {
          text: 'ล็อกเอาท์',
          onPress: () => {
            // ทำการล็อกเอาท์และกลับไปที่หน้า LoginScreen
            navigation.replace('Login');
          },
        },
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };
  

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back-outline" size={30} color="black" />
      </TouchableOpacity>
      {showSearchBar ? (
        <TextInput
          style={styles.searchBar}
          placeholder="ค้นหา..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      ) : (
        <Text style={styles.headerTitle}>{title}</Text>
      )}
      <TouchableOpacity style={styles.iconButton} onPress={handleUserIconPress}>
        <Ionicons name="person-circle-outline" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: '#FF9900',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    flex: 1,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  iconButton: {
    paddingHorizontal: 10,
  },
});
