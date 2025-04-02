import { css } from "@mini-element"
import { CustomOption } from "./custom-option"


export class CustomSelect extends HTMLElement {
    protected renderRoot: ShadowRoot
    private inputEl: HTMLInputElement
    private buttonEl: HTMLElement
    private popoverEl: HTMLElement
    private layerEl: HTMLElement

    static get observedAttributes() {
        return ['value']
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'value') {
            console.log(oldValue, newValue)
            this.inputEl.value = newValue
            this.inputEl.dispatchEvent(new Event('input', { bubbles: true }))
        }
    }

    constructor() {
        super()
        this.renderRoot = this.attachShadow({ mode: 'open' })
        this._onClick = this._onClick.bind(this)
        this._popoverClick = this._popoverClick.bind(this)
        this._onPopoverChange = this._onPopoverChange.bind(this)

        const styleEl = this._createStyles()
        this.inputEl = this._createInput()
        this.buttonEl = this._createButton()
        this.popoverEl = this._createPopover()
        this.layerEl = this._createLayer()

        this.renderRoot.appendChild(styleEl)
        this.appendChild(this.inputEl)
        this.renderRoot.appendChild(this.buttonEl)
        this.renderRoot.appendChild(this.popoverEl)
    }

    connectedCallback() {
        this.addEventListener('click', this._onClick)
        this.popoverEl.addEventListener('click', this._popoverClick)
        this.layerEl.addEventListener('click', this._popoverClick)
        this.popoverEl.addEventListener('beforetoggle', this._onPopoverChange)

        this._positionPopover(this.popoverEl, this);

        // Optional: reposition on scroll/resize
        window.addEventListener('scroll', () => this._positionPopover(this.popoverEl, this), true);
        window.addEventListener('resize', () => this._positionPopover(this.popoverEl, this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick)
        this.popoverEl.removeEventListener('click', this._popoverClick)
        this.layerEl.removeEventListener('click', this._popoverClick)
        this.popoverEl.removeEventListener('beforetoggle', this._onPopoverChange)
    }

    private _onClick(e: Event) {
        e.stopPropagation()
        this.popoverEl.togglePopover()
        // requestAnimationFrame(this._syncWidth)
    }

    private _popoverClick(e: Event) {
        e.stopPropagation()
        this.popoverEl.hidePopover()
        const target = e.target as HTMLElement
        if (target.hasAttribute('value') && target instanceof CustomOption) {
            this.setAttribute('value', target.value)
            this.buttonEl.textContent = target.textContent
        }
    }

    private _onPopoverChange(e: Event) {
        const newState = (e as any).newState
        if (newState === 'open') {
            document.body.appendChild(this.layerEl)
        } else {
            document.body.removeChild(this.layerEl)
        }
    }

    private _createStyles() {
        return css`
            :host {
                display: inline-block;
                anchor-name: --custom-select;
            }
            .button {
                font-size: inherit;
                font-family: inherit;

                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            [popover] {
                --duration: .4s;
                border: 0;
                padding: 0;
                background-color: light-dark(#fff, #555);
                outline: none;

                flex-direction: column;
                min-width: 250px;

                margin: 6px 0;
                inset: auto;
                position: absolute;
                /* top: anchor(bottom);
                left: anchor(left);
                transform-origin: top center; */
                /* bottom: anchor(top);
                left: anchor(left); */
                position-anchor: --custom-select;
                position-area: bottom center;
                transform-origin: top center;

                transition: display var(--duration), scale var(--duration) cubic-bezier(0.34, 1.56, 0.64, 1), opacity var(--duration);
                transition-behavior: allow-discrete;

                opacity: 0;
                scale: .3;

                &[data-placement="top"] {
                    position-area: top center;
                    transform-origin: bottom center;
                }

                &:popover-open {
                    display: flex;

                    opacity: 1;
                    scale: 1;

                    @starting-style {
                        opacity: 0;
                        scale: .3;
                    }
                }
            }

            @position-try --try-top-pos {
                position-area: top center;
                transform-origin: bottom center;
            }
        `()
    }

    private _syncWidth = () => {
        const triggerRect = this.buttonEl.getBoundingClientRect();
        this.popoverEl.style.width = `${triggerRect.width}px`;
        this.popoverEl.togglePopover()
    };

    private _createInput() {
        const el = document.createElement('input')
        el.setAttribute('aria-hidden', 'true')
        el.setAttribute('type', 'hidden')
        el.setAttribute('name', this.getAttribute('name') || 'select')
        el.value = this.getAttribute('value') || ''
        return el
    }

    private _createButton() {
        const el = document.createElement('div')
        el.classList.add('button')
        // el.setAttribute('type', 'button')
        el.textContent = this.getAttribute('value') || 'Select'
        return el
    }

    private _createPopover() {
        const el = document.createElement('dialog')
        el.classList.add('popover')
        el.setAttribute('popover', 'minual')
        const slot = document.createElement('slot')
        el.appendChild(slot)
        return el
    }

    private _createLayer() {
        const el = document.createElement('div');
        Object.assign(el.style, {
            position: 'fixed',
            inset: '0',
            background: 'transparent',
            zIndex: '999',
            display: 'block',
            pointerEvents: 'auto'
        })

        return el
    }

    _positionPopover(popover: HTMLElement, anchor: HTMLElement) {
        const anchorRect = anchor.getBoundingClientRect()

        let flipped = anchorRect.y > (window.innerHeight * 0.5)
        popover.setAttribute('data-placement', flipped ? 'top' : 'bottom')
    }
}

customElements.define('custom-select', CustomSelect)