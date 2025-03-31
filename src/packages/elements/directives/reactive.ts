import { ContextProvider, createContext } from "@mini-element/context";
import { extractDataFromBindings } from "../data-extract";

type DataType = Record<string, unknown>

export const reactiveContext = createContext<DataType>('reactive-context')

export class ReactiveDirective {
    private data: DataType = {}
    private provider!: ContextProvider<DataType>
    private attrObserver: MutationObserver;

    constructor(private host: HTMLElement) {
        this.attrObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                console.log('MUTATION', mutation)
                const data = extractDataFromBindings(host)
                this.provider.setValue(data)
            }
        });

        this.attrObserver.observe(host, { subtree: true, characterData: true })

        this.data = extractDataFromBindings(host)

        this.provider = new ContextProvider(host, reactiveContext, {
            initial: this.data
        })

        this.provider.subscribe(host, value => {
            console.log(value)
        })
    }

    destroy() {
        this.attrObserver.disconnect()
    }
}