import fs from "fs";

const dataCoords = fs
  .readFileSync("./12/data.txt", {
    encoding: "utf8",
  })
  .split("\r\n")
  .map((el, y) =>
    el.split("").map((letter, x) => {
      return {
        letter,
        x,
        y,
      };
    })
  );

const data = dataCoords.flatMap((el) => el);

const neighborPositions = [
  [0, -1],
  [0, 1],
  [1, 0],
  [-1, 0],
];
const oppositeDirections = {
  N: "S",
  S: "N",
  E: "W",
  W: "E",
};

const fencePositions = {
  N: neighborPositions[0],
  S: neighborPositions[1],
  E: neighborPositions[2],
  W: neighborPositions[3],
};

const fenceNeighborPositions = {
  N: neighborPositions[3],
  S: neighborPositions[2],
  E: neighborPositions[1],
  W: neighborPositions[0],
};

let globalId = 1;

data.forEach((cell) => {
  populateCell(cell);
});

const areas = data.reduce((map, el) => {
  const { areaId } = el;
  map.set(areaId, [...(map.get(areaId) ?? []), el]);
  return map;
}, new Map());

// console.log(areas.keys());

// const testArea = areas.get("A-1");
// console.log(getAreaFences(testArea) * testArea.length);

const result = [...areas.values()].reduce((acc, area) => {
  return acc + area.length * getAreaFences(area);
}, 0);

console.log("result", result);

function getAreaFences(area) {
  const directionCells = {
    N: area.filter((cell) => cell.fences.N),
    E: area.filter((cell) => cell.fences.E),
    W: area.filter((cell) => cell.fences.W),
    S: area.filter((cell) => cell.fences.S),
  };
  let fencesCount = 0;
  for (let direction in directionCells) {
    const nodes = directionCells[direction];
    nodes.forEach((node) => {
      if (node.fences[direction] === "visited") {
        return;
      }
      traverseFence(node, direction);
      fencesCount++;
    });
  }
  return fencesCount;
}

function traverseFence(cell, direction) {
  let currentCell = cell;
  while (currentCell?.fences[direction] === "unvisited") {
    currentCell.fences[direction] = "visited";
    currentCell = getFenceNeighbor(currentCell, direction);
    if (currentCell?.letter !== cell.letter) {
      break;
    }
  }
  currentCell = getFenceNeighbor(cell, oppositeDirections[direction]);
  if (currentCell?.letter !== cell.letter) {
    return;
  }
  while (currentCell?.fences[direction] === "unvisited") {
    currentCell.fences[direction] = "visited";
    currentCell = getFenceNeighbor(currentCell, oppositeDirections[direction]);
    if (currentCell?.letter !== cell.letter) {
      break;
    }
  }
}

function populateCell(cell) {
  const { areaId, x, y } = cell;
  if (areaId) {
    return;
  }
  const neighbors = neighborPositions.map(([dx, dy]) => {
    const [cellX, cellY] = [x - dx, y - dy];
    return dataCoords[cellY]?.[cellX];
  });
  const sameLetterNeighbors = neighbors.filter(
    (neighbor) => neighbor && neighbor.letter === cell.letter
  );
  const neighborAreaId = sameLetterNeighbors.find(
    (neighbor) => neighbor.areaId
  )?.areaId;
  cell.areaId = neighborAreaId ?? `${cell.letter}-${globalId++}`;

  cell.fences = mapFences(cell);

  sameLetterNeighbors.forEach((neighbor) => populateCell(neighbor));
}

function mapFences(cell) {
  return {
    N: mapFence(cell, "N"),
    E: mapFence(cell, "E"),
    W: mapFence(cell, "W"),
    S: mapFence(cell, "S"),
  };
}

// fence states "unvisited" | "visited" | null
function mapFence(cell, direction) {
  const neighbor = getNeighbor(cell, direction);
  if (neighbor && neighbor.letter === cell.letter) {
    return null;
  }
  return "unvisited";
}

function getNeighbor(cell, direction) {
  const [dx, dy] = fencePositions[direction];
  const { x, y } = cell;
  return dataCoords[y + dy]?.[x + dx];
}

function getFenceNeighbor(cell, direction) {
  const [dx, dy] = fenceNeighborPositions[direction];
  const { x, y } = cell;
  return dataCoords[y + dy]?.[x + dx];
}
