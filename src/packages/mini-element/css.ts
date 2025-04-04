export function css(strings: TemplateStringsArray, ...values: any[]): () => HTMLStyleElement {
    return () => {
        const style = document.createElement('style')
        style.textContent = String.raw(strings, ...values)
        return style
    }
}
