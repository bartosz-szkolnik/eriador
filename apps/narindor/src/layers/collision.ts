import type { Layer } from '@eriador/common';
import type { Room } from '../room';

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
