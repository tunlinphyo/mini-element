import { formContext } from "../../packages/elements"
import { ContextConsumer } from "../../packages/context"
import { counterSignal } from "../signal"
import { css, html, MiniElement } from "../../packages/mini-element"

export class FormDebug extends MiniElement {
    private consumer!: ContextConsumer<Record<string, any>>
    private unsubscribe: (() => void) | undefined

    static styles = css`
        :host {
            display: grid;
            background-color: light-dark(blue, darkblue);
            padding: 10px;
        }
        :host([counter="0"]) {
            background-color: light-dark(red, darkred);
        }
    `

    constructor() {
        super()
    }

    protected onConnect() {
        const counterEl = document.createElement('p')
        const preEl = document.createElement('pre')

        this.consumer = new ContextConsumer(this, formContext)
        this.consumer.subscribe((form) => {
            preEl.textContent = JSON.stringify(form, null, 2)
        })

        this.unsubscribe = counterSignal.subscribe(value => {
            this.setAttribute('counter', String(value))
            counterEl.textContent = String(value)
        })

        this.renderRoot.appendChild(counterEl)
        this.renderRoot.appendChild(preEl)
    }

    protected onDisconnect() {
        this.consumer.unsubscribe()
        this.unsubscribe?.()
    }

    protected render() {
        return html`
            <h4>Form Data</h4>
        `
    }
}

customElements.define('form-debug', FormDebug)