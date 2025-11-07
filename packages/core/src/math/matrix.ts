export enum MatrixRotateDirection {
  RIGHT = 1,
  LEFT = -1,
}

export class Matrix<T = unknown> {
  private readonly grid: Array<Array<T>> = [];

  get length() {
    return this.grid.length;
  }

  clearAllRows(withValue: T) {
    this.grid.forEach(row => row.fill(withValue));
  }

  set(x: number, y: number, value: T) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }

  get(x: number, y: number) {
    const col = this.grid[x];
    if (col) {
      return col[y];
    }

    return undefined;
  }

  getCol(y: number) {
    return this.grid[y];
  }

  forEach(fn: (value: T, x: number, y: number) => void) {
    this.grid.forEach((column, y) => {
      column.forEach((value, x) => {
        fn(value, x, y);
      });
    });
  }

  rotate(direction: MatrixRotateDirection) {
    for (let y = 0; y < this.grid.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [this.grid[x][y], this.grid[y][x]] = [this.grid[y][x], this.grid[x][y]];
      }
    }

    if (direction === MatrixRotateDirection.RIGHT) {
      this.grid.forEach(row => row.reverse());
    } else {
      this.grid.reverse();
    }
  }

  delete(x: number, y: number) {
    const col = this.grid[x];
    if (col) {
      delete col[y];
    }
  }

  unshift(row: Array<T>) {
    this.grid.unshift(row);
  }

  splice(y: number, deleteCount = 1) {
    return this.grid.splice(y, deleteCount);
  }

  copy() {
    return Matrix.fromArray(this.grid);
  }

  static fromArray<T>(array: T[][]) {
    const matrix = new Matrix<T>();

    array.forEach((row, y) => {
      row.forEach((value, x) => {
        matrix.set(x, y, value);
      });
    });

    return matrix;
  }

  static create<T>(width: number, height: number, initialValue?: T) {
    const matrix = new Matrix<T>();

    while (height--) {
      matrix.grid.push(new Array(width).fill(initialValue ?? 0));
    }

    return matrix;
  }
}
