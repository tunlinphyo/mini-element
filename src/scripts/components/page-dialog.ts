import { MiniElement, css, html } from '../mini-element'
import { ScrollView } from './scroll-view'

export class PageDialog extends MiniElement {
    declare heading: string
    declare open: boolean

    private dialog!: HTMLDialogElement
    private scrollView?: ScrollView
    private startX: number = Infinity
    private currentX: number = 0
    private isDragging: boolean = false
    // private scrollY: number = 0

    static properties = {
        heading: { converter: String },
        open: { converter: Boolean },
    }

    static styles = css`
        * {
            box-sizing: border-box;
        }
        dialog {
            width: 100%;
            max-width: 100%;
            height: 100%;
            max-height: 100%;
            position: fixed;
            inset: 0;
            padding: 0;

            border: none;
            outline: none;

            &::backdrop {
                opacity: 0;
                transition: opacity .4s linear;
            }
            &[open] {
                &::backdrop {
                    opacity: 1;
                }
            }
            @starting-style {
                &[open]::backdrop {
                    opacity: 0;
                }
            }
            &.closing {
                &::backdrop {
                    opacity: 0;
                }
            }
        }
        header {
            position: absolute;
            top: 0;
            z-index: 5;
            width: 100%;
            height: 60px;
            background: light-dark(#fff, #222);
            transform: translateZ(0);

            display: grid;
            grid-template-columns: 80px 1fr 80px;
            align-items: center;
            padding-inline: 20px;

            & h2 {
                margin: 0;
                padding: 0;
                text-align: center;
            }

            & button {
                padding: 0;
            }
        }
        scroll-view {
            padding: 20px;
            padding-block-start: 80px;
        }
    `

    constructor() {
        super()
        this.open = false

        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
    }

    protected onConnect() {
        if (!this.heading) this.heading = 'Page'
        this.dialog = this.renderRoot.querySelector('dialog') as HTMLDialogElement
        this.scrollView = this.renderRoot.querySelector('scroll-view') as ScrollView
    }

    // protected updated(changedProps: Map<string, unknown>) {
    //     if (changedProps.has('open')) {
    //         if (this.open) {
    //             this.dialog.showModal()
    //         } else if (this.dialog.open) {
    //             this.dialog.close()
    //         }
    //     }
    // }

    protected render() {
        return html`
            <dialog
                @touchstart=${this.onTouchStart}
                @touchmove=${this.onTouchMove}
                @touchend=${this.onTouchEnd}>
                <header>
                    <button @click=${this.closePage}>Cancel</button>
                    <h2>${this.heading}</h2>
                    <slot name="action"></slot>
                </header>
                <scroll-view direction="y">
                    <slot></slot>
                </scroll-view>
            </dialog>
        `
    }

    public openPage(scrollReset: boolean = false) {
        this.open = true
        if (scrollReset) {
            this.scrollView?.scrollTo(0, 0)
        }

        this.openAnimation()
    }

    public closePage(currentX: number = 0) {
        const animation = this.closeAnimation(currentX)
        // this.scrollY = this.scrollView?.scrollTop || 0

        animation.finished.then(() => {
            this.dialog.classList.remove("closing")
            this.open = false
        })
    }

    private onTouchStart(event: TouchEvent): void {
        if (event.touches.length !== 1) return

        this.startX = event.touches[0].clientX
        this.currentX = this.startX
        if (this.startX > 40) return

        this.isDragging = true
    }

    private onTouchMove(event: TouchEvent): void {
        if (!this.isDragging) return

        this.currentX = event.touches[0].clientX
        const deltaX = this.currentX - this.startX
        if (deltaX > 0) {
            event.preventDefault()
            this.dialog.style.transform = `translateX(${deltaX}px)`
        }
    }

    private onTouchEnd(): void {
        this.dialog.removeAttribute('style')
        if (!this.isDragging) return

        const deltaX = this.currentX - this.startX
        this.isDragging = false

        if (deltaX > this.dialog.clientWidth * 0.5) {
            this.closePage(deltaX)
        } else if (deltaX > 1) {
            this.openAnimation(deltaX)
        }
    }

    private openAnimation(deltaX: number = 0) {
        return this.dialog.animate([
            { translate: `${deltaX || window.innerWidth }px 0` },
            { translate: '0 0' },
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.61, 1, 0.88, 1)'
        })
    }

    private closeAnimation(deltaX: number = 0) {
        this.dialog.classList.add('closing')

        return this.dialog.animate([
            { translate: `${deltaX}px 0` },
            { translate: '100% 0' },
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.61, 1, 0.88, 1)'
        })
    }
}

customElements.define('page-dialog', PageDialog)