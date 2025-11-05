import { Entity, Trait, type GameContext } from '@eriador/core';

// export const GoDirection = {
//   IDLE: 0,
//   LEFT: -1,
//   RIGHT: 1,
// } as const;

// export type GoDirection = (typeof GoDirection)[keyof typeof GoDirection];

// make those fields private

export class Go extends Trait {
  private readonly speed = 6000;
  private direction = 0;

  // acceleration = 400;
  // deceleration = 300;
  // dragFactor = 1 / 5000;

  distance = 0;
  heading = 1;

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

  update(entity: Entity, { deltaTime }: GameContext) {
    entity.velocity.x = this.speed * deltaTime * this.direction;
    const absX = Math.abs(entity.velocity.x);
    // entity.velocity.x += this.acceleration * deltaTime * this.direction;

    // if (this.direction) {
    //   this.heading = this.direction;
    // } else if (entity.velocity.x !== 0) {
    //   const decel = Math.min(absX, this.deceleration * deltaTime);
    //   entity.velocity.x += entity.velocity.x > 0 ? -decel : decel;
    // } else {
    //   this.distance = 0;
    // }

    // const drag = this.dragFactor * entity.velocity.x * absX;
    // entity.velocity.x -= drag;

    if (this.isMoving) {
      this.heading = this.direction;
      this.distance += absX * deltaTime;
    } else {
      this.distance = 0;
    }
  }

  changeDirection(direction: number) {
    this.direction += direction;
  }
}
