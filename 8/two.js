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

const antennas = [...antennasMap.values()].flatMap((points) =>
  points.map(mapPointToString)
);

antennas.forEach((point) => allAntinodes.add(point));

console.log("result: ", allAntinodes.size);

function getAntinodes(points, max) {
  const antinodesSet = new Set();

  points.forEach((el, _, arr) => {
    const [elX, elY] = el;
    const otherPoints = arr.filter(([x, y]) => x !== elX && y !== elY);
    const antinodes = otherPoints
      .flatMap(([x, y]) => {
        const xDiff = elX - x;
        const yDiff = elY - y;
        const pointAntinodes = [];
        let idx = 1;
        let nextPoint = [elX + xDiff, elY + yDiff];
        do {
          pointAntinodes.push(nextPoint);
          idx++;
          nextPoint = [elX + xDiff * idx, elY + yDiff * idx];
        } while (isInBoundary(nextPoint, max));
        return pointAntinodes;
      })
      .filter((point) => {
        return isInBoundary(point, max);
      })
      .map(mapPointToString);
    antinodes.forEach((point) => antinodesSet.add(point));
  });

  return antinodesSet;
}

function isInBoundary(point, max) {
  const [x, y] = point;
  const [maxX, maxY] = max;
  return x > -1 && x < maxX && y > -1 && y < maxY;
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
