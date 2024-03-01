import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {  Text, TouchableOpacity, View } from 'react-native';
import Home from './Screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameBoard from './Screens/GameBoard';
import PlayerComputer from './Screens/PlayerComputer';


const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
    <Stack.Navigator >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Game" component={GameBoard} />
      <Stack.Screen name="PlayerComputer" component={PlayerComputer} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

