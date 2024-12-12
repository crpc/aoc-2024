import fs from "fs";

const data = fs
  .readFileSync("./11/data.txt", {
    encoding: "utf8",
  })
  .split(" ");

const blinks = 75;

let stones = data.reduce((acc, el) => {
  acc.set(el, (acc.get(el) ?? 0) + 1);
  return acc;
}, new Map());

for (let i = 0; i < blinks; i++) {
  const newStones = new Map();
  [...stones.keys()].forEach((el) => {
    transformStone(el).forEach((newStone) => {
      newStones.set(newStone, (newStones.get(newStone) ?? 0) + stones.get(el));
    });
  });
  stones = newStones;
}

// console.log(stones);
console.log(
  [...stones.keys()].reduce((acc, el) => {
    return acc + stones.get(el);
  }, 0)
);

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
