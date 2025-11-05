import type { SpriteSheet } from './spritesheet';

export class SpriteSheetBox {
  private readonly spriteSheets: Map<string, SpriteSheet> = new Map();

  add(name: string, spriteSheet: SpriteSheet) {
    this.spriteSheets.set(name, spriteSheet);
  }

  get(name: string) {
    const spriteSheet = this.spriteSheets.get(name);
    if (!spriteSheet) {
      throw new Error(`Used a unknown SpriteSheet ${name}. Please check whether that SpriteSheet is available.`);
    }

    return spriteSheet;
  }
}
