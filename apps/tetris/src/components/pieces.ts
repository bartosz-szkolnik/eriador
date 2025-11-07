import { Matrix } from '@eriador/core';

export const EMPTY = '0';
export const RED = '#FF0D72'; // 1
export const ORANGE = '#FF8E0D'; // 2
export const MAGENTA = '#F538FF'; // 3
export const GREEN = '#0DFF72'; // 4
export const BLUE = '#0DC2FF'; // 5
export const YELLOW = '#FFE138'; // 6
export const DARK_BLUE = '#3877FF'; // 7

export type PieceSymbol = 'T' | 'O' | 'I' | 'S' | 'Z' | 'L' | 'J';
export type Piece = Matrix<string>;

export function getPiece(symbol: PieceSymbol) {
  return PIECES[symbol].copy();
}

const PIECES: Record<PieceSymbol, Piece> = {
  T: Matrix.fromArray(
    numbersToColors([
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]),
  ),
  O: Matrix.fromArray(
    numbersToColors([
      [2, 2],
      [2, 2],
    ]),
  ),
  L: Matrix.fromArray(
    numbersToColors([
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ]),
  ),
  J: Matrix.fromArray(
    numbersToColors([
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ]),
  ),
  I: Matrix.fromArray(
    numbersToColors([
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ]),
  ),
  S: Matrix.fromArray(
    numbersToColors([
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ]),
  ),
  Z: Matrix.fromArray(
    numbersToColors([
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ]),
  ),
};

function numbersToColors(arrays: number[][]) {
  return arrays.map(array => {
    return array.map(value => numberToColor(value));
  });
}

function numberToColor(number: number) {
  switch (number) {
    case 1:
      return RED;
    case 2:
      return ORANGE;
    case 3:
      return MAGENTA;
    case 4:
      return GREEN;
    case 5:
      return BLUE;
    case 6:
      return YELLOW;
    case 7:
      return DARK_BLUE;
    default:
      return EMPTY;
  }
}
