import { signal, Signal } from './signal';
import { internal } from './reactivity';

export function computed<T>(computeFn: () => T): Signal<T> {
    const result = signal<T>(undefined as unknown as T);

    const run = () => {
        internal.activeEffect = run;
        result.set(computeFn());
        internal.activeEffect = null;
    };

    run();

    return {
        get: () => result.get(),
        subscribe: (cb) => result.subscribe(cb),
    };
}