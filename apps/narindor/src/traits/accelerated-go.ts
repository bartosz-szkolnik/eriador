import { Entity, Trait, type GameContext } from '@eriador/core';

export class AcceleratedGo extends Trait {
  private direction = 0;
  private heading = 1;
  distance = 0;

  private readonly acceleration = 400;
  private readonly deceleration = 300;
  private readonly dragFactor = 1 / 5000;

  get isMoving() {
    return this.direction !== 0;
  }

  get isMovingRight() {
    return this.direction > 0;
  }

  get isMovingLeft() {
    return this.direction < 0;
  }

  get isHeadingRight() {
    return this.heading > 0;
  }

  get isHeadingLeft() {
    return this.heading < 0;
  }

  get hasStoppedMoving() {
    return this.distance === 0;
  }

  update(entity: Entity, { deltaTime }: GameContext) {
    const absX = Math.abs(entity.velocity.x);

    if (this.isMoving) {
      entity.velocity.x += this.acceleration * deltaTime * this.direction;

      this.heading = this.direction;
    } else if (entity.velocity.x !== 0) {
      const decel = Math.min(absX, this.deceleration * deltaTime);
      entity.velocity.x += entity.velocity.x > 0 ? -decel : decel;
    } else {
      this.distance = 0;
    }

    const drag = this.dragFactor * entity.velocity.x * absX;
    entity.velocity.x -= drag;

    this.distance += absX * deltaTime;
  }

  changeDirection(direction: number) {
    this.direction += direction;
  }
}
