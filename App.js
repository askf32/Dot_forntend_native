import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {  Text, TouchableOpacity, View } from 'react-native';
import Home from './Screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameBoard from './Screens/GameBoard';
import PlayerComputer from './Screens/PlayerComputer';
import MultiplayerGame from './Screens/MultiplayerGame';
import loginScreen from './Screens/LoginScreen';
import LoginScreen from './Screens/LoginScreen';
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store"; 
import { Provider } from "react-redux";




const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <NavigationContainer>
    <Stack.Navigator >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="MultiplayerGame" component={MultiplayerGame} />
      <Stack.Screen name="Game" component={GameBoard} />
      <Stack.Screen name="PlayerComputer" component={PlayerComputer} />
    </Stack.Navigator>
  </NavigationContainer>
  </PersistGate>
    </Provider>
  );
}

