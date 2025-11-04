import { Vector2 } from '@eriador/core';

export class Camera {
  readonly position = new Vector2(0, 0);
  readonly size = new Vector2(256, 224);

  readonly min = new Vector2(0, 0);
  readonly max = new Vector2(Infinity, Infinity);
}
