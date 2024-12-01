import fs from "fs";

const data = fs.readFileSync("./1/data.txt", {
  encoding: "utf8",
});

const lines = data.split("\r\n");

let firstLocations = [];
let occurences = new Map();
lines.forEach((line) => {
  const [first, second] = line.split("   ");
  firstLocations.push(first);
  addOccurence(occurences, second);
});

const result = firstLocations.reduce((acc, el) => {
  const NoOfOccurences = occurences.get(el) ?? 0;
  return acc + el * NoOfOccurences;
}, 0);

console.log(result);

// --

function addOccurence(occurences, number) {
  const NoOfOccurences = occurences.get(number);
  if (!NoOfOccurences) {
    occurences.set(number, 1);
    return;
  }
  occurences.set(number, NoOfOccurences + 1);
}
