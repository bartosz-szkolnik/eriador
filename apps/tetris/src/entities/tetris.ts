import { EventEmitter } from '@eriador/core';
import type { Entity } from './types';
import { Player, type PlayerEvents } from './player';
import { Board } from './board';
import { Renderer } from '../components/renderer';
import { createState, type DeserializedState, type State } from '../components/state';

export class Tetris implements Entity {
  private readonly events = new EventEmitter<PlayerEvents | 'STATE_CHANGED'>();
  private readonly scoreElement = this.parentElement.querySelector<HTMLDivElement>('.score')!;
  private readonly stateManager = createState();

  private readonly board = new Board(this.stateManager.getState('board'));
  readonly player = new Player(
    this.events as EventEmitter<PlayerEvents>,
    this.board,
    this.stateManager.getState('player'),
  );

  constructor(public readonly parentElement: HTMLDivElement) {
    this.player.init();
    this.initListeners();
  }

  update(deltaTime: number) {
    this.player.update(deltaTime);
  }

  render(renderer: Renderer) {
    renderer.renderBackground();
    this.player.render(renderer);
    this.board.render(renderer);
  }

  listenOnStateManagerEvents() {
    this.stateManager.events.on('STATE_CHANGED', (state: State) => {
      this.events.emit('STATE_CHANGED', state);
    });

    this.player['stateManager'].events.on('STATE_CHANGED', () => {
      this.events.emit('STATE_CHANGED', this.stateManager.getAllState());
    });

    return this.events;
  }

  setState({ score, board, player }: DeserializedState) {
    this.state.modify({ score }, { emitValue: false });

    const { player: playerState, board: boardState } = this.stateManager.getAllState();
    boardState.modifyState({ matrix: board.matrix }, { emitValue: false });

    const { nextPiece, piece, position } = player;
    playerState.modifyState({ piece, nextPiece, position: position }, { emitValue: false });

    this.updateScore(score);
  }

  getState() {
    return this.stateManager.getAllState();
  }

  private initListeners() {
    this.events.on('Player.RESET', () => {
      this.board.clear();

      this.updateScore(0);
    });

    this.events.on('Player.MERGED', () => {
      const { score } = this.state;
      const newScore = score + this.board.sweep();
      this.updateScore(newScore);
    });
  }

  private updateScore(value: number) {
    this.state.modify({ score: value });
    this.scoreElement.innerText = String(value);
  }

  private get state() {
    const state = this.stateManager.getAllState();
    return { ...state, modify: this.stateManager.modifyState };
  }
}
