export class Rectangle {
  weight = 0;

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {}

  get top() {
    return this.y;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.w;
  }

  get bottom() {
    return this.y + this.h;
  }

  set top(v) {
    this.y = v;
  }

  set left(v) {
    this.x = v;
  }

  set right(v) {
    this.x = v - this.w;
  }

  set bottom(v) {
    this.y = v - this.h;
  }
}
