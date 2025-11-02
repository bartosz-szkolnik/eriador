import { Entity, InputRouter } from '@beholder/core';
import { KeyboardState } from '@beholder/common';
import { Jump } from './traits';

const KEY_MAP = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  A: 'Space',
  B: 'ShiftLeft',
};

const ALTERNATIVE_KEY_MAP = {
  UP: 'KeyW',
  DOWN: 'KeyS',
  LEFT: 'KeyA',
  RIGHT: 'KeyD',
  A: 'KeyP',
  B: 'KeyO',
};

export function setupKeyboard(window: Window) {
  const input = new KeyboardState();
  const router = new InputRouter<Entity>();

  input.listenTo(window);

  input.addMapping([KEY_MAP.A, ALTERNATIVE_KEY_MAP.A], keyState => {
    if (keyState) {
      router.route(entity => entity.get(Jump).start());
    } else {
      router.route(entity => entity.get(Jump).cancel());
    }
  });

  input.addMapping([KEY_MAP.B, ALTERNATIVE_KEY_MAP.B], keyState => {
    router.route(entity => entity.turbo(Boolean(keyState)));
  });

  input.addMapping([KEY_MAP.RIGHT, ALTERNATIVE_KEY_MAP.RIGHT], keyState => {
    router.route(entity => {
      // entity.get(Go).direction += keyState ? 1 : -1;
    });
  });

  input.addMapping([KEY_MAP.LEFT, ALTERNATIVE_KEY_MAP.LEFT], keyState => {
    router.route(entity => {
      // entity.get(Go).direction += keyState ? -1 : 1;
    });
  });

  return router;
}

export function setupGamepad(player: Entity) {
  return function checkGamepadInput() {
    const gamepad = navigator.getGamepads()[0];

    if (gamepad) {
      let movementAxis = gamepad.axes[0];
      const jumping = gamepad.buttons[0].pressed || gamepad.buttons[1].pressed;
      const running = gamepad.buttons[2].pressed || gamepad.buttons[3].pressed;

      // factor in deadzone
      if (Math.abs(movementAxis) < 0.5) {
        movementAxis = 0;
      }

      if (jumping) {
        player.get(Jump).start();
      } else {
        player.get(Jump).cancel();
      }

      // player.get(Go).direction = movementAxis;
      player.turbo(running);
    }
  };
}
