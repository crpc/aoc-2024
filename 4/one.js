import fs from "fs";

const directions = ["NW", "N", "NE", "W", "E", "SW", "S", "SE"];
const searchPhrase = ["M", "A", "S"];

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
      if (x === "X") {
        starts.push([yIdx, xIdx]);
      }
    });
  });
  return starts;
}

function checkAllStarts(starts, input) {
  return starts.reduce((acc, start) => {
    return acc + checkAllDirections(start, input);
  }, 0);
}

function checkAllDirections(start, input) {
  return directions.reduce((acc, direction) => {
    try {
      checkDirection(start, direction, input);
      return acc + 1;
    } catch {}
    return acc;
  }, 0);
}

function checkDirection(start, direction, input) {
  let currentPos = start;
  searchPhrase.forEach((char) => {
    currentPos = getNextFromDirection(currentPos, direction, input);
    const [y, x] = currentPos;
    if (input[y][x] !== char) {
      throw new Error(
        `wrong char on next position ${input[y][x]} ${char}, ${y}-${x}`
      );
    }
  });
}

function getNextFromDirection(pos, direction, input) {
  let nextPos;
  switch (direction) {
    case "NW":
      nextPos = [pos[0] - 1, pos[1] - 1];
      break;
    case "N":
      nextPos = [pos[0] - 1, pos[1]];
      break;
    case "NE":
      nextPos = [pos[0] - 1, pos[1] + 1];
      break;
    case "W":
      nextPos = [pos[0], pos[1] - 1];
      break;
    case "E":
      nextPos = [pos[0], pos[1] + 1];
      break;
    case "SW":
      nextPos = [pos[0] + 1, pos[1] - 1];
      break;
    case "S":
      nextPos = [pos[0] + 1, pos[1]];
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
