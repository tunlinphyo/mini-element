import { css, html, MiniElement } from "@mini-element"

export class TextDisplay extends MiniElement {
    static styles = css`
        :host {
            display: inline-block;
            color: green;
        }
        :host([color="red"]) {
            color: red;
        }
    `

    get text() {
        return this.textContent?.trim() || ''
    }

    set text(data: string) {
        this.textContent = data
        this.setColorAttr(data)
    }

    constructor() {
        super()
    }

    protected onConnect() {
        this.setColorAttr(this.text)
    }

    protected render() {
        return html`<slot></slot>`
    }

    private setColorAttr(text: string) {
        if (text == '0') {
            this.setAttribute('color', 'red')
        } else {
            this.removeAttribute('color')
        }
    }
}

customElements.define("text-display", TextDisplay)