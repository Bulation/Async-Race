export default class Component {
  public node: HTMLElement;

  constructor(parentNode: HTMLElement | null, tagName: keyof HTMLElementTagNameMap, className = '', content = '') {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = content;
    if (parentNode) {
      parentNode.append(el);
    }
    this.node = el;
  }

  setClass(className: string) {
    this.node.classList.add(className);
    return this;
  }

  setStyle(styleName: string, value: string) {
    this.node.style.setProperty(styleName, value);
    return this;
  }

  setAttribute(attribute: string, value: string) {
    this.node.setAttribute(attribute, value);
    return this;
  }

  removeAttribute(attribute: string) {
    this.node.removeAttribute(attribute);
    return this;
  }

  setListener(event: keyof HTMLElementEventMap, callback: (e: Event) => void) {
    this.node.addEventListener(event, callback);
    return this;
  }
}
