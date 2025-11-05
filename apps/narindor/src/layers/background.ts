import { Matrix, toIndex, type Tile } from '@eriador/core';
import type { Layer, SpriteSheetBox } from '@eriador/common';
import type { Room } from '../room';

export function createBackgroundLayer(room: Room, spriteBox: SpriteSheetBox): Layer {
  const tiles = room.tiles;

  const buffer = document.createElement('canvas');
  // Todo: figure out how long should be the buffer
  // buffer.width = 2048;
  buffer.width = 256 + 16;
  buffer.height = 240;
  const bufferContext = buffer.getContext('2d')!;
  const redraw = makeRedrawer('optimized', tiles, spriteBox, room);

  return function drawBackgroundLayer(context, camera) {
    const { x, y } = camera.position;

    const drawWidth = toIndex(camera.size.x);
    const drawFrom = toIndex(x);
    const drawTo = drawFrom + drawWidth;
    redraw(drawFrom, drawTo, bufferContext);

    // Todo: make this 16 into a constant
    context.drawImage(buffer, -x % 16, -y);
  };
}

function makeRedrawer(
  version: 'optimized' | 'unoptimized',
  tiles: Matrix<Tile>,
  spriteBox: SpriteSheetBox,
  room: Room,
) {
  function draw(startIndex: number, endIndex: number, context: CanvasRenderingContext2D, room: Room) {
    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.getCol(x);
      if (col) {
        col.forEach((tile, y) => {
          const sprites = spriteBox.get(tile.tileset);
          if (sprites.hasAnimation(tile.name)) {
            sprites.drawAnimation(tile.name, context, x * 2 - startIndex, y * 2, room.totalTime);
            return;
          }

          if (sprites.size === 8) {
            sprites.drawTile(tile.name, context, x * 2 - startIndex, y * 2);
            return;
          }

          sprites.drawTile(tile.name, context, x - startIndex, y);
        });
      }
    }
  }

  if (version === 'optimized') {
    let startIndex = 0;
    let endIndex = 0;
    return function redraw(drawFrom: number, drawTo: number, context: CanvasRenderingContext2D) {
      if (drawFrom === startIndex && drawTo === endIndex) {
        return;
      }

      startIndex = drawFrom;
      endIndex = drawTo;

      draw(startIndex, endIndex, context, room);
    };
  }

  return function redraw(startIndex: number, endIndex: number, context: CanvasRenderingContext2D) {
    draw(startIndex, endIndex, context, room);
  };
}
