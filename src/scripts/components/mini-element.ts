import { updateBindings } from "@mini-element/elements";
import { Effect, effect, State } from "@mini-element/signal";

export function serialize(value: any): string {
    if (value == null) return '';

    if (typeof value === 'object') {
        // Avoid direct [object Object] output
        return serialize(JSON.stringify(value));
    }

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export class RawHTML {
    constructor(public readonly value: string) {}
}

export function raw(value: string): RawHTML {
    return new RawHTML(value)
}

export function html(strings: TemplateStringsArray, ...values: any[]) {
    const htmlString = strings.reduce((acc, str, i) => {
        const val = values[i];
        if (val instanceof RawHTML) {
            return acc + str + val.value;
        } else {
            return acc + str + serialize(val);
        }
    }, '')

    return htmlString
}

export function css(strings: TemplateStringsArray, ...values: any[]): CSSStyleSheet {
    const cssString = strings.reduce((acc, str, i) => {
        const val = values[i];
        const serialized = val == null ? '' : String(val);
        return acc + str + serialized;
    }, '');

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssString);

    return sheet;
}

export type PropertyGuard = {
    converter: (value: string) => any; // used for runtime conversion
}

export type PropertyDefinition = Record<string, PropertyGuard>

export type PropertyChange<T extends PropertyDefinition> = {
    name: keyof T;
    oldValue: ReturnType<T[keyof T]['converter']>;
    newValue: ReturnType<T[keyof T]['converter']>;
}

// export abstract class MiniEl extends HTMLElement {
//     protected renderRoot: ShadowRoot;
//     static styles?: CSSStyleSheet[];

//     static properties?: PropertyDefinition

//     static get observedAttributes() {
//         if (!this.properties) return []
//         return Object.keys(this.properties).map(item => item)
//     }

//     constructor() {
//         super();
//         this.renderRoot = this.attachShadow({ mode: 'open' });

//         const ctor = this.constructor as typeof MiniEl;
//         if (ctor.styles?.length) {
//             this.renderRoot.adoptedStyleSheets = ctor.styles;
//         }
//     }

//     connectedCallback(): void {
//         this.initialRender();
//         this.onConnect?.();
//     }

//     disconnectedCallback(): void {
//         this.onDisconnect?.();
//     }

//     attributeChangedCallback(name: string, oldValue: string, newValue: string) {
//         const properties = (this.constructor as typeof MiniEl).properties
//         if (
//             properties && properties[name]
//             && oldValue !== newValue
//             && this.onPropertyChange
//         ) {
//             const guard = properties[name]
//             this.onPropertyChange({
//                 name,
//                 oldValue: guard.converter(oldValue ?? ''),
//                 newValue: guard.converter(newValue ?? '')
//             })
//         }
//     }

//     private initialRender() {
//         this.renderRoot.innerHTML = '';
//         const layout = this.staticHtmls();
//         this.renderRoot.append(...layout);
//         this.update(); // render initial dynamic parts
//         this.onAfterRender?.();
//     }

//     protected update(): void {
//         const dynamicMap = this.dynamicHtmls();

//         Object.entries(dynamicMap).forEach(([key, node]) => {
//             const marker = this.renderRoot.querySelector(`template[data-dynamic="${key}"]`);
//             if (marker && marker.parentNode) {
//                 const clone = node.cloneNode(true);
//                 marker.replaceWith(clone);
//             }
//         });
//     }

//     protected abstract staticHtmls(): Node[];
//     protected abstract dynamicHtmls(): Record<string, HTMLElement>;

//     protected onPropertyChange?(property: PropertyChange<PropertyDefinition>): void
//     protected onConnect?(): void;
//     protected onDisconnect?(): void;
//     protected onAfterRender?(): void;
// }

export abstract class MiniEl<TData> extends HTMLElement {
    private effectDistory?: Effect
    private _data: State<TData>;

    protected renderRoot: ShadowRoot;
    static styles?: CSSStyleSheet[];
    static states?: State<any>;

    get data() {
        return this._data.get()
    }
    set data(value: State<TData>) {
        this._data.set(value)
    }

    constructor() {
        super();
        this.renderRoot = this.attachShadow({ mode: 'open' });

        const ctor = this.constructor as typeof MiniEl;
        if (ctor.styles?.length) {
            this.renderRoot.adoptedStyleSheets = ctor.styles;
        }
        if (ctor.states) {
            this._data = ctor.states
            this.effectDistory = effect(() => {
                this.update(this._data)
            }, [this._data])
        }
    }

    connectedCallback(): void {
        this.initialRender();
        this.onConnect?.();
    }

    disconnectedCallback(): void {
        this.onDisconnect?.();
        this.effectDistory?.();
    }

    private initialRender() {
        const htmlString = this.render()
        this.renderRoot.innerHTML = htmlString
        this.onAfterRender?.()
    }

    private update(states: State<TData>): void {
        this.beforeUpdate?.();
        updateBindings(this as MiniElInstance<TData>, states.get(), {})
        this.afterUpdate?.();
    }

    protected abstract render(): string

    protected beforeUpdate?(): void;
    protected afterUpdate?(): void;
    protected onConnect?(): void;
    protected onDisconnect?(): void;
    protected onAfterRender?(): void;
}

export type MiniElInstance<T> = MiniEl<T> & HTMLElement;