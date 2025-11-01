import type { Vector2 } from '@beholder/core';
import type { Piece } from '../components/pieces';
import type { Renderer } from '../components/renderer';

export interface Entity {
  update(_deltaTime: number): void;
  render(renderer: Renderer): void;
}

export interface BoardLike {
  mergeWith: (piece: Piece, offset: Vector2) => void;
  collidesWith: (piece: Piece, offset: Vector2) => boolean;
  rowLength: number;
}
