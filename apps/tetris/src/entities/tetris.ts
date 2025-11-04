import { EventEmitter } from '@eriador/core';
import type { Entity } from './types';
import { Player, type PlayerEvents } from './player';
import { Board } from './board';
import { Renderer } from '../components/renderer';
import { createState } from '../components/state';

export class Tetris implements Entity {
  private readonly events = new EventEmitter<PlayerEvents>();
  private readonly stateManager = createState();

  private readonly board = new Board(this.stateManager.getState('board'));
  readonly player = new Player(this.events, this.board, this.stateManager.getState('player'));

  constructor(private readonly scoreElement: HTMLDivElement) {
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
