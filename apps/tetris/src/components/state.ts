import { Matrix, Vector2 } from '@beholder/core';
import { EMPTY, type Piece } from './pieces';

export type State = {
  player: StateManager<PlayerState>;
  board: StateManager<BoardState>;
  score: number;
};

export type PlayerState = {
  piece: Piece | null;
  nextPiece: Piece | null;
  position: Vector2;
};

export type BoardState = {
  matrix: Matrix<string>;
};

export class StateManager<TState> {
  constructor(private state: TState) {}

  getState<Key extends keyof TState>(key: Key) {
    return this.state[key];
  }

  getAllState() {
    return { ...this.state };
  }

  modifyState = (value: Partial<TState>) => {
    this.state = { ...this.state, ...value };
  };
}

const INITIAL_STATE = {
  player: new StateManager<PlayerState>({
    piece: null,
    nextPiece: null,
    position: Vector2.zero(),
  }),
  board: new StateManager<BoardState>({
    matrix: Matrix.create(12, 20, EMPTY),
  }),
  score: 0,
} satisfies State;

export function createState() {
  return new StateManager(INITIAL_STATE);
}
