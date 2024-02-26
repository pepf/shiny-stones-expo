import Grid, { GridSwapErrorCode } from "./grid";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

describe("The Grid class", () => {
  it("is able to create a structured array from a single dimension grid", () => {
    const grid = new Grid(10, 11);
    const [x, y] = grid._grid[6].pos;
    const arrayGrid = grid.ArrayGrid;
    expect(arrayGrid.length).toBe(11);
    expect(arrayGrid[0].length).toBe(10);
    expect(arrayGrid[y][x]).toBe(grid._grid[6]);
  });

  it("is able to check if elements line up horizontally", () => {
    const grid = new Grid(10, 11);

    // Fake a horizontal match
    const item0 = grid.getItemAt([0, 1]);
    const item1 = grid.getItemAt([1, 1]);
    const item2 = grid.getItemAt([2, 1]);
    const item3 = grid.getItemAt([3, 1]);
    const item4 = grid.getItemAt([4, 1]);
    item0 ? (item0.type = 1) : null;
    item1 ? (item1.type = 1) : null;
    item2 ? (item2.type = 1) : null;
    item3 ? (item3.type = 1) : null;
    item4 ? (item4.type = 2) : null;

    const match = grid.findMatchForField([0, 1]);
    expect(match).toBeInstanceOf(Array);
    expect(grid.findMatchForField([1, 1])).toEqual(match);
    expect(grid.findMatchForField([2, 1])).toEqual(match);
  });

  it("is able to check if elements line up vertically", () => {
    const gridHeight = 11;
    const grid = new Grid(10, gridHeight);
    const length = randomIntFromInterval(3, 4);
    const type = 5;
    const startX = randomIntFromInterval(0, 5);
    const startY = 2;
    for (let i = 0; i < gridHeight; i++) {
      const item = grid.getItemAt([startX, i]);
      if (item) {
        item.type = i >= startY && i < startY + length ? type : type - 1;

        const itemNext = grid.getItemAt([startX + 1, i]);
        // prevent horizontal matches
        if (itemNext) {
          itemNext.type = type - 1;
        }
      }
    }

    const match = grid.findMatchForField([startX, startY]);

    expect(match).toBeInstanceOf(Array);
    expect(match.length).toBe(length);
    expect(grid.findMatchForField([startX, startY + 1])).toEqual(match);
    expect(grid.findMatchForField([startX, startY + 2])).toEqual(match);
  });

  it("is able to check the whole grid for matches", () => {
    const grid = new Grid(10, 11);
    var t0 = performance.now();
    const allMatches = grid.findAllMatches();
    var t1 = performance.now();
    console.log(
      "Finding all ",
      allMatches.length,
      " matches took ",
      t1 - t0,
      " milliseconds"
    );
    console.log(allMatches);
  });

  it("should not be possible to swap stones diagonally", () => {
    const grid = new Grid(3, 3);

    // Fake a diagonal match
    const item0 = grid.getItemAt([0, 0]);
    const item1 = grid.getItemAt([1, 1]);
    if (item0 && item1) {
      expect(() => grid.swapPositions(item0, item1)).toThrow(
        GridSwapErrorCode.INVALID_POSITIONS
      );
    }
  });

  it("should not have visible matches (3+ stones in a row) in the initial state", () => {
    const grid = new Grid(10, 10);
    expect(grid.findAllMatches()).toHaveLength(0);
  });
});
