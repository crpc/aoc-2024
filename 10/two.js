import fs from "fs";

const data = fs
  .readFileSync("./10/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n")
  .map((row) => row.split("").map(Number));

const max = [data[0].length, data.length];
const traverse = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const starts = [];
data.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === 0) {
      starts.push([x, y]);
    }
  });
});

const result = starts
  .map((pos) => {
    const map = new Map();
    hike(pos, 0, map);
    return [...map.values()].reduce((acc, curr) => acc + curr, 0);
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log("res: ", result);

function hike(from, num, hikesMap) {
  const [fromX, fromY] = from;
  if (num === 9) {
    const coord = from.join(",");
    const sum = hikesMap.get(coord);
    hikesMap.set(coord, (sum ?? 0) + 1);
    return;
  }
  const possibleMoves = traverse
    .map(([x, y]) => [fromX + x, fromY + y])
    .filter(([x, y]) => {
      return x > -1 && x < max[0] && y > -1 && y < max[1];
    })
    .filter(([x, y]) => {
      const numAtMove = data[y][x];
      return numAtMove === num + 1;
    });
  possibleMoves.forEach((move) => hike(move, num + 1, hikesMap));
}
