import { MiniElement } from "../mini-element";

export class Sortable {
    private container: ShadowRoot;
    private draggedEl: HTMLElement | null = null;
    private childObserver: MutationObserver;
    private attrObserver: MutationObserver;
  
    constructor(container: MiniElement) {
        this.container = container.root as ShadowRoot;
        console.log(container.root);

      if (container instanceof HTMLElement && container.hasAttribute('sortable')) {
        console.log('Sortable initialized');
        container.setAttribute('aria-dropeffect', 'move');
        this.observe();
      }
  
      this.attrObserver = new MutationObserver(() => {
        if (container.hasAttribute('sortable')) {
          this.observe();
        } else {
          this.disconnect();
        }
      });
      this.attrObserver.observe(container, { attributes: true });
  
      // Observe child changes inside shadow root
      this.childObserver = new MutationObserver(() => {
        this.observe(); // Reapply listeners on change
      });
      this.childObserver.observe(this.container, { childList: true });
    }
  
    private observe() {
      const children = Array.from(this.container.children) as HTMLElement[];
      console.log(children)
      children.forEach(el => {
        el.setAttribute('draggable', 'true');
        el.addEventListener('dragstart', this.onDragStart);
        el.addEventListener('dragover', this.onDragOver);
        el.addEventListener('drop', this.onDrop);
        el.addEventListener('dragend', this.onDragEnd);
      });
    }
  
    private disconnect() {
      const children = Array.from(this.container.children) as HTMLElement[];
      children.forEach(el => {
        el.removeAttribute('draggable');
        el.removeEventListener('dragstart', this.onDragStart);
        el.removeEventListener('dragover', this.onDragOver);
        el.removeEventListener('drop', this.onDrop);
        el.removeEventListener('dragend', this.onDragEnd);
      });
    }
  
    private onDragStart = (e: DragEvent) => {
      this.draggedEl = e.currentTarget as HTMLElement;
      e.dataTransfer?.setData('text/plain', '');
      this.draggedEl.classList.add('dragging');
    };
  
    private onDragOver = (e: DragEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      if (!this.draggedEl || target === this.draggedEl) return;
  
      const rect = target.getBoundingClientRect();
      const isAfter = e.clientY > rect.top + rect.height / 2;
  
      if (isAfter) {
        target.after(this.draggedEl);
      } else {
        target.before(this.draggedEl);
      }
    };
  
    private onDrop = (e: DragEvent) => {
      e.preventDefault();
    };
  
    private onDragEnd = () => {
      if (this.draggedEl) {
        this.draggedEl.classList.remove('dragging');
      }
      this.draggedEl = null;
  
      const newOrder = Array.from(this.container.children).map(
        el => (el as HTMLElement).dataset.id || ''
      );
  
      const host = this.container.getRootNode() instanceof ShadowRoot
        ? (this.container.getRootNode() as ShadowRoot).host
        : this.container;
  
      host.dispatchEvent(
        new CustomEvent('sortchange', {
          detail: { order: newOrder },
          bubbles: true,
          composed: true,
        })
      );
    };
  }