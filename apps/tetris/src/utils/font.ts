import { Font, loadImage, SpriteSheet } from '@eriador/common';

const CHARACTERS = ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ©!-×.';
const SIZE = 8;

export async function loadFont() {
  const font = await loadImage('./assets/font.png');
  const fontSprite = new SpriteSheet(font, SIZE, SIZE);

  const rowLength = font.width;

  for (const [index, char] of [...CHARACTERS].entries()) {
    const x = (index * SIZE) % rowLength;
    const y = Math.floor((index * SIZE) / rowLength) * SIZE;

    fontSprite.define(char, x, y, SIZE, SIZE);
  }

  return new Font(fontSprite, SIZE);
}
