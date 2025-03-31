// import { formContext } from "../../packages/elements"
import { formContext, updateBindings } from "@mini-element/elements"
import { ContextConsumer } from "@mini-element/context"
import { counterSignal, count2 } from "../signal"
import { css, html, MiniElement } from "@mini-element"
import { computed, effect } from "@mini-element/signal"

export class FormDebug extends MiniElement {
    private consumer!: ContextConsumer<Record<string, any>>
    // private unsubscribe: (() => void) | undefined
    private effectClear: any

    static styles = css`
        :host {
            display: grid;
            background-color: light-dark(lightgray, #333);
            padding: 10px;
        }
    `

    constructor() {
        super()
    }

    protected onConnect() {
        const counterEl = document.createElement('p')
        // const preEl = document.createElement('pre')

        this.consumer = new ContextConsumer(this, formContext)
        this.consumer.subscribe((form, oldForm) => {
            // preEl.textContent = JSON.stringify(form, null, 2)
            updateBindings(this, form, oldForm)
        })

        const double = computed(() => counterSignal.get() * 2)

        this.effectClear = effect(() => {
            counterEl.textContent = String(double.get()) + ' : ' + String(count2.get())
        })

        // this.unsubscribe = double.subscribe(value => {
        //     counterEl.textContent = String(value)
        // })

        this.renderRoot.appendChild(counterEl)
        // this.renderRoot.appendChild(preEl)
    }

    protected onDisconnect() {
        this.consumer.unsubscribe()
        // this.unsubscribe?.()
        this.effectClear()
    }

    protected render() {
        return html`
            <h4>Form Data</h4>
            <slot></slot>
        `
    }
}

customElements.define('form-debug', FormDebug)