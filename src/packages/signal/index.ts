// signal.ts
export interface Signal<T> {
    get(): T;
    subscribe(callback: (value: T) => void): () => void;
}

export class WritableSignal<T> implements Signal<T> {
    private value: T;
    private listeners: Set<(value: T) => void> = new Set();

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get(): T {
        return this.value;
    }

    set(newValue: T): void {
        if (this.value !== newValue) {
            this.value = newValue;
            for (const listener of this.listeners) {
                listener(this.value);
            }
        }
    }

    subscribe(callback: (value: T) => void): () => void {
        this.listeners.add(callback);
        // Immediately call with current value (optional)
        callback(this.value);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }
}