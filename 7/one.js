import fs from "fs";

const data = fs
  .readFileSync("./7/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n");

const parsedData = parseInput(data);

console.log(sumOutput(parsedData));

function sumOutput(input) {
  return input.reduce((acc, res) => {
    return acc + calculateLine(res);
  }, 0);
}

function calculateLine(line) {
  const [expected, elements] = line;
  const tree = buildTree(elements, 0);
  const results = [];
  collectResults(tree, tree.element, results);
  if (results.some((result) => result === expected)) {
    return expected;
  }
  return 0;
}

function collectResults(node, currentResult, results) {
  if (!node.add || !node.multiply) {
    results.push(currentResult);
  }
  if (node.add) {
    collectResults(node.add, currentResult + node.add.element, results);
  }
  if (node.multiply) {
    collectResults(
      node.multiply,
      currentResult * node.multiply.element,
      results
    );
  }
}

function buildTree(elements, index) {
  const isLastNode = index === elements.length - 1;
  return {
    element: elements[index],
    add: !isLastNode && buildTree(elements, index + 1),
    multiply: !isLastNode && buildTree(elements, index + 1),
  };
}

function parseInput(input) {
  return input.map(parseLine);
}

function parseLine(line) {
  const [result, elements] = line.split(": ");
  return [Number(result), elements.split(" ").map(Number)];
}
