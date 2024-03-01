import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const PlayerTimer = ({ currentPlayer, onTimeout }) => {
  const turnTime = 5; // seconds
  const [timer, setTimer] = useState(turnTime);

  useEffect(() => {
    setTimer(turnTime); // Reset the timer when currentPlayer changes
  }, [currentPlayer]);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      // Turn timeout, notify the parent component
      onTimeout();
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer, onTimeout]);

  return (
    <View className="mt-2 items-center">
      <Text className="text-lg font-bold">{`Player ${currentPlayer}'s Turn: ${timer}s`}</Text>
    </View>
  );
};

export default PlayerTimer;
