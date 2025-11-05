import { loadImage, loadJSON, SpriteSheet } from '@eriador/common';
import type { RoomSpec, SheetSpec, TileSpec } from './types';
import { Room } from './room';
import { createBackgroundLayer, createSpriteLayer } from './layers';

export async function loadRoom(name: string) {
  const roomSpec = await loadJSON<RoomSpec>(`/assets/rooms/${name}.json`);
  const backgroundSprites = await loadSpriteSheet(roomSpec.spriteSheet);

  const room = new Room();
  createTiles(room, roomSpec.backgrounds);

  const backgroundLayer = createBackgroundLayer(room, backgroundSprites);
  room.addLayer(backgroundLayer);

  const spriteLayer = createSpriteLayer(room.getEntities());
  room.addLayer(spriteLayer);

  return room;
}

async function loadSpriteSheet(name: string) {
  const { imageURL, tileHeight, tileWidth, tiles } = (await loadJSON(`/assets/sprite-sets/${name}.json`)) as SheetSpec;
  const image = await loadImage(imageURL);

  const sprites = new SpriteSheet(image, tileWidth, tileHeight);

  tiles.forEach(({ name, index: [x, y] }) => {
    sprites.defineTile(name, x, y);
  });

  return sprites;
}

function createTiles(room: Room, backgrounds: RoomSpec['backgrounds']) {
  function applyRange({ tile, behavior }: TileSpec, xStart: number, xLength: number, yStart: number, yLength: number) {
    const xEnd = xStart + xLength;
    const yEnd = yStart + yLength;

    for (let x = xStart; x < xEnd; ++x) {
      for (let y = yStart; y < yEnd; ++y) {
        room.tiles.set(x, y, { name: tile, behavior });
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
