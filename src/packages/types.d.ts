declare module '@mini-element' {
    export type PropertyGuard = {
        converter: (value: string) => any;
    };

    export type PropertyDefinition = Record<string, PropertyGuard>;

    export type PropertyChange<T extends PropertyDefinition> = {
        name: keyof T;
        oldValue: ReturnType<T[keyof T]['converter']>;
        newValue: ReturnType<T[keyof T]['converter']>;
    };

    export abstract class MiniElement extends HTMLElement {
        protected renderRoot: ShadowRoot;

        static styles?: () => HTMLStyleElement;
        static properties?: PropertyDefinition;

        static get observedAttributes(): string[];

        get root(): ShadowRoot;

        constructor();

        connectedCallback(): void;
        disconnectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;

        protected update(): void;
        protected render?(): Node;
        protected onClick?(dataset: DOMStringMap): void;
        protected onPropertyChange?(property: PropertyChange<PropertyDefinition>): void;
        protected onConnect?(): void;
        protected onDisconnect?(): void;
    }

    export function html(strings: TemplateStringsArray, ...values: any[]): Node;
    export function css(strings: TemplateStringsArray, ...values: any[]): () => HTMLStyleElement;
}

declare module '@mini-element/utils' {
    export function deepEqual(a: any, b: any): boolean;
    export function serialize(value: any): string;
}

declare module '@mini-element/context' {
    export type Context<T> = symbol & { __contextType?: T };
    export type ContextCallback<T> = (value: T, oldValue: T) => void;

    export function createContext<T>(name: string): Context<T>;

    export class ContextProvider<T> {
        constructor(
            host: HTMLElement,
            context: Context<T>,
            options?: { initial?: T }
        );
        get value(): T;
        setValue(val: T): void;
        subscribe(host: HTMLElement, callback: ContextCallback<T>): () => void;
        unsubscribe(host: HTMLElement): void;
    }

    export class ContextConsumer<T> {
        constructor(host: HTMLElement, context: Context<T>);
        subscribe(callback: ContextCallback<T>): () => void;
        unsubscribe(): void;
    }
}

declare module '@mini-element/signal' {
    export interface Signal<T> {
        get(): T;
        subscribe(callback: (value: T) => void): () => void;
    }

    export function signal<T>(initialValue: T): Signal<T> & {
        set(value: T): void;
    };

    export function computed<T>(computeFn: () => T): Signal<T>;
    export function effect(run: () => void): void;
}

declare module '@mini-element/elements' {
    import { MiniElement } from '@mini-element';
    import { ContextProvider, createContext } from '@mini-element/context';

    // Used by DynamicList and DynamicListItem
    export interface WithId {
        id: string;
    }

    export class DynamicListItem<T extends WithId> extends MiniElement {
        constructor();

        get data(): T;
        set data(value: T);

        connectedCallback(): void;
        disconnectedCallback(): void;
    }

    export class DynamicList<T extends WithId> extends MiniElement {
        constructor();

        get list(): T[];
        set list(newList: T[]);

        connectedCallback(): void;
        disconnectedCallback(): void;
    }

    // Form-related types
    export type TypedValue = string | number | boolean | null | string[];

    export interface FormDataType {
        [key: string]: TypedValue;
    }

    export const formContext: ReturnType<typeof createContext<FormDataType>>;

    export function updateBindings(
        root: HTMLElement | ShadowRoot,
        newData: Record<string, any>,
        oldData?: Record<string, any>
    ): void;

    export class ReactiveForm extends HTMLElement {
        constructor();

        get dirty(): boolean;

        get data(): FormDataType;
        set data(formData: FormDataType);

        setFormData(formData: FormDataType): void;
        getFormData(): FormDataType;

        submit(): void;
        reset(): void;
        clear(): void;

        connectedCallback(): void;
        disconnectedCallback(): void;
    }
}

declare module '@mini-element/elements/directives' {
    export const reactiveContext: Context<Record<string, unknown>>

    export class SortableDirective {
        constructor(private host: HTMLElement);
        destroy(): void;
    }
    export class ReactiveDirective {
        constructor(private host: HTMLElement);
        destroy(): void;
    }
}