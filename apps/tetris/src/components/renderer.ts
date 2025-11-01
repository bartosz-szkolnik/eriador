import type { Matrix, Vector2 } from '@beholder/core';
import { EMPTY } from './pieces';

export class Renderer {
  constructor(private context: CanvasRenderingContext2D) {}

  renderMatrix(matrix: Matrix<string>, offset: Vector2) {
    const { context } = this;

    matrix.forEach((value, x, y) => {
      if (value === EMPTY) {
        return;
      }

      context.fillStyle = value;
      context.fillRect(x + offset.x, y + offset.y, 1, 1);

      context.strokeStyle = 'black';
      context.lineJoin = 'round';
      context.lineWidth = 0.1;

      const insideOffset = 0.1;
      context.strokeRect(
        x + offset.x + insideOffset,
        y + offset.y + insideOffset,
        1 - insideOffset * 2,
        1 - insideOffset * 2,
      );
    });
  }

  renderOutlineOfMatrix(matrix: Matrix<string>, offset: Vector2) {
    const { context } = this;

    matrix.forEach((value, x, y) => {
      if (value === EMPTY) {
        return;
      }

      context.strokeStyle = value;
      context.shadowColor = value;
      context.shadowBlur = 1.2;

      context.lineJoin = 'round';
      context.lineWidth = 0.1;
      context.strokeRect(offset.x + x, offset.y + y, 1, 1);

      context.shadowColor = '';
      context.shadowBlur = 0;
    });
  }

  renderBackground() {
    const { context } = this;
    const canvas = context.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
}
