import type { Layer } from '@eriador/common';
import type { Entity } from '@eriador/core';

export function createSpriteLayer(entities: Set<Entity>, width = 64, height = 64): Layer {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferContext = spriteBuffer.getContext('2d')!;

  return function drawSpriteLayer(context, camera) {
    entities.forEach(entity => {
      spriteBufferContext.clearRect(0, 0, width, height);
      entity.draw(spriteBufferContext);
      context.drawImage(
        spriteBuffer,
        Math.floor(entity.position.x - camera.position.x),
        Math.floor(entity.position.y - camera.position.y),
      );
    });
  };
}
