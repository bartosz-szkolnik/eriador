import { loadJSON } from '@eriador/common';
import type { RoomSpec } from './types';
import { Room } from './room';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { loadBackgroundSprites } from './sprites';

export async function loadRoom(name: string) {
  const [roomSpec, backgroundSprites] = await Promise.all([
    loadJSON<RoomSpec>(`/assets/rooms/${name}.json`),
    loadBackgroundSprites(),
  ]);
  const room = new Room();

  createTiles(room, roomSpec.backgrounds);

  const backgroundLayer = createBackgroundLayer(room, backgroundSprites);
  room.addLayer(backgroundLayer);

  const spriteLayer = createSpriteLayer(room.getEntities());
  room.addLayer(spriteLayer);

  return room;
}

function createTiles(room: Room, backgrounds: RoomSpec['backgrounds']) {
  backgrounds.forEach(background => {
    const { ranges, tile } = background;
    ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; ++x) {
        for (let y = y1; y < y2; ++y) {
          room.tiles.set(y, x, { name: tile });
        }
      }
    });
  });
}
