import fs from "fs";

const newDirections = { N: "E", E: "S", S: "W", W: "N" };
const move = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };

const data = fs
  .readFileSync("./6/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n");

// expected result: 1618
console.log(getGuardMovement(data));

function getGuardMovement(input) {
  const currentY = input.findIndex((row) => row.indexOf("^") !== -1);
  const currentX = input[currentY].indexOf("^");
  let current = [currentX, currentY, "N"];
  const restrictedObstaclePos = posToString([currentX, currentY]);

  const loops = new Set();
  const moves = new Set();

  while (true) {
    const [x, y, direction] = current;
    let next = getNext(current);
    if (isOut(next, input)) {
      break;
    }
    if (getCharAtPos(next, input) === "#") {
      next = [x, y, newDirections[direction]];
    } else {
      const turnDirection = [x, y, newDirections[direction]];
      if (
        !loops.has(posToString(turnDirection)) &&
        moveFromPos(turnDirection, addObstacle(next, input), moves)
      ) {
        // console.log("Loop found");
        loops.add(posToString([next[0], next[1]]));
      }
    }
    moves.add(posToString(current));
    current = next;
  }
  if (loops.has(restrictedObstaclePos)) {
    loops.delete(restrictedObstaclePos);
  }
  return loops.size;
}

function moveFromPos(pos, input, prevMoves) {
  // printDistinctMoves([], input);

  let current = pos;

  const moves = new Set();
  prevMoves.forEach((move) => moves.add(move));

  while (true) {
    const [x, y, direction] = current;
    let next = getNext(current);

    if (isOut(next, input)) {
      return false;
    }
    if (getCharAtPos(next, input) === "#") {
      next = [x, y, newDirections[direction]];
    }
    current = next;

    if (moves.has(posToString(current))) {
      return true;
    }
    moves.add(posToString(current));
  }
}

function addObstacle(pos, input) {
  const [x, y] = pos;
  let line = input[y];
  line = line.substring(0, x) + "#" + line.substring(x + 1);
  return input.map((el, idx) => {
    if (idx === y) {
      return line;
    }
    return el;
  });
}

function posToString(pos) {
  return pos.join(",");
}

function getCharAtPos(pos, input) {
  const [x, y] = pos;
  return input[y][x];
}

function getNext(pos) {
  const [x, y, direction] = pos;
  const [moveX, moveY] = move[direction];
  return [x + moveX, y + moveY, direction];
}

function isOut(pos, input) {
  const [x, y] = pos;
  return y < 0 || y >= input.length || x < 0 || x >= input[y].length;
}

function printDistinctMoves(moves, input) {
  const mappedMoves = [...moves].map((move) => {
    const [x, y] = move.split(",");
    return [Number(x), Number(y)];
  });
  input.forEach((row, idx) => {
    let rowWithMoves = row;
    mappedMoves
      .filter(([_, y]) => y === idx)
      .forEach(([x]) => {
        rowWithMoves =
          rowWithMoves.substring(0, x) + "X" + rowWithMoves.substring(x + 1);
      });
    console.log(rowWithMoves);
  });
  console.log("-----------------");
}
