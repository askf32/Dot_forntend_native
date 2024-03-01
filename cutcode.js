let dotSquare = [];
  const checkForSquare = (lines) => {
    const { startDot, endDot } = lines;
    allLines.push(lines)
    console.log(allLines, "yeh sarilines hain");
    dots.forEach(dot=>{
      const {row, col} = dot;
      // console.log(row, col);
      const square = [
        { row, col },
        { row: row + 1, col },
        { row, col: col + 1 },
        { row: row + 1, col: col + 1 },
      ];
      dotSquare.push(square)
    })
    console.log(dotSquare);
    const isSquareFormed = dotSquare.some((square) => {
      const matchingDots = square.every((dot) =>
        allLines.some((line) =>
        (line.startDot.col === dot.col && line.startDot.row === dot.row) ||
        (line.endDot.col === dot.col && line.endDot.row === dot.row)
      ).length === 2
       
      );
      console.log(matchingDots);
      return matchingDots;
    });
    if(isSquareFormed){
      console.log("square formed", allLines);
    }
  };