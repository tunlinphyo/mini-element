// store.ts
type Subscriber<T> = (value: T) => void;

export class Store<T> {
  private _value: T;
  private subscribers = new Set<Subscriber<T>>();

  constructor(initialValue: T | (() => T)) {
    this._value = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  subscribe(callback: Subscriber<T>) {
    this.subscribers.add(callback);
    callback(this._value); // Initial call
    return () => this.subscribers.delete(callback);
  }

  private notify() {
    for (const cb of this.subscribers) {
      cb(this._value);
    }
  }
}

export const store = <T>(initial: T | (() => T)) => new Store<T>(initial);