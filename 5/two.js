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
  test
    .map((line) => getLineNumberIfFixed(line, rules))
    .reduce((acc, res) => {
      return acc + res;
    }, 0)
);

function collectResult(acc, line) {
  return acc + line[Math.floor(line.length / 2)];
}

/**
 *
 * data {
 *  number,
 *  rules: number[]
 * }
 */

// to check if incorrect: after repositioning element reevaluate elements after it

function getLineNumberIfFixed(testLine, rules) {
  const newLine = [];
  let wasFixed = false;
  const restrictedNumbersSet = new Set();

  for (let num of testLine) {
    const newEl = {
      num,
      rules: rules.get(num) ?? new Set(),
    };
    if (restrictedNumbersSet.has(num)) {
      wasFixed = true;
      const insertBeforeIdx = newLine.findIndex((el) => el.rules.has(num));
      newLine.splice(insertBeforeIdx, 0, newEl);
    } else {
      newLine.push(newEl);
    }
    newEl.rules.forEach((rule) => restrictedNumbersSet.add(rule));
  }
  return wasFixed ? newLine[Math.floor(newLine.length / 2)].num : 0;
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

/**
 returns map: { y -> set(x) }
 if X is printed after Y -> error --> X must be moved before Y
 */
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
