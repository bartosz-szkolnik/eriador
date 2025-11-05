import { createAnimation, loadImage, loadJSON, SpriteSheet, SpriteSheetBox } from '@eriador/common';
import type { RoomSpec, SheetSpec, TileSpec } from './types';
import { Room } from './room';
import { createBackgroundLayer, createSpriteLayer } from './layers';

export async function loadRoom(name: string) {
  const roomSpec = await loadJSON<RoomSpec>(`/assets/rooms/${name}.json`);
  const backgroundSprites = await loadSpriteSheetBox(roomSpec.spriteSheets);

  const room = new Room();
  createTiles(room, roomSpec.backgrounds);

  const backgroundLayer = createBackgroundLayer(room, backgroundSprites);
  room.addLayer(backgroundLayer);

  const spriteLayer = createSpriteLayer(room.getEntities());
  room.addLayer(spriteLayer);

  return room;
}

async function loadSpriteSheetBox(names: string[]) {
  const box = new SpriteSheetBox();

  for (const name of names) {
    const sprites = await loadSpriteSheet(name);
    box.add(name, sprites);
  }

  return box;
}

export async function loadSpriteSheet(name: string) {
  const sheetSpec = (await loadJSON(`/assets/sprites/${name}.json`)) as SheetSpec;
  const { imageURL, tileHeight, tileWidth, tiles, frames, animations } = sheetSpec;
  const image = await loadImage(imageURL);

  const sprites = new SpriteSheet(image, tileWidth, tileHeight);

  if (tiles) {
    tiles.forEach(({ name, index: [x, y] }) => {
      sprites.defineTile(name, x, y);
    });
  }

  if (frames) {
    frames.forEach(({ name, rectangle: [x, y, width, height] }) => {
      sprites.define(name, x, y, width, height);
    });
  }

  if (animations) {
    animations.forEach(({ name, frames, frameLength }) => {
      const animation = createAnimation(frames, frameLength);
      sprites.defineAnimation(name, animation);
    });
  }

  return sprites;
}

function createTiles(room: Room, backgrounds: RoomSpec['backgrounds']) {
  function applyRange(
    { tile, behavior, tileset }: TileSpec,
    xStart: number,
    xLength: number,
    yStart: number,
    yLength: number,
  ) {
    const xEnd = xStart + xLength;
    const yEnd = yStart + yLength;

    for (let x = xStart; x < xEnd; ++x) {
      for (let y = yStart; y < yEnd; ++y) {
        room.tiles.set(x, y, { name: tile, behavior, tileset });
      }
    }
  }

  backgrounds.forEach(background => {
    const { ranges } = background;
    ranges.forEach(range => {
      if (range.length === 4) {
        const [xStart, xLength, yStart, yLength] = range;
        applyRange(background, xStart, xLength, yStart, yLength);
      }

      if (range.length === 3) {
        const [xStart, xLength, yStart] = range;
        applyRange(background, xStart, xLength, yStart, 1);
      }

      if (range.length === 2) {
        const [xStart, yStart] = range;
        applyRange(background, xStart, 1, yStart, 1);
      }
    });
  });
}
