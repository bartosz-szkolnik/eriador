import { initializeCanvas } from '@eriador/common';
import { Tetris } from '../entities/tetris';
import { Renderer } from './renderer';

export type TetrisRendererPair = { tetris: Tetris; renderer: Renderer };

export class TetrisBuilder {
  private readonly template = this.document.getElementById('player-template') as HTMLTemplateElement;

  constructor(private readonly document: Document) {}

  createTetrisGame() {
    const element = this.document.importNode(this.template.content, true).children[0] as HTMLDivElement;
    return this.initTetrisGame(element);
  }

  private initTetrisGame(element: HTMLDivElement): TetrisRendererPair {
    const canvas = element.querySelector<HTMLCanvasElement>(`.tetris`);
    if (!canvas) {
      throw new Error(
        'Could not find a canvas with a class \`tetris\` to paint on. Please provide one within the element.',
      );
    }

    const { context } = initializeCanvas({ element: canvas, width: 240, height: 400 });
    context.scale(20, 20);

    const renderer = new Renderer(context);
    const tetris = new Tetris(element);

    this.document.body.appendChild(element);

    return { tetris, renderer };
  }
}
