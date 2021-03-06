import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import RestaurantScreen from './src/Screens/RestaurantScreen';
import HomeScreen from './src/Screens/HomeScreen';
import LoginScreen from './src/Screens/LoginScreen';
import Camera from './src/Screens/camera';
import otp from './src/Screens/otp';
import Profile from './src/Screens/Profile';
import RestaurantDetail from './src/Screens/RestaurantDetail';
import Map from './src/Screens/Map';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login Screen'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home Screen'}}
        />
        <Stack.Screen
          name="detail"
          component={RestaurantScreen}
          options={{title: 'Detail Screen'}}
        />
        <Stack.Screen
          name="camera"
          component={Camera}
          options={{title: 'Camera Screen'}}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{title: 'Map Screen'}}
        />
        <Stack.Screen
          name="otp"
          component={otp}
          options={{title: 'Otp Screen'}}
        />
        <Stack.Screen
          name="profile"
          component={Profile}
          options={{title: 'Profile Screen'}}
        />
        <Stack.Screen
          name="Restaurant detail"
          component={RestaurantDetail}
          options={{title: 'Restaurant detail Screen'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
