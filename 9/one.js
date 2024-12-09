import fs from "fs";

const data = fs
  .readFileSync("./9/data.txt", {
    encoding: "utf8",
  })
  .split("");

let freeSpaceFlag = false;
let allocatedCount = 0;

const input = data.flatMap((char, idx) => {
  const num = Number(char);
  if (freeSpaceFlag) {
    freeSpaceFlag = !freeSpaceFlag;
    return [...new Array(num)].fill(null);
  } else {
    freeSpaceFlag = !freeSpaceFlag;
    allocatedCount += num;
    return [...new Array(num)].fill(idx / 2);
  }
});

// console.log(input.join(","));

const compacted = [];

let idx = 0;
while (idx < allocatedCount) {
  if (input[idx] !== null) {
    compacted.push(input[idx]);
  } else {
    let popped;
    do {
      popped = input.pop();
    } while (!popped);
    compacted.push(popped);
  }
  idx++;
}

// console.log(compacted.join(","));

const result = compacted.reduce((acc, curr, idx) => {
  return acc + curr * idx;
}, 0);

console.log(result);
