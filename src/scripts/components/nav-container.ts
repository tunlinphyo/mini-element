import { css, html, MiniElement } from "../mini-element"

export class NavContainer extends MiniElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
        }
        ::slotted(bottom-nav) {
            position: fixed;
            z-index: 5;
            left: 0;
            bottom: 0;
            background: light-dark(#fff, #222);
            width: 100%;
            height: 60px;
        }
        ::slotted(main-page) {
            position: fixed;
            inset: 0;
        }
    `

    constructor() {
        super()
    }

    protected render() {
        return html`
            <slot name="nav"></slot>
            <slot></slot>
        `
    }
}

customElements.define('nav-container', NavContainer)