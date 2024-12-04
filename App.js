import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// หน้าล็อกอิน
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
    } else {
      navigation.replace('MainTabs'); // ไปยัง Tab Navigator
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>เข้าสู่ระบบ</Text>

      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ล็อกอิน</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

// ส่วน Header ที่ใช้ในทุกหน้า (ยกเว้นหน้าล็อกอิน)
function CustomHeader({ navigation, title, showSearchBar = false, searchQuery, setSearchQuery }) {
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack(); // ย้อนกลับไปหน้าก่อนหน้า
    } else {
      alert('ไม่มีหน้าก่อนหน้าให้ย้อนกลับ');
    }
  };

  const handleLogout = () => {
    Alert.alert('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ออกจากระบบ',
        style: 'destructive',
        onPress: () => navigation.replace('Login'), // กลับไปหน้าล็อกอิน
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
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

      <TouchableOpacity style={styles.userIcon} onPress={handleLogout}>
        <Ionicons name="person-circle-outline" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
}

// หน้าฟีด (หน้าหลัก)
function FeedScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        showSearchBar={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ช่องสี่เหลี่ยมผืนผ้าสำหรับข้อมูลผู้ใช้ */}
      <View style={styles.userInfoBox}>
        <Ionicons name="person-circle-outline" size={60} color="black" style={styles.userIcon} />
        <View style={styles.userInfoText}>
          <Text style={styles.userName}>ชื่อผู้ใช้: นายตัวอย่าง</Text>
          <Text style={styles.userPhone}>เบอร์โทร: 081-234-5678</Text>
        </View>
      </View>

      <View style={styles.content}></View>
    </View>
  );
}

function ListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="รายการ" />
      <View style={styles.content}>
        <Text style={styles.title}>รายการ</Text>
      </View>
    </View>
  );
}

function PostScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="โพสต์" />
      <View style={styles.content}>
        <Text style={styles.title}>โพสต์</Text>
      </View>
    </View>
  );
}

function ChatScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="แชท" />
      <View style={styles.content}>
        <Text style={styles.title}>แชท</Text>
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Post') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9900',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ title: 'หน้าหลัก' }} />
      <Tab.Screen name="List" component={ListScreen} options={{ title: 'รายการ' }} />
      <Tab.Screen name="Post" component={PostScreen} options={{ title: 'โพสต์' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'แชท' }} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    backgroundColor: '#FF9900',
  },
  searchBar: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  userInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  userInfoText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userPhone: {
    fontSize: 16,
    color: 'gray',
  },
  backButton: {
    paddingLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  userIcon: {
    paddingRight: 10,
  },
});
