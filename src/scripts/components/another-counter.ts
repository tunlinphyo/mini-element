// my-element.ts
import { effect, Effect } from "@mini-element/signal"
import { count2 } from "../signal"

export class AnotherCounter extends HTMLElement {
    private span: HTMLSpanElement
    private effect: Effect

    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })

        const style = document.createElement('style')
        style.innerHTML = `
            :host {
                display: block;
            }
            div {
                padding: 10px;
                display: flex;
                gap: 10px;
            }
            span {
                display: inline-block;
                min-width: 40px;
                text-align: center;
            }
            button {
                color: canvasText;
                font-size: inherit;
                height: 32px;
                padding-inline: 1rem;
                border: none;
                box-shadow:
                    0 1px 2px 0 light-dark(#0003, #0005),
                    inset 0 1px 2px 0 light-dark(#fffb, #fff5);

                background:
                    radial-gradient(101.06% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0) 73.85%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
                    radial-gradient(100% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 55.59%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
                    linear-gradient(0deg, rgba(94, 94, 94, 0.18), rgba(94, 94, 94, 0.18)), rgba(255, 255, 255, 0.06);
                background-blend-mode: color-dodge, normal, color-dodge, lighten;
                border-radius: 100px;
            }
        `

        const wrapper = document.createElement('div')
        const button = document.createElement('button')
        this.span = document.createElement('span')

        button.textContent = 'Increment'
        this.span.textContent = String(count2.get())

        wrapper.appendChild(this.span)
        wrapper.appendChild(button)
        shadow.appendChild(style)
        shadow.appendChild(wrapper)

        button.addEventListener('click', () => {
            count2.set(count2.get() + 1)
        })

        // Subscribe to signal updates
        this.effect = effect(() => {
            this.span.textContent = String(count2.get())
        }, [count2])
    }

    disconnectedCallback() {
        this.effect()
    }
}

customElements.define('another-counter', AnotherCounter)