import { serialize } from "../utils"

export function html(strings: TemplateStringsArray, ...values: any[]) {
    const template = document.createElement('template')
    template.innerHTML = String.raw(strings, ...values.map(v => serialize(v)))
    return template.content.cloneNode(true)
  }