import fs from "fs";

const data = fs.readFileSync("./3/data.txt", {
  encoding: "utf8",
});

const regex = /mul\(\d{1,3},\d{1,3}\)/g;

const strings = data.match(regex);

const pairs = strings.map((el) =>
  el
    .substring(4, el.length - 1)
    .split(",")
    .map(Number)
);

const result = pairs.reduce((acc, el) => {
  const [x, y] = el;
  return acc + x * y;
}, 0);

console.log(result);
