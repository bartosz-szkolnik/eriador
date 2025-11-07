import { Entity, rangeAmount } from '@eriador/core';
import { Jump, Go } from '../traits';
import { loadSpriteSheet } from '../loaders';
import { createAnimation } from '@eriador/common';

const IDLE_FRAMES = rangeAmount(0, 4).map((_, index) => `idle-${index}`);
const JUMPING_FRAMES = rangeAmount(0, 3).map((_, index) => `jump-${index}`);
const RUNNING_FRAMES = rangeAmount(0, 6).map((_, index) => `run-${index}`);

export async function createHero() {
  const sprite = await loadSpriteSheet('hero');

  const hero = new Entity();
  hero.size.set(16, 16);

  hero.addTrait(new Go());
  hero.addTrait(new Jump());

  const idleAnimation = createAnimation(IDLE_FRAMES, 10);
  const jumpAnimation = createAnimation(JUMPING_FRAMES, 10);
  const runAnimation = createAnimation(RUNNING_FRAMES, 10);

  function routeFrame(hero: Entity) {
    const distance = Math.floor(hero.get(Go).distance);
    if (hero.get(Jump).falling) {
      return jumpAnimation(hero.lifetime * 25);
    }

    if (hero.get(Go).isMoving) {
      return runAnimation(distance);
    }

    return idleAnimation(hero.lifetime * 25);
  }

  function drawHero(this: Entity, context: CanvasRenderingContext2D) {
    const isLeft = this.get(Go).isHeadingLeft ? true : false;
    sprite.draw(routeFrame(this), context, 0, 0, isLeft);
  }

  // Todo: fix later
  // function turbo(this: Entity, turboOn: boolean) {
  //   this.get(Go).set
  // }

  hero.draw = drawHero;

  return hero;
}
