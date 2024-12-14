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
const moves = 100;

let points = data;

for (let i = 0; i < moves; i++) {
  points = points.map(({ p, v }) => {
    return { p: move(p, v), v };
  });
}

const result = [
  count(points, [0, 0], [maxX / 2 - 1, maxY / 2 - 1]),
  count(points, [maxX / 2 + 1, 0], [maxX, maxY / 2 - 1]),
  count(points, [0, maxY / 2 + 1], [maxX / 2 - 1, maxY]),
  count(points, [maxX / 2 + 1, maxY / 2 + 1], [maxX, maxY]),
].reduce((acc, el) => acc * el, 1);

console.log("result", result);

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

function count(points, min, max) {
  const [minX, minY] = min;
  const [maxX, maxY] = max;
  return points.filter(
    ({ p: [x, y] }) => x >= minX && x <= maxX && y >= minY && y <= maxY
  ).length;
}
