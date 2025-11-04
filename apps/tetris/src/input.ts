import { KeyboardState, Keys } from '@eriador/common';
import { InputRouter } from '@eriador/core';
import { MoveDirection, type Player } from './entities/player';

export function setupKeyboardForOnePlayer(window: Window) {
  const input = new KeyboardState({ allowKeyRepeating: true });
  const router = new InputRouter<Player>();

  const KEY_MAP = {
    DOWN: Keys.KEY_ARROW_DOWN,
    LEFT: Keys.KEY_ARROW_LEFT,
    RIGHT: Keys.KEY_ARROW_RIGHT,
    SPACE: Keys.KEY_SPACE,
    E: Keys.KEY_E,
    Q: Keys.KEY_Q,
    W: Keys.KEY_W,
    T: Keys.KEY_T,
  };

  input.listenTo(window);

  input.addMapping([KEY_MAP.DOWN], keyState => {
    router.route(player => (keyState ? player.drop() : null));
  });

  input.addMapping([KEY_MAP.RIGHT], keyState => {
    router.route(player => (keyState ? player.move(MoveDirection.RIGHT) : null));
  });

  input.addMapping([KEY_MAP.LEFT], keyState => {
    router.route(player => (keyState ? player.move(MoveDirection.LEFT) : null));
  });

  input.addMapping([KEY_MAP.Q], keyState => {
    router.route(player => (keyState ? player.rotateLeft() : null));
  });

  input.addMapping([KEY_MAP.W], keyState => {
    router.route(player => (keyState ? player.rotateRight() : null));
  });

  input.addMapping([KEY_MAP.SPACE], keyState => {
    router.route(player => (keyState ? player.dropToBottom() : null));
  });

  input.addMapping([KEY_MAP.T], keyState => {
    router.route(player => (keyState ? player.reset() : null));
  });

  return router;
}
