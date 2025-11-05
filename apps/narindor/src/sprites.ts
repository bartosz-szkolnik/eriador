import { loadImage, SpriteSheet } from '@eriador/common';

export async function loadHeroSprite() {
  const image = await loadImage('/assets/hero-tileset.png');
  const sprites = new SpriteSheet(image, 16, 16);

  sprites.define('idle', 0, 80, 12, 16);

  return sprites;
}
