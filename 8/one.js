import fs from "fs";

const data = fs
  .readFileSync("./8/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n")
  .map((row) => row.split(""));

const max = [data[0].length, data.length];

const antennasMap = createAntennasMap(data);

const allAntinodes = new Set();

for (let charPoints of antennasMap.values()) {
  const newAntinodes = getAntinodes(charPoints, max);
  newAntinodes.forEach((point) => allAntinodes.add(point));
}

console.log("result: ", allAntinodes.size);
// console.log("result: ", allAntinodes);
console.log("result of one: ", getAntinodes(antennasMap.get("c"), max));

function getAntinodes(points, max) {
  const [maxX, maxY] = max;
  const antinodesSet = new Set();

  points.forEach((el, _, arr) => {
    const [elX, elY] = el;
    const otherPoints = arr.filter(([x, y]) => x !== elX && y !== elY);
    const antinodes = otherPoints
      .map(([x, y]) => {
        const xDiff = elX - x;
        const yDiff = elY - y;
        return [elX + xDiff, elY + yDiff];
      })
      .filter(([x, y]) => {
        return x > -1 && x < maxX && y > -1 && y < maxY;
      })
      .map(mapPointToString);
    antinodes.forEach((point) => antinodesSet.add(point));
  });

  return antinodesSet;
}

function mapPointToString(point) {
  return point.join(",");
}

function createAntennasMap(input) {
  const map = new Map();
  input.forEach((row, yIdx) => {
    row.forEach((char, xIdx) => {
      if (char !== ".") {
        if (map.has(char)) {
          map.set(char, [...map.get(char), [xIdx, yIdx]]);
        } else {
          map.set(char, [[xIdx, yIdx]]);
        }
      }
    });
  });
  return map;
}
