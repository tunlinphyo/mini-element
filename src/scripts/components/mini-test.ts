import { signal, State } from '@mini-element/signal';
import { css, html, MiniEl } from './mini-element'

const hostStyle = css`
    :host {
        display: block;
    }
    ::slotted(.flex) {
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
    }
`

// export class MiniTest extends MiniEl {
//     private num = 0;

//     static styles = [ hostStyle ];

//     constructor() {
//         super();
//         this._onClick = this._onClick.bind(this);
//     }

//     onConnect() {
//         this.renderRoot.addEventListener('click', this._onClick);
//     }

//     onDisconnect() {
//         this.renderRoot.removeEventListener('click', this._onClick);
//     }

//     staticHtmls() {
//         const container = html`
//             <h2>Counter</h2>
//             <button data-button="decrease">Decrease</button>
//             <template data-dynamic="count"></template>
//             <button data-button="increase">Increase</button>
//         `;

//         return [container];
//     }

//     protected dynamicHtmls(): Record<string, HTMLElement> {
//         const el = document.createElement('p');
//         el.textContent = `Number: ${this.num}`;
//         return {
//             count: el
//         };
//     }

//     private _onClick(e: Event) {
//         const target = e.target as HTMLElement;
//         if (target.getAttribute('data-button') === 'increase') {
//             this.num++;
//             this.update();
//             console.log(this.num)
//         } else
//         if (target.getAttribute('data-button') === 'decrease') {
//             this.num--;
//             this.update();
//         }
//     }
// }

type Status = 'minus' | 'zero' | 'plus'

export class MiniTest extends MiniEl<{
    num: number
    status: Status
}> {
    static styles = [ hostStyle ];
    static states = signal({
        count: 0,
        status: 'zero'
    })

    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    onConnect() {
        this.addEventListener('click', this._onClick);
    }

    onDisconnect() {
        this.removeEventListener('click', this._onClick);
    }

    protected render() {
        return html`<slot></slot>`
    }

    private _onClick(e: Event) {
        const target = e.target as HTMLElement;
        let value = 0
        if (target.getAttribute('data-button') === 'increase') {
            value = ++this.data.count
        }
        if (target.getAttribute('data-button') === 'decrease') {
            value = --this.data.count
        }
        this.data = {
            status: value === 0 ? 'zero' : (value > 0 ? 'plus' : 'minus'),
            count: value
        }
    }
}

customElements.define('mini-test', MiniTest);