import { Entity, Trait, type GameContext, type Side } from '@eriador/core';

const MAX_DURATION = 0.3;
const SPEED_BOOST = 0.3;
const HUNDRED_MS = 0.1;

export class Jump extends Trait {
  private readonly duration = MAX_DURATION;
  private readonly velocity = 200;

  private ready = 0;

  // coyote timer
  private requestTime = 0;
  private readonly gracePeriod = HUNDRED_MS;

  private engageTime = 0;

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  update(entity: Entity, { deltaTime }: GameContext) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
      }

      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.velocity.y = -(this.velocity + Math.abs(entity.velocity.x * SPEED_BOOST));
      this.engageTime -= deltaTime;
    }

    this.ready--;
  }

  obstruct(_entity: Entity, side: Side) {
    if (side === 'bottom') {
      this.ready = 1;
    } else if (side === 'top') {
      this.cancel();
    }
  }
}
