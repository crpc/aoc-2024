import fs from "fs";

const data = fs.readFileSync("./1/data.txt", {
  encoding: "utf8",
});

const lines = data.split("\r\n");

let firstLocations = [];
let secondLocations = [];
lines.forEach((line) => {
  const [first, second] = line.split("   ");
  firstLocations.push(first);
  secondLocations.push(second);
});

firstLocations = firstLocations.sort();
secondLocations = secondLocations.sort();

const result = firstLocations.reduce((acc, el, idx) => {
  return acc + Math.abs(el - secondLocations[idx]);
}, 0);

console.log(result);
