export class LimitedArray<T = unknown> {
  private array: T[] = [];

  constructor(private readonly limit: number) {}

  get elements() {
    return [...this.array];
  }

  push(value: T) {
    this.array.push(value);
    if (this.array.length > this.limit) {
      this.array = this.array.slice(-this.limit);
    }
  }

  first() {
    return this.array[0];
  }

  last() {
    return this.array[this.array.length - 1];
  }

  all() {
    return [...this.array];
  }

  isFull() {
    return this.array.length >= this.limit;
  }

  includes(value: T) {
    return this.array.includes(value);
  }
}
