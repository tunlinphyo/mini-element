

export class CustomOption extends HTMLElement {
    protected renderRoot: ShadowRoot

    public value: string

    static get observedAttributes() {
        return ['selected']
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'selected') {
            console.log(oldValue, newValue)
        }
    }

    constructor() {
        super()
        this.renderRoot = this.attachShadow({ mode: 'open' })
        this.value = this.getAttribute('value') || this.textContent || ''

        const slot = document.createElement('slot')
        this.renderRoot.appendChild(slot)
    }
}

customElements.define('custom-option', CustomOption)