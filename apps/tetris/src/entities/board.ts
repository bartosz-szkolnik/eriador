import { Matrix, Vector2 } from '@beholder/core';
import { EMPTY, type Piece } from '../components/pieces';
import type { BoardLike, Entity } from './types';
import type { Renderer } from '../components/renderer';
import type { BoardState, StateManager } from '../components/state';

export class Board implements Entity, BoardLike {
  constructor(private readonly stateManager: StateManager<BoardState>) {}

  get rowLength() {
    return this.state.matrix.getCol(0).length;
  }

  init() {
    this.state.modify({ matrix: Matrix.create(12, 20, EMPTY) });
  }

  render(renderer: Renderer) {
    renderer.renderMatrix(this.state.matrix, Vector2.zero());
  }

  update(_deltaTime: number) {}

  mergeWith(piece: Piece, offset: Vector2) {
    piece.forEach((value, x, y) => {
      if (value !== EMPTY) {
        this.state.matrix.set(y + offset.y, x + offset.x, value);
      }
    });
  }

  // Todo: refactor
  collidesWith(piece: Piece, offset: Vector2) {
    let result = false;

    piece.forEach((value, x, y) => {
      if (value !== EMPTY && this.state.matrix.get(y + offset.y, x + offset.x) !== EMPTY) {
        result = true;
      }
    });

    return result;
  }

  clear() {
    this.state.matrix.clearAllRows(EMPTY);
  }

  // Todo: refactor
  sweep() {
    let rowCount = 1;
    let score = 0;

    const { matrix } = this.state;

    outer: for (let y = matrix.length - 1; y > 0; --y) {
      for (let x = 0; x < matrix.getCol(y).length; ++x) {
        if (matrix.get(y, x) === EMPTY) {
          continue outer;
        }
      }

      const deletedRow = matrix.splice(y, 1)[0];
      matrix.unshift(deletedRow.fill(EMPTY));
      ++y;

      score += rowCount * 10;
      rowCount *= 2;
    }

    return score;
  }

  private get state() {
    const { matrix } = this.stateManager.getAllState();
    return { matrix, modify: this.stateManager.modifyState };
  }
}
