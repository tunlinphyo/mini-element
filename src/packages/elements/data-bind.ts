function getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function updateBindings(data: Record<string, any>, root: HTMLElement | ShadowRoot = document.body) {
    // Text content bindings
    root.querySelectorAll<HTMLElement>('[data-bind]').forEach(el => {
        const key = el.getAttribute('data-bind');
        if (!key) return;

        
        const value = getValueByPath(data, key);
        if (value !== undefined) {
            el.textContent = String(value);
        }
    });

    // Attribute bindings
    root.querySelectorAll<HTMLElement>('[bind-attr]').forEach(el => {
        const bindings = el.getAttribute('bind-attr')?.split(';') || [];

        bindings.forEach(binding => {
            const [attr, key] = binding.split(':');
            if (!attr || !key) return;

            const value = getValueByPath(data, key.trim());
            if (value !== undefined) {
                el.setAttribute(attr.trim(), String(value));
            }
        });
    });
}