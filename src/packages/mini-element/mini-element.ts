export type PropertyGuard = {
    converter: (value: string) => any; // used for runtime conversion
}

export type PropertyDefinition = Record<string, PropertyGuard>

export type PropertyChange<T extends PropertyDefinition> = {
    name: keyof T;
    oldValue: ReturnType<T[keyof T]['converter']>;
    newValue: ReturnType<T[keyof T]['converter']>;
}

export abstract class MiniElement extends HTMLElement {
    protected renderRoot: ShadowRoot

    static styles?: () => HTMLStyleElement
    static properties?: PropertyDefinition

    static get observedAttributes() {
        if (!this.properties) return []
        return Object.keys(this.properties).map(item => item)
    }

    get root() {
        return this.renderRoot
    }

    constructor() {
        super()
        this.renderRoot = this.attachShadow({ mode: 'open' })
        this._onClick = this._onClick.bind(this)
    }

    connectedCallback() {
        this.setStyle()
        this.update()
        if (this.onClick) this.renderRoot.addEventListener('click', this._onClick)
        if (this.onConnect) this.onConnect()
    }

    disconnectedCallback() {
        if (this.onClick) this.renderRoot.removeEventListener('click', this._onClick)
        if (this.onDisconnect) this.onDisconnect()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const properties = (this.constructor as typeof MiniElement).properties
        if (
            properties && properties[name]
            && oldValue !== newValue
            && this.onPropertyChange
        ) {
            const guard = properties[name]
            this.onPropertyChange({
                name,
                oldValue: guard.converter(oldValue ?? ''),
                newValue: guard.converter(newValue ?? '')
            })
        }
    }

    protected update() {
        Array.from(this.renderRoot.childNodes).forEach(node => {
          if (!(node instanceof HTMLStyleElement)) {
            this.renderRoot.removeChild(node);
          }
        })

        const template = this.render?.()
        if (template) this.renderRoot.appendChild(template)
    }

    protected render?(): Node

    protected onClick?(e: Event): void
    protected onPropertyChange?(property: PropertyChange<PropertyDefinition>): void
    protected onConnect?(): void
    protected onDisconnect?(): void

    private setStyle() {
        const isStyle = this.renderRoot.querySelector('style')
        if (isStyle) return
        const ctor = this.constructor as typeof MiniElement;
        const styles = ctor.styles;
        if (typeof styles === 'function') {
            const styleElement = styles();
            this.renderRoot.appendChild(styleElement);
        }
    }

    private _onClick(e: Event) {
        const elem = e.target as HTMLElement
        if (elem.hasAttribute('data-button') && this.onClick) {
            this.onClick(e)
        }
    }
}