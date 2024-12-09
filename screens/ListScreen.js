import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomHeader from '../components/CustomHeader';

export default function ListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="รายการ" />
      {/* เนื้อหา */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
