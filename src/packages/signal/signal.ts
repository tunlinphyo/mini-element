import { internal } from './reactivity';

export interface Signal<T> {
    get(): T;
    subscribe(callback: (value: T) => void): () => void;
}

export class WritableSignal<T> implements Signal<T> {
    private value: T;
    private subscribers = new Set<(value: T) => void>();

    constructor(initial: T) {
        this.value = initial;
    }

    get(): T {
        if (internal.activeEffect) {
            this.subscribers.add(internal.activeEffect);
        }
        return this.value;
    }

    set(newValue: T) {
        if (this.value !== newValue) {
            this.value = newValue;
            this.subscribers.forEach(fn => fn(this.value));
        }
    }

    subscribe(callback: (value: T) => void): () => void {
        this.subscribers.add(callback);
        callback(this.value);
        return () => this.subscribers.delete(callback);
    }
}

export function signal<T>(initial: T): WritableSignal<T> {
    return new WritableSignal(initial);
}