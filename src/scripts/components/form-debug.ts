// import { formContext } from "../../packages/elements"
import { formContext, updateBindings } from "@mini-element/elements"
import { ContextConsumer } from "@mini-element/context"
import { counterSignal, count2 } from "../signal"
import { css, html, MiniElement } from "@mini-element"
import { computed, effect, Effect } from "@mini-element/signal"

export class FormDebug extends MiniElement {
    private consumer!: ContextConsumer<Record<string, any>>
    private effect!: Effect

    static styles = css`
        :host {
            display: grid;
            padding: 1rem;
            background: rgba(128, 128, 128, 0.3);
            background-blend-mode: luminosity;
            backdrop-filter: blur(50px);
            border-radius: 24px;

            h4 {
                margin: 0;
            }
        }
    `

    constructor() {
        super()
    }

    protected onConnect() {
        const counterEl = document.createElement('p')

        this.consumer = new ContextConsumer(this, formContext)
        this.consumer.subscribe((form, oldForm) => {
            updateBindings(this, form, oldForm)
        })

        const double = computed(() => counterSignal.get() * 2)

        this.effect = effect(() => {
            counterEl.textContent = String(double.get()) + ' : ' + String(count2.get())
        }, [double, count2])

        this.renderRoot.appendChild(counterEl)
    }

    protected onDisconnect() {
        this.consumer.unsubscribe()
        this.effect()
    }

    protected render() {
        return html`
            <h4>Form Data</h4>
            <slot></slot>
        `
    }
}

customElements.define('form-debug', FormDebug)