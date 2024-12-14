import fs from "fs";

const data = fs
  .readFileSync("./14/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n")
  .map((row) => {
    const [p, v] = row
      .match(/(?<=\=)(-?\d+,-?\d+)/g)
      .map((pair) => pair.split(",").map(Number));
    return { p, v };
  });

const [maxX, maxY] = [100, 102];
const moves = 10000;

let grid = newGrid();

let points = data;

for (let i = 1; i <= moves; i++) {
  grid = newGrid();
  points = points.map((point) => {
    const { p, v } = point;
    point.p = move(p, v);
    const [x, y] = point.p;
    grid[y][x] = "#";
    return point;
  });
  if (checkForLine(grid)) {
    console.log("idx ", i);
  }
}

function checkForLine(grid) {
  const lines = grid.filter(
    (row) => row.join("").indexOf("#".repeat(20)) !== -1
  );
  if (lines.length > 0) {
    grid.forEach((line) => {
      console.log(line.join(""));
    });
  }
  return lines.length > 0;
}

function newGrid() {
  return [...new Array(maxY + 1)].map(() => [...new Array(maxX + 1)].fill("."));
}

function move(start, vector) {
  const [sx, sy] = start;
  const [vx, vy] = vector;

  let [x, y] = [sx + vx, sy + vy];
  if (x > maxX) {
    x = (x % maxX) - 1;
  }
  if (x < 0) {
    x = x + maxX + 1;
  }
  if (y > maxY) {
    y = (y % maxY) - 1;
  }
  if (y < 0) {
    y = y + maxY + 1;
  }
  return [x, y];
}
