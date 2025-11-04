// Based on https://github.com/pomle/aabb-collision

import { Vector2 } from '@eriador/core';
import { initializeCanvas } from '@eriador/common';
import { Rectangle } from './rectangle';
import './style.css';

function random(max: number) {
  return Math.random() * max;
}

const { canvas, context } = initializeCanvas({ elementId: 'canvas' });
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;

const desired = new Vector2(0, 0);

const followers = new Array(1).fill(null).map(() => {
  const s = 5 + random(32);
  const rectangle = new Rectangle(random(canvas.width), random(canvas.height), s, s);
  rectangle.weight = rectangle.w * rectangle.h;
  return rectangle;
});

const obstacles = new Array(30)
  .fill(null)
  .map(() => new Rectangle(random(canvas.width), random(canvas.height), 32 + random(32), 32 + random(32)));

function overlap(subject: Rectangle, rectangle: Rectangle) {
  // prettier-ignore
  return subject.bottom > rectangle.top 
    && subject.top < rectangle.bottom 
    && subject.right > rectangle.left 
    && subject.left < rectangle.right;
}

/* Iterate over all obstables that overlap subject. */
function intersection(subject: Rectangle, fn: (obstacle: Rectangle) => void) {
  obstacles.filter(obstacle => overlap(subject, obstacle)).forEach(fn);
}

function move(subject: Rectangle, x: number, y: number) {
  subject.x += x;

  if (x > 0) {
    intersection(subject, rectangle => {
      if (subject.right > rectangle.left) {
        subject.right = rectangle.left;
      }
    });
  } else if (x < 0) {
    intersection(subject, rectangle => {
      if (subject.left < rectangle.right) {
        subject.left = rectangle.right;
      }
    });
  }

  subject.y += y;
  if (y > 0) {
    intersection(subject, rectangle => {
      if (subject.bottom > rectangle.top) {
        subject.bottom = rectangle.top;
      }
    });
  } else if (y < 0) {
    intersection(subject, rectangle => {
      if (subject.top < rectangle.bottom) {
        subject.top = rectangle.bottom;
      }
    });
  }
}

function drawRectangle(rectangle: Rectangle, color = '#fff') {
  context.fillStyle = color;
  context.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  followers.forEach(subject => {
    drawRectangle(subject, 'green');
  });

  obstacles.forEach(rectangle => {
    drawRectangle(rectangle);
  });
}

function update() {
  followers.forEach(subject => {
    const moveTo = new Vector2(desired.x - subject.x, desired.y - subject.y);
    if (moveTo.length > 5) {
      moveTo.length /= subject.weight * 0.2;
      move(subject, moveTo.x, moveTo.y);
    }
  });

  draw();
  requestAnimationFrame(update);
}

canvas.addEventListener('mousemove', ({ offsetX, offsetY }) => {
  desired.x = offsetX;
  desired.y = offsetY;
});

update();
