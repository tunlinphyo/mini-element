/// <reference types="vite/client" />

declare module "https://unpkg.com/@oddbird/css-anchor-positioning/dist/css-anchor-positioning-fn.js" {
    interface AnchorPolyfillOptions {
        elements?: HTMLElement[] | undefined;
        excludeInlineStyles?: boolean;
        useAnimationFrame?: boolean;
    }

    const polyfill: (options: AnchorPolyfillOptions) => void;
    export default polyfill;
}