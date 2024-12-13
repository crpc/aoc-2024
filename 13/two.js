import fs from "fs";

const data = fs
  .readFileSync("./13/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n\r\n")
  .map((input) => {
    const [ax, ay, bx, by] = input.match(/(?<=[XY]\+)(\d+)/g).map(Number);
    const [rx, ry] = input
      .match(/(?<=[XY]=)(\d+)/g)
      .map(Number)
      .map((num) => num + 10000000000000);
    return { ax, ay, bx, by, rx, ry };
  });

const result = data
  .map((input) => [findX(input), findY(input)])
  .filter(([x, y]) => Number.isInteger(x) && Number.isInteger(y))
  .reduce((acc, [x, y]) => acc + x * 3 + y, 0);

console.log("res: ", result);

function findX(input) {
  const { ax, ay, bx, by, rx, ry } = input;

  return (rx * by - bx * ry) / (ax * by - bx * ay);
}

function findY(input) {
  const { ax, ay, bx, by, rx, ry } = input;

  return (ax * ry - rx * ay) / (ax * by - bx * ay);
}
