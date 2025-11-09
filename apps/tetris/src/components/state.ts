import { Matrix, Vector2 } from '@eriador/core';
import { EMPTY, type Piece } from './pieces';
import { StateManager } from './state-manager';

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

// We need to create state from a function, because otherwise two tetris games share the state
function createNewInitialState() {
  return {
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
}

export function createState() {
  return new StateManager<State>(createNewInitialState());
}

export type SerializedState = {
  score: number;
  board: { matrix: string[][] };
  player: {
    piece: string[][] | null;
    nextPiece: string[][] | null;
    position: { x: number; y: number };
  };
};

export function serializeState(state: State): SerializedState {
  const { piece, nextPiece, position } = state.player.getAllState();

  return {
    score: state.score,
    board: { matrix: state.board.getState('matrix').serialize() },
    player: {
      piece: piece?.serialize() ?? null,
      nextPiece: nextPiece?.serialize() ?? null,
      position: position.serialize(),
    },
  };
}

export type DeserializedState = {
  score: number;
  board: { matrix: Matrix<string> };
  player: {
    piece: Matrix<string> | null;
    nextPiece: Matrix<string> | null;
    position: Vector2;
  };
};

export function deserializeState(serializedState: SerializedState): DeserializedState {
  const { nextPiece, piece, position } = serializedState.player;
  return {
    score: serializedState.score,
    board: { matrix: Matrix.fromArray(serializedState.board.matrix) },
    player: {
      piece: piece ? Matrix.fromArray(piece) : null,
      nextPiece: nextPiece ? Matrix.fromArray(nextPiece) : null,
      position: Vector2.from(position.x, position.y),
    },
  };
}
