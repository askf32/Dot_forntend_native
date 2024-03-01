import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';

const App = () => {
  const [dots, setDots] = useState([]);
  const [squares, setSquares] = useState([]);
  const [squareFormed, setSquareFormed] = useState(false);
  const [previousSquares, setPreviousSquares] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedDots, setSelectedDots] = useState([]);
  const [timer, setTimer] = useState(10);
  const [scorePlayer1, setScorePlayer1] = useState(0);
  const [scorePlayer2, setScorePlayer2] = useState(0);


  useEffect(() => {
    let interval;

    if (timer > 0 && selectedDots.length < 2) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      switchPlayer();
        resetTimer();
      
    }

    return () => clearInterval(interval);
  }, [timer, selectedDots, currentPlayer]);

  const switchPlayer = () => {
    setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
    setSelectedDots([]);
    setSquareFormed(false);
    resetTimer();
    
  };

  const resetTimer = () => {
    setTimer(10);
  };

  const handleDotPress = (row, col) => {
    if (squareFormed) {
      const newDots = [...dots, { row, col }];  
      setDots(newDots);
      checkSquares(newDots);

      switchPlayer();
    } else {
      // If no square is formed, add the dot and continue the game
      if (selectedDots.length === 0 || isAdjacent(selectedDots[selectedDots.length - 1], { row, col })) {
        const newSelectedDots = [...selectedDots, { row, col }];
        setSelectedDots(newSelectedDots);

        if (newSelectedDots.length === 2) {
          // If two dots are selected, add them to the main dots array
          const newDots = [...dots, ...newSelectedDots];
          setDots(newDots);
          checkSquares(newDots);

          // Switch player after checking for squares
          switchPlayer();
        }
      }
    }
  };

  const checkSquares = (dots) => {
    const newSquares = [];

    // Iterate through each dot to check for squares
    dots.forEach(({ row, col }) => {
      // Check for squares with the current dot as the top-left corner
      const square = [
        { row, col },
        { row: row + 1, col },
        { row, col: col + 1 },
        { row: row + 1, col: col + 1 },
      ];

      // Check if all four dots are in the array of dots
      if (
        square.every(({ row, col }) =>
          dots.some((dot) => dot.row === row && dot.col === col)
        )
      ) {
        newSquares.push(square);
      }
    });

    // Log squares
    if (newSquares.length > 0 && !areArraysEqual(newSquares, previousSquares)) {
      console.log('Squares formed:', newSquares);
      Alert.alert('Square Formed!', 'Congratulations! You formed a square.');
      setSquareFormed(true);
      setPreviousSquares(newSquares);
      if (currentPlayer === 1) {
        setScorePlayer1((prevScore) => prevScore + newSquares.length);
      } else {
        setScorePlayer2((prevScore) => prevScore + newSquares.length);
      }
    }
    setSquares(newSquares);
  };

  const isAdjacent = (dot1, dot2) => {
    return Math.abs(dot1.row - dot2.row) <= 1 && Math.abs(dot1.col - dot2.col) <= 1;
  };

  const areArraysEqual = (array1, array2) => {
    return JSON.stringify(array1) === JSON.stringify(array2);
  };

  return (
    <View style={styles.container}>
      {[...Array(16).keys()].map((row) => (
        <View key={row} style={styles.row}>
          {[...Array(8).keys()].map((col) => (
            <TouchableOpacity
              key={col}
              style={[
                styles.dot,
                dots.some((dot) => dot.row === row && dot.col === col) && styles.activeDot,
              ]}
              onPress={() => handleDotPress(row, col)}
            />
          ))}
        </View>
      ))}

      <View style={styles.playerBar}>
        <View style={styles.playerContainer}>
          <Text style={[styles.playerText, currentPlayer === 1 && styles.currentPlayer]}>
            Player 1
          </Text>
          <Text style={styles.timerText}>{currentPlayer === 1 ? `${timer}s` : 'Waiting'}</Text>
          <Text style={styles.scoreText}>Score: {scorePlayer1}</Text>
        </View>

        <View style={styles.playerContainer}>
          <Text style={[styles.playerText, currentPlayer === 2 && styles.currentPlayer]}>
            Player 2
          </Text>
          <Text style={styles.timerText}>{currentPlayer === 2 ? `${timer}s` : 'Waiting'}</Text>
          <Text style={styles.scoreText}>Score: {scorePlayer2}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'gray',
    margin: 5,
  },
  activeDot: {
    backgroundColor: 'blue',
  },
  playerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  playerContainer: {
    alignItems: 'center',
  },
  playerText: {
    fontSize: 20,
  },
  currentPlayer: {
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 20,
  },
});

export default App;
