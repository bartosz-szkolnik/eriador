import { EventEmitter, MatrixRotateDirection, Vector2 } from '@beholder/core';
import { PieceManager } from '../components/piece-manager';
import type { Renderer } from '../components/renderer';
import type { BoardLike, Entity } from './types';
import type { PlayerState, StateManager } from '../components/state';

// const DROP_TIME = 1000; // 1 second
const DROP_TIME = 500; // 0.5 second

export enum MoveDirection {
  RIGHT = 1,
  LEFT = -1,
}

export type PlayerEvents = 'Player.RESET' | 'Player.MERGED';

export class Player implements Entity {
  private readonly pieceManager = new PieceManager();
  private readonly dropInterval = DROP_TIME;

  private dropCounter = 0;

  constructor(
    private readonly events: EventEmitter<PlayerEvents>,
    private readonly board: BoardLike,
    private readonly stateManager: StateManager<PlayerState>,
  ) {}

  init() {
    const { piece, nextPiece } = this.pieceManager.init();
    this.stateManager.modifyState({ piece, nextPiece, position: Vector2.from(5, 0) });
  }

  update(deltaTime: number) {
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
  }

  render(renderer: Renderer) {
    const { piece, position } = this.state;
    const lowestPosition = this.findLowestPosition();

    renderer.renderMatrix(piece, position);
    renderer.renderOutlineOfMatrix(piece, Vector2.from(position.x, lowestPosition));
  }

  drop() {
    const { piece, position } = this.state;
    this.dropCounter = 0;
    position.y++;

    if (this.board.collidesWith(piece, position)) {
      position.y--;
      this.board.mergeWith(piece, position);

      this.afterMerge();
    }
  }

  dropToBottom() {
    const { position, piece } = this.state;
    this.dropCounter = 0;

    do {
      position.y++;
    } while (!this.board.collidesWith(piece, position));

    position.y--;
    this.board.mergeWith(piece, position);
    this.afterMerge();
  }

  move(direction: MoveDirection) {
    const { piece, position } = this.state;
    position.x += direction;
    if (this.board.collidesWith(piece, position)) {
      position.x -= direction;
    }
  }

  rotateLeft() {
    this.rotate(MatrixRotateDirection.LEFT);
  }

  rotateRight() {
    this.rotate(MatrixRotateDirection.RIGHT);
  }

  reset() {
    const { piece, nextPiece } = this.pieceManager.init();
    const position = Vector2.from(5, 0);

    this.state.modify({ nextPiece, piece, position });
    this.events.emit('Player.RESET');
  }

  private rotate(direction: MatrixRotateDirection) {
    const { piece, position } = this.state;
    const lastX = position.x;

    let moveBackBy = 1;
    piece.rotate(direction);

    while (this.board.collidesWith(piece, position)) {
      position.x += moveBackBy;
      // Todo: isn't it better to do this with checking direction?
      moveBackBy = -(moveBackBy + (moveBackBy > 0 ? 1 : -1));

      if (moveBackBy > piece.getCol(0).length) {
        piece.rotate(-direction);

        position.x = lastX;
        return;
      }
    }
  }

  private afterMerge() {
    this.dropCounter = 0;

    const { nextPiece: piece } = this.state;
    const nextPiece = this.pieceManager.next();

    const position = Vector2.from(this.middleOfArena, 0);
    this.state.modify({ nextPiece, piece, position });

    if (this.board.collidesWith(piece, position)) {
      this.events.emit('Player.RESET');
    } else {
      this.events.emit('Player.MERGED');
    }
  }

  private get rowLength() {
    return this.state.piece.getCol(0).length;
  }

  private get middleOfArena() {
    return Math.floor(this.board.rowLength / 2) - Math.floor(this.rowLength / 2);
  }

  private findLowestPosition() {
    const { position, piece } = this.state;

    let savedY = position.y;
    let lowest = 0;

    do {
      position.y++;
    } while (!this.board.collidesWith(piece, position));

    lowest = position.y;
    position.y = savedY;

    return lowest - 1;
  }

  private get state() {
    const { piece, nextPiece, ...rest } = this.stateManager.getAllState();
    if (!piece || !nextPiece) {
      throw new Error('You tried to use a piece that was set to null. Fix it!');
    }

    return { ...rest, piece, nextPiece, modify: this.stateManager.modifyState };
  }
}
