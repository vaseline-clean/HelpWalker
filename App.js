import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AnotherLoginScreen from './screens/AnotherLoginScreen';
import MainTabs from './navigations/MainTabs'; 
import MissionDetailsScreen from './screens/MissionDetailsScreen'; // Import หน้าจอ MissionDetails

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AnotherLoginScreen" component={AnotherLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen 
          name="MissionDetails" 
          component={MissionDetailsScreen} 
          options={{ headerShown: true, title: 'Mission Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
