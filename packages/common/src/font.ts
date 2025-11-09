import type { SpriteSheet } from './spritesheet';

export class Font {
  constructor(
    private sprites: SpriteSheet,
    public size: number,
  ) {}

  print(text: string, context: CanvasRenderingContext2D, x: number, y: number) {
    [...text.toUpperCase()].forEach((char, pos) => {
      this.sprites.draw(char, context, x + pos * this.size, y);
    });
  }
}
