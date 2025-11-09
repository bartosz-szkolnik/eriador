import { Timer } from '@eriador/core';
import { WE_WORK_IN_SECONDS } from '../main';
import { setupKeyboardForTwoPlayers } from '../utils/input';
import { Keys } from '@eriador/common';
import { TetrisBuilder } from '../components/tetris-builder';

export function startTwoPlayersTetris() {
  const builder = new TetrisBuilder(document);

  const tetrisPair = [builder.createTetrisGame(), builder.createTetrisGame()] as const;

  const timer = new Timer();
  timer.setUpdateFn(deltaTime => {
    const dt = deltaTime * WE_WORK_IN_SECONDS;

    tetrisPair.forEach(({ renderer, tetris }) => {
      tetris.update(dt);
      tetris.render(renderer);
    });
  });

  const inputRouter = setupKeyboardForTwoPlayers(window);

  const [first, second] = tetrisPair.map(pair => pair.tetris.player);
  inputRouter.addReceiver({ first, second });

  timer.start();

  window.addEventListener('keydown', e => {
    if (e.code === Keys.KEY_ESCAPE) {
      timer.stop();
      console.log('Timer stopped');
    }
  });
}
