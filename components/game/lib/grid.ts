import cloneDeep from "lodash.clonedeep";
import sortBy from "lodash.sortby";

/**
 * from https://raw.githubusercontent.com/pepf/shiny-stones/master/src/grid.ts
 */

type Position = [number, number];
export type GridItem = {
  id: string;
  type: number;
  pos: Position;
};

export enum GridSwapErrorCode {
  TOO_FAR = "Too far!",
  IDENTICAL_ITEMS = "Identical items",
  INVALID_POSITIONS = "Invalid positions",
}

export class GridSwapError extends Error {
  constructor(opts: GridSwapErrorCode) {
    super(opts);
    this.name = "GridSwapError";
  }
}

enum Axis {
  X,
  Y,
}

class Grid {
  types = [0, 1, 2, 3, 4];

  _grid: GridItem[] = [];
  _width: number = 0;
  _height: number = 0;

  MAX_DISTANCE = 1 as const;
  MATCH_LENGTH = 3 as const;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;

    // Fill the grid with random items
    this._grid = Array(width * height)
      .fill(null)
      .map((v, index) => {
        const indexX = index % width;
        const indexY = Math.floor(index / width);
        return this.createItem(indexX, indexY);
      });

    // After filling, remove all matches
    const processMatches = (
      matches: ReturnType<typeof this.findAllMatches>
    ) => {
      this.removeMatches(matches);
      this.moveDown();
      this.fill();
      const newMatches = this.findAllMatches();
      if (newMatches.length >= 1) {
        processMatches(newMatches);
      }
    };

