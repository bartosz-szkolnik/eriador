import { initializeCanvas, Keys } from '@eriador/common';
import { Timer } from '@eriador/core';
import { setupKeyboardForOnePlayer } from '../input';
import { Renderer } from '../components/renderer';
import { Tetris } from '../entities/tetris';
import { WE_WORK_IN_SECONDS } from '../main';

export function startSinglePlayerTetris() {
  const { context } = initializeCanvas({ elementId: 'tetris', width: 240, height: 400 });
  context.scale(20, 20);

  const renderer = new Renderer(context);
  const tetris = new Tetris(document.getElementById('score') as HTMLDivElement);

  const timer = new Timer();
  timer.setUpdateFn(deltaTime => {
    const dt = deltaTime * WE_WORK_IN_SECONDS;
    tetris.update(dt);
    tetris.render(renderer);
  });

  const inputRouter = setupKeyboardForOnePlayer(window);
  inputRouter.addReceiver(tetris.player);

  timer.start();

  window.addEventListener('keydown', e => {
    if (e.code === Keys.KEY_ESCAPE) {
      timer.stop();
      console.log('Timer stopped');
    }
  });
}
