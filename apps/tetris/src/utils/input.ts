import { KeyboardState, Keys } from '@eriador/common';
import { InputRouter } from '@eriador/core';
import { MoveDirection, type Player } from '../entities/player';
import { DROP_TIME } from '../main';

export function setupKeyboardForOnePlayer(window: Window) {
  const input = new KeyboardState({ allowKeyRepeating: true });
  const router = new InputRouter<Player>();

  const KEY_MAP = {
    MOVE_DOWN: Keys.KEY_ARROW_DOWN,
    MOVE_LEFT: Keys.KEY_ARROW_LEFT,
    MOVE_RIGHT: Keys.KEY_ARROW_RIGHT,
    ROTATE_RIGHT: Keys.KEY_E,
    ROTATE_LEFT: Keys.KEY_Q,
    DROP_TO_BOTTOM: Keys.KEY_SPACE,
    RESET: Keys.KEY_T,
  };

  input.listenTo(window);

  input.addMapping([KEY_MAP.MOVE_DOWN], keyState => {
    router.route(player => (keyState ? player.drop() : null));
  });

  input.addMapping([KEY_MAP.MOVE_RIGHT], keyState => {
    router.route(player => (keyState ? player.move(MoveDirection.RIGHT) : null));
  });

  input.addMapping([KEY_MAP.MOVE_LEFT], keyState => {
    router.route(player => (keyState ? player.move(MoveDirection.LEFT) : null));
  });

  input.addMapping([KEY_MAP.ROTATE_LEFT], keyState => {
    router.route(player => (keyState ? player.rotateLeft() : null));
  });

  input.addMapping([KEY_MAP.ROTATE_RIGHT], keyState => {
    router.route(player => (keyState ? player.rotateRight() : null));
  });

  input.addMapping([KEY_MAP.DROP_TO_BOTTOM], keyState => {
    router.route(player => (keyState ? player.dropToBottom() : null));
  });

  input.addMapping([KEY_MAP.RESET], keyState => {
    router.route(player => (keyState ? player.reset() : null));
  });

  return router;
}

export function setupKeyboardForTwoPlayers(window: Window) {
  const input = new KeyboardState({ allowKeyRepeating: true });
  const router = new InputRouter<{ first: Player; second: Player }>();

  const KEY_MAP = {
    MOVE_DOWN: Keys.KEY_ARROW_DOWN,
    MOVE_LEFT: Keys.KEY_ARROW_LEFT,
    MOVE_RIGHT: Keys.KEY_ARROW_RIGHT,
    ROTATE_RIGHT: Keys.KEY_P,
    ROTATE_LEFT: Keys.KEY_O,
    DROP_TO_BOTTOM: Keys.KEY_ENTER,
    RESET: Keys.KEY_N,
  };

  const SECOND_PLAYER_KEY_MAP = {
    MOVE_DOWN: Keys.KEY_S,
    MOVE_LEFT: Keys.KEY_A,
    MOVE_RIGHT: Keys.KEY_D,
    ROTATE_RIGHT: Keys.KEY_E,
    ROTATE_LEFT: Keys.KEY_Q,
    DROP_TO_BOTTOM: Keys.KEY_SPACE,
    RESET: Keys.KEY_T,
  };

  const DROP_FAST = 50;
  const DROP_NORMAL = DROP_TIME;

  input.listenTo(window);

  input.addMapping([KEY_MAP.MOVE_DOWN], keyState => {
    router.route(({ first }) => {
      if (keyState) {
        if (first['dropInterval'] !== DROP_FAST) {
          first.drop();
          first.setDropInterval(DROP_FAST);
        }
      } else {
        first.setDropInterval(DROP_NORMAL);
      }
    });
  });

  input.addMapping([KEY_MAP.MOVE_RIGHT], keyState => {
    router.route(({ first }) => (keyState ? first.move(MoveDirection.RIGHT) : null));
  });

  input.addMapping([KEY_MAP.MOVE_LEFT], keyState => {
    router.route(({ first }) => (keyState ? first.move(MoveDirection.LEFT) : null));
  });

  input.addMapping([KEY_MAP.ROTATE_LEFT], keyState => {
    router.route(({ first }) => (keyState ? first.rotateLeft() : null));
  });

  input.addMapping([KEY_MAP.ROTATE_RIGHT], keyState => {
    router.route(({ first }) => (keyState ? first.rotateRight() : null));
  });

  input.addMapping([KEY_MAP.DROP_TO_BOTTOM], keyState => {
    router.route(({ first }) => (keyState ? first.dropToBottom() : null));
  });

  input.addMapping([KEY_MAP.RESET], keyState => {
    router.route(({ first }) => (keyState ? first.reset() : null));
  });

  input.addMapping([SECOND_PLAYER_KEY_MAP.MOVE_DOWN], keyState => {
    router.route(({ second }) => {
      if (keyState) {
        if (second['dropInterval'] !== DROP_FAST) {
          second.drop();
          second.setDropInterval(DROP_FAST);
        }
      } else {
        second.setDropInterval(DROP_NORMAL);
      }
    });
  });

  input.addMapping([SECOND_PLAYER_KEY_MAP.MOVE_RIGHT], keyState => {
    router.route(({ second }) => (keyState ? second.move(MoveDirection.RIGHT) : null));
  });

  input.addMapping([SECOND_PLAYER_KEY_MAP.MOVE_LEFT], keyState => {
    router.route(({ second }) => (keyState ? second.move(MoveDirection.LEFT) : null));
  });

  input.addMapping([SECOND_PLAYER_KEY_MAP.ROTATE_LEFT], keyState => {
    router.route(({ second }) => (keyState ? second.rotateLeft() : null));
  });

  input.addMapping([SECOND_PLAYER_KEY_MAP.ROTATE_RIGHT], keyState => {
    router.route(({ second }) => (keyState ? second.rotateRight() : null));
  });

  input.addMapping([SECOND_PLAYER_KEY_MAP.DROP_TO_BOTTOM], keyState => {
    router.route(({ second }) => (keyState ? second.dropToBottom() : null));
  });

  input.addMapping([SECOND_PLAYER_KEY_MAP.RESET], keyState => {
    router.route(({ second }) => (keyState ? second.reset() : null));
  });

  return router;
}
