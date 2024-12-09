import fs from "fs";

const data = fs
  .readFileSync("./9/data.txt", {
    encoding: "utf8",
  })
  .split("");

let freeSpaceFlag = false;
let allocatedCount = 0;

const input = data
  .flatMap((char, idx) => {
    const num = Number(char);
    if (freeSpaceFlag) {
      freeSpaceFlag = !freeSpaceFlag;
      return { id: null, size: num };
    } else {
      freeSpaceFlag = !freeSpaceFlag;
      allocatedCount += num;
      return { id: idx / 2, size: num };
    }
  })
  .filter((el) => el.size > 0);

let idx = input.length - 1;
while (idx > 0) {
  const curr = input[idx];
  if (curr.id !== null) {
    const replaced = input
      .slice(0, idx)
      .filter((el) => el.id === null)
      .find((el) => el.size >= curr.size);
    if (replaced) {
      const replacedIdx = input.findIndex((el) => el === replaced);
      const sizeDiff = replaced.size - curr.size;
      input.splice(idx, 1, { id: null, size: curr.size });
      input.splice(replacedIdx, 1, { id: curr.id, size: curr.size });
      if (sizeDiff > 0) {
        input.splice(replacedIdx + 1, 0, { id: null, size: sizeDiff });
        idx++;
      }
    }
  }
  idx--;
}

const mappedInput = input.flatMap((el) => {
  return [...new Array(el.size)].fill(el.id);
});

const result = mappedInput.reduce((acc, curr, idx) => {
  return acc + curr * idx;
}, 0);

console.log("res: ", result);
