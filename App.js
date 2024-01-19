import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CreateEventScreen from './app/screens/CreateEventScreen';
import EventListScreen from './app/screens/EventListScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen
            name="Home"
            component={CreateEventScreen}
            options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }}
          />
          <Stack.Screen
            name="Events"
            component={EventListScreen}
            options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default App;