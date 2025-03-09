import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AnotherLoginScreen from './screens/AnotherLoginScreen';
import MainTabs from './navigations/MainTabs'; 
import SindupScreen from './screens/SindupScreen';
import MissionDetailsScreen from './screens/MissionDetailsScreen'; // Import หน้ารายละเอียดภารกิจ
import FeedScreen from './screens/FeedScreen'; // Import FeedScreen
import ChatScreen from './screens/ChatScreen';
import ListScreen from './screens/ListScreen';
import ProfileScreen from './screens/ProfileScreen'; // Ensure this file exists
import CompletedTasksScreen from './screens/CompletedTasksScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* หน้าจอ Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}/>

        <Stack.Screen 
        name="AnotherLoginScreen" 
        component={AnotherLoginScreen} 
        options={{ headerShown: false }}/>

        <Stack.Screen 
        name="SindupScreen" 
        component={SindupScreen} 
        options={{ headerShown: false }}/>

        {/* หน้าหลัก MainTabs */}
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }}/>

        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ headerShown: false }}/>

        {/* หน้าฟีด (FeedScreen) */}
        <Stack.Screen 
          name="FeedScreen" 
          component={FeedScreen} 
          options={{ title: 'ฟีดภารกิจ', headerShown: true }}/>

        {/* หน้ารายละเอียดภารกิจ (MissionDetailsScreen) */}
        <Stack.Screen 
          name="MissionDetails" 
          component={MissionDetailsScreen} 
          options={{ title: 'รายละเอียดภารกิจ', headerShown: true }}/>

        <Stack.Screen 
          name="ChatScreen" 
          component={ChatScreen} 
          options={{ title: 'แชท', headerShown: true }}/>
        
        <Stack.Screen 
          name="ListScreen" 
          component={ListScreen} 
          options={{ title: 'รายการ', headerShown: true }}/>

        <Stack.Screen 
          name="CompletedTasksScreen" 
          component={CompletedTasksScreen} 
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}