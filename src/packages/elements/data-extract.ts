function setValueByPath(obj: any, path: string, value: any) {
    const parts = path.split('.');
    let current = obj;
    parts.forEach((part, index) => {
        if (index === parts.length - 1) {
            current[part] = value;
        } else {
            current[part] = current[part] || {};
            current = current[part];
        }
    });
}

export function extractDataFromBindings(root: HTMLElement | ShadowRoot): Record<string, any> {
    const data: Record<string, any> = {};

    // From root itself if it has data-bind-attr
    if (root instanceof HTMLElement && root.hasAttribute('data-bind-attr')) {
        const bindings = root.getAttribute('data-bind-attr')?.split(';') || [];
        bindings.forEach(binding => {
            const [attr, path] = binding.split(':');
            if (!attr || !path) return;
            const attrName = attr.trim();
            const keyPath = path.trim();
            const attrVal = root.getAttribute(attrName);
            if (attrVal !== null) {
                setValueByPath(data, keyPath, attrVal);
            }
        });
    }

    // Text content bindings
    root.querySelectorAll<HTMLElement>('[data-bind-text]').forEach(el => {
        const key = el.getAttribute('data-bind-text');
        if (!key) return;
        const val = el.textContent ?? '';
        setValueByPath(data, key, val.trim());
    });

    // Form data bindings
    root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-bind]').forEach(el => {
        const key = el.getAttribute('data-bind');
        if (!key) return;
        setValueByPath(data, key, el.value);
    });

    // Attribute bindings
    root.querySelectorAll<HTMLElement>('[data-bind-attr]').forEach(el => {
        const bindings = el.getAttribute('data-bind-attr')?.split(';') || [];
        bindings.forEach(binding => {
            const [attr, path] = binding.split(':');
            if (!attr || !path) return;
            const attrName = attr.trim();
            const keyPath = path.trim();
            const attrVal = el.getAttribute(attrName);
            if (attrVal !== null) {
                setValueByPath(data, keyPath, attrVal);
            }
        });
    });

    return data;
}