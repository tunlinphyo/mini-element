import { internal } from './reactivity';

export function effect(fn: () => void): () => void {
    const wrapped = () => {
        internal.activeEffect = wrapped;
        fn();
        internal.activeEffect = null;
    };

    wrapped();

    return () => {
        // no cleanup needed for now — can be extended
    };
}