import fs from "fs";

const data = fs.readFileSync("./5/data.txt", {
  encoding: "utf8",
});

const [rulesData, testData] = data
  .split("\r\n\r\n")
  .map((str) => str.split("\r\n"));

const rules = mapRules(rulesData);
const test = mapTest(testData);

// console.log("RULES:", rules);
console.log(
  "RESULT:",
  test.filter((line) => testSingle(line, rules)).reduce(collectResult, 0)
);

function collectResult(acc, line) {
  return acc + line[Math.floor(line.length / 2)];
}

function testSingle(testLine, rules) {
  //   console.log("\r\nTEST:");
  const restrictedNumbersSet = new Set();
  for (let num of testLine) {
    if (restrictedNumbersSet.has(num)) {
      //   console.log("ERR", num);
      return false;
    }
    const numRestrictedNumbers = rules.get(num);
    // console.log(num, numRestrictedNumbers);
    if (numRestrictedNumbers) {
      rules.get(num).forEach((rule) => restrictedNumbersSet.add(rule));
    }
  }
  return true;
}

function mapTest(rawTest) {
  return rawTest.map((line) => line.split(",").map(Number));
}

function mapRules(rulePairs) {
  const rules = new Map();
  rulePairs.forEach((pair) => {
    const [x, y] = pair.split("|").map(Number);
    addRule(x, y, rules);
  });
  return rules;
}

function addRule(x, y, rules) {
  const numbersSet = rules.get(y);
  if (!numbersSet) {
    const set = new Set();
    set.add(x);
    rules.set(y, set);
    return;
  }
  numbersSet.add(x);
}
