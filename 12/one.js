import fs from "fs";

const data = fs
  .readFileSync("./12/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n")
  .flatMap((el, y) =>
    el.split("").map((letter, x) => {
      return {
        letter,
        x,
        y,
      };
    })
  );

const neighbors = [
  [0, -1],
  [0, 1],
  [1, 0],
  [-1, 0],
];
let globalId = 1;

// point = {x, y, letter: string, areaId: string, fences: number}
// areaId = "{letter}-{globalId}"

// for each point:
// if has no areaId:
// - get all neighbors
// - if same-letter neighbors have no areaId, create new areaId and save to this point
// - count non-same-letter neighbors and save to 'fences' (-1, max -> fence too)
// - repeat for same-letter neighbors

data.forEach((cell) => {
  populateCell(cell);
});

// console.log(data);

const areas = data.reduce((map, el) => {
  const { areaId, fences } = el;
  const { ctr, fences: allFences } = map.get(areaId) ?? { ctr: 0, fences: 0 };
  map.set(areaId, { ctr: ctr + 1, fences: allFences + fences });
  return map;
}, new Map());

const result = [...areas.values()].reduce((acc, el) => {
  return acc + el.ctr * el.fences;
}, 0);

console.log("res: ", result);

function populateCell(cell) {
  const { areaId, x, y } = cell;
  if (areaId) {
    return;
  }
  const cellNeighbors = neighbors.map(([dx, dy]) => {
    const [cellX, cellY] = [x - dx, y - dy];
    return data.find(
      (neighbor) => neighbor.x === cellX && neighbor.y === cellY
    );
  });
  const sameLetterNeighbors = cellNeighbors.filter(
    (neighbor) => neighbor && neighbor.letter === cell.letter
  );
  const neighborAreaId = sameLetterNeighbors.find(
    (neighbor) => neighbor.areaId
  )?.areaId;
  cell.areaId = neighborAreaId ?? `${cell.letter}-${globalId++}`;
  const fences = cellNeighbors.filter((neighbor) => {
    return !neighbor || neighbor.letter !== cell.letter;
  }).length;
  cell.fences = fences;
  sameLetterNeighbors.forEach((neighbor) => populateCell(neighbor));
}
