import { css, html, MiniElement } from "@mini-element"
import { MainPage } from "./main-page"

export class BottomNav extends MiniElement {
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #eee;
            gap: 1rem;

            button[active] {
                background-color: hotpink;
            }
        }
    `

    constructor() {
        super()
    }

    protected render() {
        return html`
            <button data-button="nav" data-page="home" active>Home</button>
            <button data-button="add">+</button>
            <button data-button="nav" data-page="settings">Settings</button>
        `
    }

    protected onClick(dataset: DOMStringMap) {
        if (dataset.button === 'nav') {
            const targetPage = dataset.page || 'home'
            this.updateNavButton(targetPage)
            this.updateMainPage(targetPage)
        }
    }

    private updateNavButton(targetPage: string) {
        const buttons = this.renderRoot.querySelectorAll('[data-button="nav"]') as NodeListOf<HTMLButtonElement>
        buttons.forEach(btnEl => {
            const page = btnEl.getAttribute('data-page')
            if (page === targetPage) {
                btnEl.setAttribute('active', '')
            } else {
                btnEl.removeAttribute('active')
            }
        })
    }

    private updateMainPage(targetPage: string) {
        const pages = document.querySelectorAll('nav-container > main-page') as NodeListOf<MainPage>
        pages.forEach(pageEl => {
            const page = pageEl.getAttribute('page')
            if (page === targetPage) {
                pageEl.setAttribute('show', '')
            } else {
                pageEl.removeAttribute('show')
            }
        })
    }
}

customElements.define('bottom-nav', BottomNav)