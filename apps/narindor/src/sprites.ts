import { loadImage, SpriteSheet } from '@beholder/common';

export async function loadBackgroundSprites() {
  const image = await loadImage('/assets/dungeon-tileset.png');
  const sprites = new SpriteSheet(image, 16, 16);

  sprites.defineTile('ground', 2, 1);
  sprites.defineTile('wall', 2, 2);

  return sprites;
}

export async function loadHeroSprite() {
  const image = await loadImage('/assets/hero-tileset.png');
  const sprites = new SpriteSheet(image, 16, 16);

  sprites.define('idle', 0, 80, 12, 16);

  return sprites;
}
