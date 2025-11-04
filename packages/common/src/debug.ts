import type { Camera } from './camera';
import type { Entity } from '@eriador/core';

export function setupMouseControl(canvas: HTMLCanvasElement, entity: Entity, camera: Camera) {
  let lastEvent: MouseEvent | null = null;

  ['mousedown', 'mousemove'].forEach(eventName => {
    canvas.addEventListener(eventName, event => {
      const e = event as MouseEvent;

      if (e.buttons === 1) {
        entity.velocity.set(0, 0);
        entity.position.set(e.offsetX + camera.position.x, e.offsetY + camera.position.y);
      } else if (e.buttons === 2 && lastEvent && lastEvent.buttons === 2 && lastEvent.type === 'mousemove') {
        camera.position.x -= e.offsetX - lastEvent.offsetX;
      }

      lastEvent = e;
    });
  });

  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
  });
}
