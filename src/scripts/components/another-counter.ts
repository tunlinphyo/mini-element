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