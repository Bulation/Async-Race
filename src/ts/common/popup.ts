import Component from './component';

export default class Popup extends Component {
  overlay: Component;

  closeButton: Component;

  constructor(
    parent: HTMLElement,
    tagName: keyof HTMLElementTagNameMap,
    className: string,
    content: string,
    popupData: string,
  ) {
    super(parent, tagName, className, content);
    this.overlay = new Component(this.node, 'div', 'popup-wrapper', popupData);
    this.closeButton = new Component(this.overlay.node, 'button', 'popup-button', 'x');
    this.closeButton.setListener('click', () => this.node.remove());
  }
}
