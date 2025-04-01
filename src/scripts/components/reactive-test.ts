import { html, MiniElement } from "@mini-element";
import { ReactiveDirective } from "@mini-element/elements/directives";

export class ReactiveTest extends MiniElement {
    private reactive?: ReactiveDirective

    constructor() {
        super()
        this.reactive = new ReactiveDirective(this, (value) => {
            console.log(value)
        })
    }

    protected onDisconnect(): void {
        this.reactive = undefined
    }

    protected render() {
        return html`<slot></slot>`
    }
}

customElements.define('reactive-test', ReactiveTest)