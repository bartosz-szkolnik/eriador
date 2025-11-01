export class Vector2 {
  constructor(
    public x: number,
    public y: number,
  ) {}

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(that: Vector2) {
    this.x = that.x;
    this.y = that.y;
  }

  equals(that: Vector2) {
    return this.x === that.x && this.y === that.y;
  }

  distance(that: Vector2) {
    const dx = this.x - that.x;
    const dy = this.y - that.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  serialize() {
    return { x: this.x, y: this.y };
  }

  add(that: Vector2) {
    return new Vector2(this.x + that.x, this.y + that.y);
  }

  static isVector2(value: unknown): value is Vector2 {
    if (!value) {
      return false;
    }

    return typeof value === 'object' && Object.hasOwn(value, 'x') && Object.hasOwn(value, 'y');
  }

  static zero() {
    return new Vector2(0, 0);
  }

  static from(x: number, y: number) {
    return new Vector2(x, y);
  }
}
