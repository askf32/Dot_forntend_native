import React, { useState, useEffect, useRef } from "react";
import Svg, { Line } from "react-native-svg";
import {
  StyleSheet,
  View,
  PanResponder,
  Dimensions,
  Text,
  Alert,
} from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
let allLines = [];

const GameBoard = () => {
  const rows = 3;
  const cols = 3;
  const dotSpacing = 60;
  const maxTurnTime = 10; // seconds

  const [dots, setDots] = useState([]);
  const [lines, setLines] = useState([]);
  const [lineCoordinates, setLineCoordinates] = useState({
    startDot: null,
    endDot: null,
  });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timer1, setTimer1] = useState(maxTurnTime);
  const [timer2, setTimer2] = useState(maxTurnTime);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [squares, setSquares] = useState([]);
  const [winners, setwinners] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
  }, [timer1, timer2, currentPlayer]);

  useEffect(() => {
    const newDots = [];
    const startX = (width - cols * dotSpacing) / 2; // Center the dots horizontally
    const startY = (height - rows * dotSpacing) / 2; // Center the dots vertically

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const dots = {
          row: i,
          col: j,
          id: `${i}-${j}`,
          x: j * dotSpacing + startX,
          y: i * dotSpacing + startY,
        };
        newDots.push(dots);
      }
    }
    setDots(newDots);
  }, []);

  const areAdjacent = (dot1, dot2) => {
    if (!dot1 || !dot2) {
      return false;
    }

    const rowDiff = Math.abs(
      parseInt(dot1.id.split("-")[0]) - parseInt(dot2.id.split("-")[0])
    );
    const colDiff = Math.abs(
      parseInt(dot1.id.split("-")[1]) - parseInt(dot2.id.split("-")[1])
    );

    // Two dots are adjacent if the row difference is 1 and the column difference is 0, or vice versa
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (currentPlayer === 1) {
        setTimer1((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(timerRef.current);
            const nextPlayer = switchTurn();
            startTimerForPlayer(nextPlayer); // Start the timer for the next player
            return maxTurnTime;
          }
          return prevTimer - 1;
        });
      } else {
        setTimer2((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(timerRef.current);
            const nextPlayer = switchTurn();
            startTimerForPlayer(nextPlayer); // Start the timer for the next player
            return maxTurnTime;
          }
          return prevTimer - 1;
        });
      }
    }, 1000);
  };

  const startTimerForPlayer = (player) => {
    if (player === 1) {
      setTimer1(maxTurnTime);
    } else {
      setTimer2(maxTurnTime);
    }
  };

  const switchTurn = () => {
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);
    setLineCoordinates({
      startDot: null,
      endDot: null,
    });

    // Reset the timer for the current player
    if (currentPlayer === 1) {
      setTimer1(maxTurnTime);
    } else {
      setTimer2(maxTurnTime);
    }

    return nextPlayer;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: (event, gestureState) => {
      const { locationX, locationY } = event.nativeEvent;

      // Check if the touch is close to any dot
      const startDot = findClosestDot(locationX, locationY);

      if (startDot) {
        setLineCoordinates({
          startDot,
          endDot: null,
        });
        clearInterval(timerRef.current);
        startTimer(); // Start or restart the timer when a player starts making a move
      }
    },
    onMoveShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderMove: (event, gestureState) => {
      const { locationX, locationY } = event.nativeEvent;

      // Update endDot if the touch is close to any dot
      const endDot = findClosestDot(locationX, locationY);

      if (endDot && areAdjacent(lineCoordinates.startDot, endDot)) {
        const isHorizontalMove =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isVerticalMove =
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx);

        // Snap the endDot to the nearest dot on either the horizontal or vertical axis
        if (isHorizontalMove) {
          setLineCoordinates((prevCoordinates) => ({
            ...prevCoordinates,
            endDot: {
              ...endDot,
              y: prevCoordinates.startDot ? prevCoordinates.startDot.y : null,
            }, // Snap to the same y-coordinate
          }));
        } else if (isVerticalMove) {
          setLineCoordinates((prevCoordinates) => ({
            ...prevCoordinates,
            endDot: {
              ...endDot,
              x: prevCoordinates.startDot ? prevCoordinates.startDot.x : null,
            }, // Snap to the same x-coordinate
          }));
        }
      }
    },
    onPanResponderRelease: () => {
      // Check if both startDot and endDot are set, and create a line
      if (lineCoordinates.startDot && lineCoordinates.endDot) {
        if (areAdjacent(lineCoordinates.startDot, lineCoordinates.endDot)) {
          // Check if the line already exists in the lines array
          const isLineDrawn = lines.some(
            (line) =>
              (line.startDot.id === lineCoordinates.startDot.id &&
                line.endDot.id === lineCoordinates.endDot.id) ||
              (line.startDot.id === lineCoordinates.endDot.id &&
                line.endDot.id === lineCoordinates.startDot.id)
          );

          if (!isLineDrawn) {
            const newLine = {
              startDot: {
                ...lineCoordinates.startDot,
                row: parseInt(lineCoordinates.startDot.id.split("-")[0]),
                col: parseInt(lineCoordinates.startDot.id.split("-")[1]),
              },
              endDot: {
                ...lineCoordinates.endDot,
                row: parseInt(lineCoordinates.endDot.id.split("-")[0]),
                col: parseInt(lineCoordinates.endDot.id.split("-")[1]),
              },
              player: currentPlayer,
            };

            // Log dot IDs and line information
            // console.log(`Dot IDs: ${lineCoordinates.startDot.id} - ${lineCoordinates.endDot.id}`);
            // console.log(`Line: Player ${currentPlayer} - ${lineCoordinates.startDot.id} to ${lineCoordinates.endDot.id}`);

            // Update lines state with different colors for each player
            setLines((prevLines) => [...prevLines, newLine]);

            // Check for square when a line is drawn
            checkForSquare(newLine);

            // Switch player turn and reset timer for the current player
            const nextPlayer = switchTurn();
            clearInterval(timerRef.current);
            startTimerForPlayer(nextPlayer); // Start or restart the timer for the next player
          }
        }
      }

      // Reset lineCoordinates
      setLineCoordinates({
        startDot: null,
        endDot: null,
      });
    },
  });

  const findClosestDot = (x, y) => {
    const threshold = 20; // Adjust as needed for touch sensitivity
    return dots.find((dot) => {
      const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
      return distance < threshold;
    });
  };
  const checkForSquare = (lines) => {
    allLines.push(lines);

    const linesX = new Array(rows + 1)
      .fill(0)
      .map(() => new Array(cols).fill(false));
    const linesY = new Array(rows)
      .fill(0)
      .map(() => new Array(cols + 1).fill(false));

    allLines.forEach((line) => {
      const { startDot, endDot } = line;

      if (startDot.row === endDot.row) {
        // Horizontal line
        linesX[startDot.row][Math.min(startDot.col, endDot.col)] = true;
      } else if (startDot.col === endDot.col) {
        // Vertical line
        linesY[Math.min(startDot.row, endDot.row)][startDot.col] = true;
      }
    });

    let squareCount = 0;
    let prevSquares = 0;
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        if (
          linesX[x][y] &&
          linesX[x + 1][y] &&
          linesY[x][y] &&
          linesY[x][y + 1]
        ) {
          if (!squares.some((square) => square[0] === x && square[1] === y)) {
            squareCount++;
            squares.push([x, y]);
            console.log(squares, "squares");
          }
        }
      }
    }

    if (squareCount > 0) {
      if (lines.player === 1) {
        setScore1((prevScore) => prevScore + 1);
        console.log(score1, "player 1");
      } else {
        setScore2((prevScore) => prevScore + 1);
        console.log(score2, "player 2");
      }
    }
  };
  const winner = () => {
    useEffect(() => {
      if (score1 + score2 === 4) {
        if (score1 > score2) {
          Alert.alert("Game Over", "Player 1 wins!");
        } else if (score2 > score1) {
          Alert.alert("Game Over", "Player 2 wins!");
        } else {
          Alert.alert("Game Over", "It's a tie!");
        }
      }
    }, [score1, score2]);
    return null;
  };

  return (
    <View style={styles.MainContainer}>
      <Svg height={height} width={width} position="absolute">
        {lines.map((line, index) => (
          <Line
            key={index}
            x1={line.startDot.x}
            y1={line.startDot.y}
            x2={line.endDot.x}
            y2={line.endDot.y}
            stroke={line.player === 1 ? "red" : "blue"}
            strokeWidth="8"
          />
        ))}
      </Svg>
      <View
        style={{ flex: 1, backgroundColor: "transparent" }}
        {...panResponder.panHandlers}
      >
        {dots.map((dot) => (
          <View
            key={dot.id}
            style={{
              position: "absolute",
              left: dot.x - 10,
              top: dot.y - 10,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: "black",
            }}
          />
        ))}
      </View>
      <View className="justify-start">{winner()}</View>
      <View style={styles.playerBoard}>
        <Text className="text-xl font-bold mx-auto">{`Player 1 - Turn: ${timer1}s | Score: ${score1}`}</Text>
      </View>
      <View style={styles.playerBoard}>
        <Text className="text-xl font-bold mx-auto">{`Player 2 - Turn: ${timer2}s | Score: ${score2}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  playerBoard: {
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
});

export default GameBoard;
