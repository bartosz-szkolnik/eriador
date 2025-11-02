// We use miliseconds because if we need higher precision, we can achieve it this way.
// If you want to work in seconds, just multiply deltaTime by a 1000.
const IN_MILISECONDS = 1000;

export class Timer {
  private frameId = 0;
  private isRunning = false;

  private updateProxy = (_time: number) => {};
  private updateFn = (_deltaTime: number) => {};

  constructor(deltaTime = 1 / 60) {
    let accumulatedTime = 0;
    let lastTime: number | null = null;

    this.updateProxy = (time: number) => {
      if (lastTime) {
        accumulatedTime += (time - lastTime) / IN_MILISECONDS;

        if (accumulatedTime > 1) {
          accumulatedTime = 1;
        }

        while (accumulatedTime > deltaTime) {
          this.updateFn(deltaTime);
          accumulatedTime -= deltaTime;
        }
      }

      lastTime = time;
      if (this.isRunning) {
        this.enqueue();
      }
    };
  }

  start() {
    this.isRunning = true;
    this.enqueue();
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.frameId);
  }

  setUpdateFn(fn: (deltaTime: number) => void) {
    this.updateFn = fn;
  }

  private enqueue() {
    this.frameId = requestAnimationFrame(this.updateProxy);
  }
}
