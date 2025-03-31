import { deepEqual } from "../utils";

function getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function updateBindings(
    root: HTMLElement | ShadowRoot,
    newData: Record<string, any>,
    oldData?: Record<string, any>
) {
    const setValue = (value: any) => {
        if (value instanceof Boolean) {
            return String(value)
        } else if (Array.isArray(value)) {
            return value.join(', ')
        } else {
            return value ? String(value) : ''
        }
    }

    // Update root itself if it has data-bind-text and value changed
    if (root instanceof HTMLElement && root.hasAttribute('data-bind-attr')) {
        const bindings = root.getAttribute('data-bind-attr')?.split(';') || [];

        bindings.forEach(binding => {
            const [attr, key] = binding.split(':');
            if (!attr || !key) return;

            const attrName = attr.trim();
            const path = key.trim();

            const newVal = getValueByPath(newData, path);
            const oldVal = getValueByPath(oldData, path);

            if (!deepEqual(newVal, oldVal)) {
                root.setAttribute(attrName, setValue(newVal));
            }
        });
    }

    // Text content bindings
    root.querySelectorAll<HTMLElement>('[data-bind-text]').forEach(el => {
        const key = el.getAttribute('data-bind-text');
        if (!key) return;

        const newVal = getValueByPath(newData, key);
        const oldVal = getValueByPath(oldData, key);

        if (!deepEqual(newVal, oldVal)) {
            el.textContent = setValue(newVal);
        }
    });

    // Form data bindings
    root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-bind]').forEach(el => {
        console.log(el)
        const key = el.getAttribute('data-bind');
        if (!key) return;

        const newVal = getValueByPath(newData, key);
        const oldVal = getValueByPath(oldData, key);

        if (!deepEqual(newVal, oldVal)) {
            el.value = setValue(newVal);
        }
    });

    // Attribute bindings
    root.querySelectorAll<HTMLElement>('[data-bind-attr]').forEach(el => {
        const bindings = el.getAttribute('data-bind-attr')?.split(';') || [];

        bindings.forEach(binding => {
            const [attr, key] = binding.split(':');
            if (!attr || !key) return;

            const attrName = attr.trim();
            const path = key.trim();

            const newVal = getValueByPath(newData, path);
            const oldVal = getValueByPath(oldData, path);

            if (!deepEqual(newVal, oldVal)) {
                el.setAttribute(attrName, setValue(newVal));
            }
        });
    });
}