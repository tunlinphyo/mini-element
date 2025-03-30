import { DynamicListItem } from "../../packages/elements"
import { css, html } from "../../packages/mini-element"

export type Item = {
    id: string
    name: string
    age: number
    email: string
}

export class UserCard extends DynamicListItem<Item> {
    static styles = css`
        :host {
            display: block;
            padding: 8px 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        h4 {
            margin: 0;
        }
        .actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
        button {
            height: 28px;
        }
    `

    constructor() {
        super()
    }

    render() {
        return html`
            <div class="draggable-wrapper">
                <h4>${this.data.name}</h4>
                Email: <span>${this.data.email}</span> |
                Age: <span>${this.data.age}</span>
                <div class="actions">
                    <button data-button="delete">Delete</button>
                    <button data-button="edit">Edit</button>
                </div>
            </div>
        `
    }
}
customElements.define("user-card", UserCard)