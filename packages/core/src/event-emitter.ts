export type EventName = symbol | string;
export type Callback = (...args: any[]) => void;
export type EmitterListener<T> = { name: T; callback: Callback };

export class EventEmitter<T = EventName> {
  private readonly listeners: EmitterListener<T>[] = [];

  listen(name: T, callback: Callback) {
    const listener = { name, callback };
    this.listeners.push(listener);
  }

  on(name: T, callback: Callback) {
    this.listen(name, callback);
  }

  emit(name: T, ...args: any[]) {
    this.listeners.forEach(listener => {
      if (listener.name === name) {
        listener.callback(...args);
      }
    });
  }
}
