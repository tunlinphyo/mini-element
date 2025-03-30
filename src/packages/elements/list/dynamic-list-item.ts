import { MiniElement } from "../../mini-element"
import { deepEqual } from "../../utils"
import { updateBindings } from "../data-bind"
import { WithId } from "./types"

export abstract class DynamicListItem<T extends WithId> extends MiniElement {
    private _data: T
    
    get data() {
        return this._data
    }
    set data(value: T) {
        if (deepEqual(this._data, value)) return
        this._data = value
        this.setAttribute('role', 'listitem')
        this.setAttribute('aria-label', value.id)
        updateBindings(value, this.renderRoot)
    }

    constructor() {
        super()
        this._data = {} as T
    }

    protected onConnect(): void {
        this.setAttribute('role', 'listitem')
    }

    protected onClick(e: Event): void {
        const target = e.target as HTMLElement
        if (target.hasAttribute('data-button')) {
            this.dispatchEvent(new CustomEvent('item-click', {
                detail: {
                    id: this.data.id,
                    data: this.data,
                    dataset: target.dataset
                },
                bubbles: true,
                composed: true
            }))
        }
    }
}