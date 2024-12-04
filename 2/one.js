import fs from "fs";

const MAX_SAFE_ADJACENT = 3;
const MIN_SAFE_ADJACENT = 1;

const data = fs
  .readFileSync("./2/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n")
  .map((line) => line.split(" "))
  .map((row) => row.map(Number));

const result = data.filter((row) => checkRow(row)).length;

console.log(result);

function checkRow(row) {
  let prev;
  const tendency = getTendency(row[0], row[1]);
  for (let current of row) {
    if (!prev) {
      prev = current;
      continue;
    }
    if (
      !isSafeAdjacent(prev, current) ||
      getTendency(prev, current) !== tendency
    ) {
      return false;
    }
    prev = current;
  }
  return true;
}

function getTendency(left, right) {
  if (left === right) {
    return "EQUAL";
  }
  return left < right ? "UP" : "DOWN";
}

function isSafeAdjacent(left, right) {
  const diff = Math.abs(left - right);
  return diff <= MAX_SAFE_ADJACENT && diff >= MIN_SAFE_ADJACENT;
}
