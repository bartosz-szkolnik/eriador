import { MainMenu, type Font } from '@eriador/common';

export class TetrisMainMenu<TOption extends string> extends MainMenu<TOption> {
  draw(context: CanvasRenderingContext2D, font: Font) {
    const { width, height } = context.canvas;
    context.clearRect(0, 0, width, height);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const { offset, printTextInTheMiddle } = drawText(context, font);
    const { size } = font;

    printTextInTheMiddle('TETRIS', offset * size - 50);

    this.options.forEach((option, index) => {
      if (this.selectedIndex === index) {
        printTextInTheMiddle(`x ${option} x`, offset * size + index * 20);
      } else {
        printTextInTheMiddle(option, offset * size + index * 20);
      }
    });
  }
}

function drawText(context: CanvasRenderingContext2D, font: Font) {
  const size = font.size;

  const screenWidth = Math.floor(context.canvas.width / size);
  const screenHeight = Math.floor(context.canvas.height / size);
  const offset = screenHeight / 4;

  function printTextInTheMiddle(text: string, y: number) {
    const x = (screenWidth / 2 - text.length / 2) * size;
    font.print(text, context, x, y);
  }

  return { printTextInTheMiddle, offset };
}
