import type { Layer, SpriteSheet } from '@eriador/common';
import type { Entity } from '@eriador/core';
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
  const buffer = document.createElement('canvas');
  buffer.width = 2048;
  buffer.height = 240;
  const context = buffer.getContext('2d')!;

  room.tiles.forEach((tile, x, y) => {
    sprites.drawTile(tile.name, context, x, y);
  });

  return function drawBackgroundLayer(context, camera) {
    const { x, y } = camera.position;
    context.drawImage(buffer, -x, y);
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
