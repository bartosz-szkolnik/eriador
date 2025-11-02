import type { Layer, SpriteSheet } from '@beholder/common';
import type { TileSpec } from './types';
import type { Entity } from '@beholder/core';

export function createSpriteLayer(entity: Entity): Layer {
  return function drawSpriteLayer(context) {
    entity.draw(context);
  };
}

export function createBackgroundLayer(backgrounds: TileSpec[], sprites: SpriteSheet): Layer {
  const buffer = document.createElement('canvas');
  buffer.width = 256;
  buffer.height = 240;

  backgrounds.forEach(background => {
    drawBackground(background, buffer.getContext('2d')!, sprites);
  });

  return function drawBackgroundLayer(context) {
    context.drawImage(buffer, 0, 0);
  };
}

function drawBackground(background: TileSpec, context: CanvasRenderingContext2D, sprites: SpriteSheet) {
  background.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.drawTile(background.tile, context, x, y);
      }
    }
  });
}
