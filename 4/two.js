import fs from "fs";
import _ from "lodash";

const directions = ["NW", "NE", "SW", "SE"];
const correctResults = [
  ["M", "M", "S", "S"],
  ["M", "S", "M", "S"],
  ["S", "S", "M", "M"],
  ["S", "M", "S", "M"],
];

const data = fs
  .readFileSync("./4/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n")
  .map((y) => y.split(""));

const allStarts = getAllStarts(data);
const result = checkAllStarts(allStarts, data);

console.log(result);

function getAllStarts(input) {
  const starts = [];
  input.forEach((y, yIdx) => {
    y.forEach((x, xIdx) => {
      if (x === "A") {
        starts.push([yIdx, xIdx]);
      }
    });
  });
  return starts;
}

function checkAllStarts(starts, input) {
  return starts.reduce((acc, start) => {
    const cross = getCharsFromCorners(start, input);
    if (checkCross(cross)) {
      return acc + 1;
    }
    return acc;
  }, 0);
}

function checkCross(cross) {
  return correctResults.some((res) => _.isEqual(res, cross));
}

function getCharsFromCorners(start, input) {
  return directions.map((dir) => {
    try {
      const [y, x] = getNextFromDirection(start, dir, input);
      return input[y][x];
    } catch {
      return "";
    }
  });
}

function getNextFromDirection(pos, direction, input) {
  let nextPos;
  switch (direction) {
    case "NW":
      nextPos = [pos[0] - 1, pos[1] - 1];
      break;
    case "NE":
      nextPos = [pos[0] - 1, pos[1] + 1];
      break;
    case "SW":
      nextPos = [pos[0] + 1, pos[1] - 1];
      break;
    case "SE":
      nextPos = [pos[0] + 1, pos[1] + 1];
      break;
  }
  if (
    nextPos[0] < 0 ||
    nextPos[0] >= input.length ||
    nextPos[1] < 0 ||
    nextPos[1] >= input[0].length
  ) {
    throw new Error("position out of input boundary");
  }
  return nextPos;
}
