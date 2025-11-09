import { Keys } from '@eriador/common';
import { Timer } from '@eriador/core';
import { setupKeyboardForOnePlayer } from '../utils/input';
import { WE_WORK_IN_SECONDS } from '../main';
import { TetrisBuilder } from '../components/tetris-builder';

export function startSinglePlayerTetris() {
  const { renderer, tetris } = new TetrisBuilder(document).createTetrisGame();

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
