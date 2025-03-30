import { MiniElement, PropertyChange, PropertyDefinition, html } from "../mini-element"
import { TextDisplay } from "./text-display"

export class NumberCounter extends MiniElement {
    declare num: number
    declare int: number

    static addTwo(value: string) {
        const num = parseFloat(value) || 0
        return num + 2
    }

    static properties = {
        num: { converter: Number },
        int: { converter: NumberCounter.addTwo }
    }

    constructor() {
        super()
    }

    protected render() {
        return html`<slot></slot>`
    }

    protected onPropertyChange(property: PropertyChange<PropertyDefinition>) {
        console.log(property)
        if (property.name == 'int') {
            console.log(property.newValue)
        }
    }

    protected onClick(dataset: DOMStringMap) {
        const elem = this.querySelector('text-display') as TextDisplay
        if (!elem) return
        let num = Number(elem.text || 0)
        if (dataset.button === 'increase') {
            num += Number(dataset.amount)
        } else if (dataset.button == 'decrease') {
            num -= Number(dataset.amount)
        }
        elem.text = String(Math.max(0, num))
    }
}


customElements.define("number-counter", NumberCounter)