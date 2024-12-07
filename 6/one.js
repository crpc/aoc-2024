import fs from "fs";

const newDirections = { N: "E", E: "S", S: "W", W: "N" };

const data = fs
  .readFileSync("./6/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n");

console.log(getGuardMovement(data));

function getGuardMovement(input) {
  const startY = input.findIndex((row) => row.indexOf("^") !== -1);
  const startX = input[startY].indexOf("^");
  let direction = "N";

  let start = [startX, startY];
  let end;
  let isOut = false;

  const moves = new Set();
  moves.add(mapPositionToString([startX, startY]));

  do {
    end = getMoveEnd(start, direction, input);
    const newMoves = collectMoves(start, end, direction);
    newMoves.forEach((el) => moves.add(mapPositionToString(el)));
    start = end;
    isOut = didMoveOut(end, direction, input);
    direction = newDirections[direction];
    // printField(start, input);
  } while (!isOut);
  return moves.size;
}

function printField(pos, input) {
  const [posX, posY] = pos;
  console.log("\r\n- Field -", pos);
  input.forEach((y, idx) => {
    const output =
      idx === posY ? y.substring(0, posX) + "*" + y.substring(posX + 1) : y;
    console.log(output);
  });
}

function collectMoves(start, end, direction) {
  const [startX, startY] = start;
  const [endX, endY] = end;
  switch (direction) {
    case "N":
    case "S": {
      const length = Math.abs(startY - endY) + 1;
      const absStart = Math.min(startY, endY);
      return [...new Array(length)].map((_, idx) => [startX, absStart + idx]);
    }
    case "W":
    case "E": {
      const length = Math.abs(startX - endX) + 1;
      const absStart = Math.min(startX, endX);
      return [...new Array(length)].map((_, idx) => [absStart + idx, startY]);
    }
  }
}

function mapPositionToString(pos) {
  const [x, y] = pos;
  return `${x},${y}`;
}

function didMoveOut(position, direction, input) {
  const [x, y] = position;
  switch (direction) {
    case "N":
      return y === 0;
    case "S":
      return y === input.length - 1;
    case "W":
      return x === 0;
    case "E":
      return x === input[y].length - 1;
  }
}

function getMoveEnd(start, direction, input) {
  const [startX, startY] = start;
  switch (direction) {
    case "N": {
      const directionTiles = input.slice(0, startY).map((row) => row[startX]);
      const obstacleY = directionTiles.findLastIndex((tile) => tile === "#");
      return [startX, obstacleY + 1];
    }
    case "S": {
      const directionTiles = input.slice(startY).map((row) => row[startX]);
      const obstacleY =
        directionTiles.findIndex((tile) => tile === "#") + startY;
      const lastTile = obstacleY === startY - 1 ? input.length : obstacleY;
      return [startX, lastTile - 1];
    }
    case "W": {
      const obstacleX = input[startY].substring(0, startX + 1).lastIndexOf("#");
      return [obstacleX + 1, startY];
    }
    case "E": {
      const obstacleX = input[startY].substring(startX).indexOf("#") + startX;
      const lastTile =
        obstacleX === startX - 1 ? input[startY].length : obstacleX;
      return [lastTile - 1, startY];
    }
  }
}
