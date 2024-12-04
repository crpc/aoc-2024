import fs from "fs";

const data = fs.readFileSync("./3/someshit.txt", {
  encoding: "utf8",
});

const dataWithAffixes = "do()" + data.replaceAll("\r\n", "") + "do()";

const groupRegex = /((do\(\))|(don't\(\))).+?(?=(do\(\))|(don't\(\)))/g;

const withinGroupRegex = /mul\(\d{1,3},\d{1,3}\)/g;

const strings = dataWithAffixes
  .match(groupRegex)
  .filter((el) => !el.startsWith("don't"))
  .flatMap((el) => el.match(withinGroupRegex))
  .map(getPair)
  .reduce((acc, el) => {
    const [x, y] = el;
    return acc + x * y;
  }, 0);

console.log(strings);

// ..

function getPair(str) {
  return str
    .substring(4, str.length - 1)
    .split(",")
    .map(Number);
}
