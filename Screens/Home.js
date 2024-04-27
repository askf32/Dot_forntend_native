import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  return (
    <View className="flex-1 bg-black">
    
      <View className="flex-1 justify-center">

      <View className="w-1/2 p-2 mx-auto ">
        <TouchableOpacity
          className="bg-white p-2 rounded-lg"
          onPress={() => {
            navigation.navigate("Game");
          }}
        >
          <Text className="text-center font-bold ">Player 1 vs Player 2</Text>
        </TouchableOpacity>
      </View>
      <View className="w-1/2 p-2 mx-auto">
        <TouchableOpacity
          className="bg-white p-2 rounded-lg"
          onPress={() => {
            navigation.navigate("PlayerComputer");
          }}
        >
          <Text className="text-center font-bold ">Player vs computer</Text>
        </TouchableOpacity>
      </View>

      <View className="w-1/2 p-2 mx-auto">
        <TouchableOpacity
          className="bg-white p-2 rounded-lg"
          onPress={() => {
            navigation.navigate("MultiplayerGame");
          }}
        >
          <Text className="text-center font-bold ">Multiplayer online</Text>
        </TouchableOpacity>
      </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const checkForSquare = (line) => {
  const { startDot, endDot } = line;

  linesStartDot.push({ row: startDot.row, col: startDot.col });
  // console.log(linesStartDot, " start dot os line");

  linesStartDot.forEach((dot) => {
    const { row, col } = dot;
    // console.log(row, col);
    const square = [
      { row, col },
      { row: row + 1, col },
      { row, col: col + 1 },
      { row: row + 1, col: col + 1 },
    ];
    const isSquareFormed = square.every((point) =>
      linesStartDot.some((lineDot) => {
        console.log(lineDot.row, lineDot.col, " linedot");
        console.log(point.row, point.col, " Point");
        lineDot.row === point.row && lineDot.col === point.col;
      })
    );

    // If square is formed, log the information
    if (isSquareFormed) {
      console.log("Square formed:", { row, col });
    }
  });
};
