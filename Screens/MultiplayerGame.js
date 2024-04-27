import React, { useState, useEffect, useRef } from "react";
import Svg, { Line } from "react-native-svg";
import { StyleSheet, View, PanResponder, Dimensions, Text, Alert, TouchableOpacity } from "react-native";
import {io }from "socket.io-client";
import Prompt from "react-native-prompt-android";
import { store } from "../redux/store";


const socketServer = "https://192.168.0.105:4000";
// const socket = io("http://192.168.0.105:3000",{
//   autoConnect: true
// })
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
let allLines = [];

const MultiplayerGame = () => {
  const rows = 10;
  const cols = 5;
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
  const [winners, setWinners] = useState("");
  const [playOnline, setPlayOnline] = useState(false);
  const [opponentName, setOpponentName] = useState("");
  const [playingAs, setPlayingAs] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [socket, setSocket] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
  }, [timer1, timer2, currentPlayer]);

  useEffect(() => {
    const newDots = [];
    const startX = (width - cols * dotSpacing) / 2;
    const startY = (height - rows * dotSpacing) / 2;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const dot = {
          row: i,
          col: j,
          id: `${i}-${j}`,
          x: j * dotSpacing + startX,
          y: i * dotSpacing + startY,
        };
        newDots.push(dot);
      }
    }
    setDots(newDots);
  }, []);

  useEffect(() => {
    if (playOnline && !opponentName) {
      Alert.alert("Waiting for opponent");
    }
  }, [playOnline, opponentName]);

  useEffect(() => {
    console.log("hello");
    const newSocket = io(socketServer, {
      autoConnect: true,
    });
    console.log(newSocket, "new socket ==============> log");

    newSocket.on("connect", function () {
      console.log("====socket connect=====");
      setPlayOnline(true);
    });

    newSocket.on("OpponentNotFound", function () {
      setOpponentName(false);
    });

    newSocket.on("OpponentFound", function (data) {
      setPlayingAs(data.playingAs);
      setOpponentName(data.opponentName);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const areAdjacent = (dot1, dot2) => {
    if (!dot1 || !dot2) {
      return false;
    }

    const rowDiff = Math.abs(dot1.row - dot2.row);
    const colDiff = Math.abs(dot1.col - dot2.col);

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
            startTimerForPlayer(nextPlayer);
            return maxTurnTime;
          }
          return prevTimer - 1;
        });
      } else {
        setTimer2((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(timerRef.current);
            const nextPlayer = switchTurn();
            startTimerForPlayer(nextPlayer);
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
      const startDot = findClosestDot(locationX, locationY);

      if (startDot) {
        setLineCoordinates({
          startDot,
          endDot: null,
        });
        clearInterval(timerRef.current);
        startTimer();
      }
    },
    onMoveShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderMove: (event, gestureState) => {
      const { locationX, locationY } = event.nativeEvent;
      const endDot = findClosestDot(locationX, locationY);

      if (endDot && areAdjacent(lineCoordinates.startDot, endDot)) {
        const isHorizontalMove = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isVerticalMove = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);

        if (isHorizontalMove) {
          setLineCoordinates((prevCoordinates) => ({
            ...prevCoordinates,
            endDot: {
              ...endDot,
              y: prevCoordinates.startDot ? prevCoordinates.startDot.y : null,
            },
          }));
        } else if (isVerticalMove) {
          setLineCoordinates((prevCoordinates) => ({
            ...prevCoordinates,
            endDot: {
              ...endDot,
              x: prevCoordinates.startDot ? prevCoordinates.startDot.x : null,
            },
          }));
        }
      }
    },
    onPanResponderRelease: () => {
      if (lineCoordinates.startDot && lineCoordinates.endDot) {
        if (areAdjacent(lineCoordinates.startDot, lineCoordinates.endDot)) {
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
                row: lineCoordinates.startDot.id.split("-")[0],
                col: lineCoordinates.startDot.id.split("-")[1],
              },
              endDot: {
                ...lineCoordinates.endDot,
                row: lineCoordinates.endDot.id.split("-")[0],
                col: lineCoordinates.endDot.id.split("-")[1],
              },
              player: currentPlayer,
            };

            setLines((prevLines) => [...prevLines, newLine]);

            checkForSquare(newLine);

            const nextPlayer = switchTurn();
            clearInterval(timerRef.current);
            startTimerForPlayer(nextPlayer);
          }
        }
      }

      setLineCoordinates({
        startDot: null,
        endDot: null,
      });
    },
  });

  const findClosestDot = (x, y) => {
    const threshold = 20;
    return dots.find((dot) => {
      const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
      return distance < threshold;
    });
  };

  const checkForSquare = (line) => {
    allLines.push(line);

    const linesX = new Array(rows + 1).fill(0).map(() => new Array(cols).fill(false));
    const linesY = new Array(rows).fill(0).map(() => new Array(cols + 1).fill(false));

    allLines.forEach((line) => {
      const { startDot, endDot } = line;

      if (startDot.row === endDot.row) {
        linesX[startDot.row][Math.min(startDot.col, endDot.col)] = true;
      } else if (startDot.col === endDot.col) {
        linesY[Math.min(startDot.row, endDot.row)][startDot.col] = true;
      }
    });

    let squareCount = 0;
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
            setSquares((prevSquares) => [...prevSquares, [x, y]]);
          }
        }
      }
    }

    if (squareCount > 0) {
      if (line.player === 1) {
        setScore1((prevScore) => prevScore + 1);
      } else {
        setScore2((prevScore) => prevScore + 1);
      }
    }
  };

  const winner = () => {
    useEffect(() => {
      if (score1 + score2 === 36) {
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

  const takePlayerName = async () => {
    // console.log('State after login:', store.getState().user.currentUser.user.username);
    const result = {
      isDismissed:false,
      isDenied: false,
      isConfirmed: true,
      value: store.getState().user.currentUser.user.username
    };
    console.log(result, "result");

    return result;
  };

  const playOnlineClick = async () => {
    const result = await takePlayerName();
    if (!result.isConfirmed) {
      return;
    }

    const username = result.value;
    setPlayerName(username);

    const newSocket = io(socketServer, {
      autoConnect: true,
    });

    newSocket?.emit("request_to_play", {
      playerName: username,
    });

    setSocket(newSocket);
  };

  if (!playOnline) {
    console.log(playOnline, "playonline");
    return (
      <View style={styles.mainDiv}>
        <TouchableOpacity onPress={playOnlineClick} style={styles.playOnlineButton}>
          <Text style={styles.playOnlineText}>Play Online</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      <View style={styles.playerBoard}>
        <Text style={styles.text}>{`Player 1 - Turn: ${timer1}s | Score: ${score1}`}</Text>
      </View>
      <View style={styles.playerBoard}>
        <Text style={styles.text}>{`Player 2 - Turn: ${timer2}s | Score: ${score2}`}</Text>
      </View>
      <View style={styles.winner}>{winner()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainDiv: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playOnlineButton: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 10,
  },
  playOnlineText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  MainContainer: {
    flex: 1,
  },
  playerBoard: {
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  waiting: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  winner: {
    justifyContent: "flex-start",
  },
});

export default MultiplayerGame;
