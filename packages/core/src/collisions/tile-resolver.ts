import { type Tile } from './tile';
import { Matrix } from '../math/matrix';

export type Match = {
  tile: Tile;
  y1: number;
  y2: number;
  x1: number;
  x2: number;
};

export function toIndex(pos: number, tileSize = 16) {
  return Math.floor(pos / tileSize);
}

export class TileResolver {
  constructor(
    private readonly matrix: Matrix<Tile>,
    private readonly tileSize = 16,
  ) {}

  searchByRange(x1: number, x2: number, y1: number, y2: number) {
    const matches: Match[] = [];

    this.toIndexRange(x1, x2).forEach(indexX => {
      this.toIndexRange(y1, y2).forEach(indexY => {
        const match = this.getByIndex(indexX, indexY);
        if (match) {
          matches.push(match);
        }
      });
    });

    return matches;
  }

  // private searchByPosition(posX: number, posY: number) {
  //   return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
  // }

  private toIndexRange(pos1: number, pos2: number) {
    const { tileSize } = this;

    const pMax = Math.ceil(pos2 / tileSize) * tileSize; // where the search should stop
    const range: number[] = [];

    let pos = pos1;
    do {
      range.push(this.toIndex(pos));
      pos += tileSize;
    } while (pos < pMax);

    return range;
  }

  private getByIndex(indexX: number, indexY: number): Match | undefined {
    const tile = this.matrix.get(indexX, indexY);
    const { tileSize } = this;

    if (tile) {
      const y1 = indexY * tileSize;
      const y2 = y1 + tileSize;
      const x1 = indexX * tileSize;
      const x2 = x1 + tileSize;

      return { tile, y1, y2, x1, x2 };
    }
  }

  private toIndex(pos: number) {
    return toIndex(pos, this.tileSize);
  }
}
