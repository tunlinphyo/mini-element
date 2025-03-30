import { css, html, MiniElement } from "../mini-element"

export class ScrollView extends MiniElement {
    declare direction: 'x' | 'y'

    static properties = {
        direction: { converter: String },
    }

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }
        :host([direction="x"]) {
            overflow-x: auto;
        }
        :host([direction="y"]) {
            overflow-y: auto;
        }
    `

    constructor() {
        super()
    }

    protected render() {
        return html`<slot></slot>`
    }
}

customElements.define('scroll-view', ScrollView)