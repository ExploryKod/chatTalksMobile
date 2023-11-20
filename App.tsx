import React from 'react';
import Connexion from './Auth/Connexion';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import MessageEchange from './Pages/MessageExchange';

const Stack = createNativeStackNavigator();

export default function Connex() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Create Account" component={Connexion} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MessageEchange" component={MessageEchange} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