    // Recursively find and remove matches until none are left.
    processMatches(this.findAllMatches());
  }

  private createItem(x: number, y: number): GridItem {
    const type = Math.floor(Math.random() * this.types.length);
    const uuid = Math.floor(Math.random() * 1000000).toString();
    return {
      id: `${x}${y}${type}${uuid}`,
      type,
      pos: [x, y],
    };
  }

  get ArrayGrid(): GridItem[][] {
    return this.arrayGridFrom();
  }
  _logArrayGrid() {
    console.log(this.ArrayGrid.map((v) => v.map((i) => i.type).join("-")));
  }

  private arrayGridFrom = (grid?: GridItem[]) => {
    grid = grid || this._grid;
    const arrayGrid = new Array(this._height).fill(null).map((_, indexY) =>
      new Array(this._width).fill(null).map((__, indexX) => {
        const item = grid.find(
          (item) => item.pos[0] === indexX && item.pos[1] === indexY
        );
        return item;
      })
    );

    return arrayGrid;
  };

  getItemAt([x, y]: Position) {
    return (
      this._grid.find((item) => item.pos[0] === x && item.pos[1] === y) || null
    );
  }

  /**
   *
   * @param item1 First selected GridItem
   * @param item2 Second selected GridItem
   * @returns the updated grid or throws a {@link GridSwapErrorCode}
   */
  swapPositions(
    item1: GridItem,
    item2: GridItem
  ): [GridItem[], () => GridItem[]] {
    const grid = cloneDeep(this._grid);
    const [x1, y1] = item1.pos;
    const [x2, y2] = item2.pos;

    const xDistance = Math.abs(x2 - x1);
    const yDistance = Math.abs(y2 - y1);
    if (xDistance > this.MAX_DISTANCE || yDistance > this.MAX_DISTANCE) {
      throw new GridSwapError(GridSwapErrorCode.INVALID_POSITIONS);
    }
    if (x1 === x2 && y1 === y2) {
      throw new GridSwapError(GridSwapErrorCode.IDENTICAL_ITEMS);
    }
    if (xDistance > 0 && yDistance > 0) {
      throw new GridSwapError(GridSwapErrorCode.INVALID_POSITIONS);
    }
    const index1 = grid.findIndex((item) => item.id === item1.id);
    const index2 = grid.findIndex((item) => item.id === item2.id);
    grid[index1].pos = [x2, y2];
    grid[index2].pos = [x1, y1];
    console.log("swapped ", [x2, y2], "with", [x1, y1]);
    this._grid = grid;

    /**
     * Function to revert this swap.
     * Could be extended to a more extensive "log" of moves, but not needed right now.
     */
    const revertSwap = () => {
      console.log("reverted swap");
      grid[index1].pos = [x1, y1];
      grid[index2].pos = [x2, y2];
      this._grid = grid;
      return grid;
    };
    return [grid, revertSwap];
  }

  findAllMatches(): Array<GridItem[]> {
    const marked: Array<String> = [];
    const matches = this._grid.reduce((prev: Array<GridItem[]>, gridItem) => {
      // if this is already part of another match, skip
      if (marked.includes(gridItem.id)) return prev;

      // expensive, check for match
      const match = this.findMatchForField(gridItem.pos);
      if (match) {
        const matchIds = match.map((m) => m.id);
        marked.push(...matchIds);
        prev.push(match);
      } else {
        marked.push(gridItem.id);
      }
      return prev;
    }, []);

    return matches;
  }

  findMatchForField([x, y]: Position): GridItem[] {
    const grid = this.ArrayGrid;
    const item = grid[y][x];
    const { type } = item;

    let match: GridItem[] = [];

    const checkNext = (incr: boolean, axis: Axis) => {
      const recurseCheck = ([x, y]: Position) => {
        let item: GridItem;
        try {
          item = grid[y][x];
        } catch (e) {
          // console.log(e, x, y)
          return;
        }

        if (item && type === item.type) {
          if (!match.find((m) => m.id === item.id)) {
            match.push(cloneDeep(item));
          }
          const newX = axis === Axis.X ? (incr ? x + 1 : x - 1) : x;
          const newY = axis === Axis.Y ? (incr ? y + 1 : y - 1) : y;
          recurseCheck([newX, newY]);
        }
        return;
      };
      return recurseCheck;
    };

    checkNext(true, Axis.X)([x, y]);
    checkNext(false, Axis.X)([x, y]);
    if (match.length <= 1) {
      checkNext(true, Axis.Y)([x, y]);
      checkNext(false, Axis.Y)([x, y]);
    }

    // Only match if it contains more than MATCH_LENGTH gems
    if (match.length > 0 && match.length >= this.MATCH_LENGTH) {
      // return match in normalized structure
      return sortBy(match, [(match) => match.pos[0], (match) => match.pos[1]]);
    }
    return null;
  }

  // Returns a copy of the grid
  removeMatch(match: GridItem[]) {
    let grid = cloneDeep(this._grid);
    const ids = match.map((m) => m.id);
    grid = grid.filter((item) => !ids.includes(item.id));
    return grid;
  }

  // Modifies internal state
  removeMatches(matches: Array<GridItem[]>) {
    const gridWithoutMatches = matches.reduce((grid, match) => {
      if (!match) return grid;
      grid._grid = grid.removeMatch(match);
      return grid;
    }, this);

    return gridWithoutMatches;
  }

  // Basically bubble sort, any ideas?
  moveDown(): GridItem[] {
    let grid = cloneDeep(this._grid);
    const cycle = () => {
      const arrayGrid = this.arrayGridFrom(grid);
      let clean = true;
      arrayGrid.forEach((row, indexY) => {
        row.forEach((item, indexX) => {
          if (!item) {
            const oneUp =
              (arrayGrid[indexY + 1] && arrayGrid[indexY + 1][indexX]) || null;
            if (oneUp) {
              const itemIndex = grid.findIndex((item) => item.id === oneUp.id);
              grid[itemIndex].pos = [indexX, indexY];
              clean = false;
            }
          }
        });
      });
      return clean;
    };
    let i = 0;
    while (cycle() === false) {
      i++;
    }
    // console.log("sorting took ", i, " cycles");
    this._grid = grid;
    return grid;
  }

  /** Iterate over top row, figure out how much to add per column  */
  fill(): GridItem[] {
    let grid = cloneDeep(this._grid);
    const arrayGrid = this.arrayGridFrom(grid);

    const indexY = arrayGrid.length - 1;
    arrayGrid[indexY].forEach((item, indexX) => {
      for (let y = indexY; typeof arrayGrid[y]?.[indexX] === "undefined"; y--) {
        const item = this.createItem(indexX, y);
        grid.push(item);
      }
    });
    this._grid = grid;
    return grid;
  }
}

export default Grid;
