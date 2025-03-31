import { Store } from "./store"

export class AsyncStore<T> extends Store<T | null> {
    private loading = true;
    private error: any = null;

    constructor(promiseFn: () => Promise<T>) {
        super(null);
        promiseFn()
            .then((value) => {
                this.loading = false;
                this.value = value;
            })
            .catch((err) => {
                this.loading = false;
                this.error = err;
                console.error('AsyncStore error:', err);
            });
    }

    get isLoading() {
        return this.loading;
    }

    get errorState() {
        return this.error;
    }
}

export const storeAsync = <T>(promiseFn: () => Promise<T>) => new AsyncStore<T>(promiseFn);