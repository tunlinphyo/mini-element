import { MiniElement } from "../../mini-element"
import { deepEqual } from "../../utils"
import { DynamicListItem } from "./dynamic-list-item"
import { WithId } from "./types"

export class DynamicList<T extends WithId> extends MiniElement {
    private customElement?: DynamicListItem<T>
    private _list: T[] = []

    constructor() {
        super()
    }

    get list() {
        return this._list
    }
    set list(newList: T[]) {
        const oldMap = new Map(this._list.map(item => [item.id, item]))
        const newMap = new Map(newList.map(item => [item.id, item]))
        // Create or update
        for (const item of newList) {
            if (oldMap.has(item.id)) {
                this._updateItem(item)
            } else {
                this._createItem(item)
            }
        }
        // Remove
        for (const item of this._list) {
            if (!newMap.has(item.id)) {
                this._removeItem(item.id)
            }
        }
        // Reorder (move DOM elements in correct order)
        for (const item of newList) {
            const el = this.renderRoot.getElementById(item.id)
            if (el) {
                this.renderRoot.appendChild(el) // reorders without duplication
            }
        }
        this._list = [...newList]
    }

    onConnect(): void {
        this.setAttribute('role', 'list')
        this.setAttribute('aria-label', 'Dynamic List')
        this.setAttribute('aria-live', 'polite')
        this.setAttribute('aria-relevant', 'additions removals')
        this.setAttribute('aria-atomic', 'true')
        this.customElement = this.querySelector('*') as DynamicListItem<T>
        if  (!this.customElement) return
        for (const item of this.list) {
            this._createItem(item)
        }
    }

    private _createItem(data: T) {
        if (this.customElement) {
            const elem = this.customElement.cloneNode(true) as DynamicListItem<T>
            elem.id = data.id
            this._setItemData(elem, data)
            this.renderRoot.appendChild(elem)
        }
    }

    private _updateItem(data: T) {
        const elem = this.renderRoot.getElementById(data.id) as DynamicListItem<T>
        if (!elem) return
        this._setItemData(elem, data)
    }

    private _removeItem(id: string) {
        const elem = this.renderRoot.getElementById(id)
        elem?.remove()
    }

    private _setItemData(elem: DynamicListItem<T>, data: T) {
        if (deepEqual(elem.data, data)) return
        elem.data = data
    }
}

customElements.define('dynamic-list', DynamicList)