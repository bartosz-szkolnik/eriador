import './style.css';
import { Timer, type GameContext } from '@eriador/core';
import { Camera, initializeCanvas, Keys } from '@eriador/common';
import { createHero } from './entities';
import { setupKeyboard } from './input';
import { loadRoom } from './loaders';

declare module '@eriador/core' {
  export interface GameContext {
    // Add more stuff later
  }
}

// Todo: Figure out how wide the canvas should be
const { context } = initializeCanvas({ elementId: 'screen', width: 256 + 16, height: 240 });

Promise.all([createHero(), loadRoom('debug-simple')]).then(([hero, room]) => {
  const camera = new Camera();
  hero.position.set(64, 64);
  room.addEntity(hero);

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(hero);

  const timer = new Timer();
  timer.setUpdateFn(deltaTime => {
    const gameContext = { deltaTime } satisfies GameContext;

    if (hero.position.x > 100) {
      camera.position.x = hero.position.x - 100;
    }

    room.update(gameContext);
    room.draw(context, camera);
  });

  timer.start();

  window.addEventListener('keydown', e => {
    if (e.code === Keys.KEY_ESCAPE) {
      timer.stop();
      console.log('Timer stopped');
    }
  });
});
