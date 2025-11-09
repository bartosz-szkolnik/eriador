import type { Font } from './font';

export class MainMenu<TOption extends string> {
  protected selectedIndex = 0;

  constructor(protected readonly options: TOption[]) {}

  handleArrowDown() {
    this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
  }

  handleArrowUp() {
    this.selectedIndex = (this.selectedIndex + this.options.length - 1) % this.options.length;
  }

  handleEnter() {
    return this.options[this.selectedIndex];
  }

  draw(_context: CanvasRenderingContext2D, _font: Font) {
    console.warn('Unhandled draw function in the MainMenu class.');
  }
}
