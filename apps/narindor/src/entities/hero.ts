import { Entity, rangeAmount } from '@eriador/core';
import { Jump, Go } from '../traits';
import { loadSpriteSheet } from '../loaders';
import { createAnimation } from '@eriador/common';

const IDLE_FRAMES = rangeAmount(0, 4).map((_, index) => `idle-${index}`);
const RUNNING_FRAMES = rangeAmount(0, 6).map((_, index) => `run-${index}`);

export async function createHero() {
  const sprite = await loadSpriteSheet('hero');

  const hero = new Entity();
  hero.size.set(16, 16);

  hero.addTrait(new Go());
  hero.addTrait(new Jump());

  const runAnimation = createAnimation(RUNNING_FRAMES, 10);
  const idleAnimation = createAnimation(IDLE_FRAMES, 10);

  function routeFrame(hero: Entity) {
    const distance = Math.floor(hero.get(Go).distance);

    if (hero.get(Go).isMoving) {
      return runAnimation(distance);
    }

    return idleAnimation(hero.lifetime * 25);
  }

  function drawHero(this: Entity, context: CanvasRenderingContext2D) {
    const isLeft = hero.get(Go).isHeadingLeft ? true : false;
    sprite.draw(routeFrame(this), context, 0, 0, isLeft);
  }

  hero.draw = drawHero;

  return hero;
}
