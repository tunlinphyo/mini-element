import { css, html, MiniElement } from "@mini-element"

export class MainPage extends MiniElement {
    declare page: string
    declare show: boolean

    static properties = {
        show: { converter: Boolean }
    }

    static styles = css`
        * { box-sizing: border-box; }
        :host {
            width: 100%;
            height: 100%;
            display: none;
        }
        :host([show]) {
            display: grid;
        }
        ::slotted(scroll-view) {
            padding: 20px;
            padding-block-end: 80px;
        }
    `

    constructor() {
        super()
    }

    protected render() {
        return html`<slot></slot>`
    }

    protected onClick(dataset: DOMStringMap) {
        console.log('MAIN-PAGE', dataset)
    }

    // protected onPropertyChange(property: PropertyChange<PropertyDefinition>) {
    //     if (property.name == 'show') {
    //         console.log(this.show, this.page)
    //     }
    // }
}

customElements.define('main-page', MainPage)