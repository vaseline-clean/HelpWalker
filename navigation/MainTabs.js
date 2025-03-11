import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeedScreen from '../screens/FeedScreen';
import ListScreen from '../screens/ListScreen';
import PostScreen from '../screens/PostScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'หน้าหลัก') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'รายการ') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'โพส') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } 
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9900',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="หน้าหลัก" component={FeedScreen} />
      <Tab.Screen name="รายการ" component={ListScreen} />
      <Tab.Screen name="โพส" component={PostScreen} />
    </Tab.Navigator>
  );
}
