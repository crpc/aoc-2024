import fs from "fs";

console.time("run");

const data = fs
  .readFileSync("./11/data.txt", {
    encoding: "utf8",
  })
  .split(" ");

const blinks = 25;

let stones = data;

for (let i = 0; i < blinks; i++) {
  const newStones = [];
  stones.forEach((el) => {
    newStones.push(...transformStone(el));
  });
  stones = newStones;
}

console.log(stones.length);

console.timeEnd("run");

function transformStone(stone) {
  if (stone === "0") {
    return ["1"];
  }
  if (stone.length % 2 === 0) {
    return [
      stone.substring(0, stone.length / 2),
      stone.substring(stone.length / 2),
    ].map(trimZeros);
  }
  return [String(Number(stone) * 2024)];
}

function trimZeros(str) {
  const match = str.match(/^0+(\d+)$/);
  return match?.[1] ?? str;
}
