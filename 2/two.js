import fs from "fs";

const MAX_SAFE_ADJACENT = 3;
const MIN_SAFE_ADJACENT = 1;

const data = fs
  .readFileSync("./2/test2.txt", {
    encoding: "utf8",
  })
  .split("\r\n")
  .map((line) => line.split(" "))
  .map((row) => row.map(Number));

const result = data.map(checkRow);

console.log(result.filter((el) => el === true).length);

console.log(result);

function checkRow(row) {
  let errored = false;
  let idx = 0;
  const rowSign = getSign(row);
  while (idx < row.length - 1) {
    const current = row[idx];
    const next = row[idx + 1];
    if (!checkPair(current, next, rowSign)) {
      if (errored) {
        return false;
      }
      const nextAfter = row[idx + 2];
      if (
        idx === row.length - 2 ||
        (idx === 0 && checkPair(next, nextAfter, rowSign)) ||
        checkPair(current, nextAfter, rowSign)
      ) {
        idx += 2;
        errored = true;
        continue;
      } else {
        return false;
      }
    }
    idx++;
  }

  return true;
}

function checkPair(left, right, rowSign) {
  const diff = Math.abs(left - right);
  const sign = Math.sign(right - left);
  return sign === rowSign && isSafeDiff(diff);
}

function getDifferences(input) {
  const allDiffs = input.map((el, idx, arr) => {
    const next = arr[idx + 1];
    if (!next) {
      return 0;
    }
    return next - el;
  });
  // slice last element as it has no next element to compare to
  return allDiffs.slice(0, input.length - 1);
}

function getSign(row) {
  const differences = getDifferences(row);
  const signs = differences.map((num) => Math.sign(num));
  const sum = signs.reduce((acc, el) => acc + el, 0);
  return sum > 0 ? 1 : -1;
}

function isSafeDiff(diff) {
  return diff <= MAX_SAFE_ADJACENT && diff >= MIN_SAFE_ADJACENT;
}
