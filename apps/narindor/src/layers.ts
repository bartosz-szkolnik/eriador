import type { Camera, Layer, SpriteSheet } from '@eriador/common';
import { Matrix, toIndex, type Entity, type Tile } from '@eriador/core';
import type { Room } from './room';

export function createSpriteLayer(entities: Set<Entity>, width = 64, height = 64): Layer {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferContext = spriteBuffer.getContext('2d')!;

  return function drawSpriteLayer(context, camera) {
    entities.forEach(entity => {
      spriteBufferContext.clearRect(0, 0, width, height);
      entity.draw(spriteBufferContext);
      context.drawImage(spriteBuffer, entity.position.x - camera.position.x, entity.position.y - camera.position.y);
    });
  };
}

export function createBackgroundLayer(room: Room, sprites: SpriteSheet): Layer {
  const tiles = room.tiles;

  const buffer = document.createElement('canvas');
  // Todo: figure out how long should be the buffer
  // buffer.width = 2048;
  buffer.width = 256 + 16;
  buffer.height = 240;
  const bufferContext = buffer.getContext('2d')!;
  const redraw = makeRedrawer('optimized', tiles, sprites);

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

export function createCollisionLayer(room: Room): Layer {
  let resolvedTiles: { x: number; y: number }[] = [];
  const tileResolver = room.tileCollider['tiles'];
  const tileSize = tileResolver['tileSize'];

  const getByIndexOriginal = tileResolver['getByIndex'];
  tileResolver['getByIndex'] = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawCollisionLayer(context, camera) {
    const { x: cameraX, y: cameraY } = camera.position;

    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(x * tileSize - cameraX, y * tileSize - cameraY, tileSize, tileSize);
      context.stroke();
    });

    context.strokeStyle = 'green';
    room.getEntities().forEach(entity => {
      const { x: posX, y: posY } = entity.position;
      context.beginPath();
      context.rect(posX - cameraX, posY - cameraY, entity.size.x, entity.size.y);
      context.stroke();
    });

    resolvedTiles = [];
  };
}

export function createCameraLayer(cameraToDrawOn: Camera): Layer {
  return function drawCameraRectangle(context, cameraToDrawFrom) {
    context.strokeStyle = 'purple';
    context.beginPath();
    context.rect(
      cameraToDrawOn.position.x - cameraToDrawFrom.position.x,
      cameraToDrawOn.position.y - cameraToDrawFrom.position.y,
      cameraToDrawOn.size.x,
      cameraToDrawOn.size.y,
    );
    context.stroke();
  };
}

function makeRedrawer(version: 'optimized' | 'unoptimized', tiles: Matrix<Tile>, sprites: SpriteSheet) {
  if (version === 'optimized') {
    let startIndex = 0,
      endIndex = 0;
    return function redraw(drawFrom: number, drawTo: number, context: CanvasRenderingContext2D) {
      if (drawFrom === startIndex && drawTo === endIndex) {
        return;
      }

      startIndex = drawFrom;
      endIndex = drawTo;

      for (let x = startIndex; x <= endIndex; ++x) {
        const col = tiles.getCol(x);
        if (col) {
          col.forEach((tile, y) => {
            sprites.drawTile(tile.name, context, x - startIndex, y);
          });
        }
      }
    };
  }

  return function redraw(startIndex: number, endIndex: number, context: CanvasRenderingContext2D) {
    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.getCol(x);
      if (col) {
        col.forEach((tile, y) => {
          sprites.drawTile(tile.name, context, x - startIndex, y);
        });
      }
    }
  };
}
