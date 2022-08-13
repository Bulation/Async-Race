import Component from '../common/component';
import { ICar } from '../interfaces/ICar';

export default class CarView extends Component {
  selectButton: Component;

  removeButton: Component;

  title: Component;

  startButton: Component;

  stopButton: Component;

  carImage: Component;

  flag: Component;

  id: number;

  name: string;

  color: string;

  requestId: number;

  constructor(
    node: HTMLElement,
    tagName: keyof HTMLElementTagNameMap,
    className: string,
    content: string,
    carData: ICar,
  ) {
    super(node, tagName, className, content);
    this.id = carData.id;
    this.name = carData.name;
    this.color = carData.color;
    this.selectButton = new Component(this.node, 'button', 'btn select-btn', 'Select');
    this.removeButton = new Component(this.node, 'button', 'btn select-btn', 'Remove');
    this.title = new Component(this.node, 'h3', 'car-title', carData.name);
    this.startButton = new Component(this.node, 'button', 'btn start-btn', 'Start');
    this.stopButton = new Component(this.node, 'button', 'btn stop-btn', 'Stop').setAttribute('disabled', 'true');
    this.carImage = new Component(this.node, 'div', 'car', '').setStyle('background-color', carData.color);
    this.flag = new Component(this.node, 'div', 'flag', '');
  }

  animate(velocity: number, distance: number) {
    const finish = this.flag.node.getBoundingClientRect().right;
    const timeOfAnimation = distance / velocity;
    let startTime: null | number = null;
    const animation = (time: number) => {
      if (!startTime) {
        startTime = time;
      }
      const transformValue = ((time - startTime) / timeOfAnimation) * finish;
      if (transformValue >= finish) {
        this.carImage.setStyle('transform', `translateX(${finish}px)`);
        cancelAnimationFrame(this.requestId);
        return;
      }
      this.carImage.setStyle('transform', `translateX(${transformValue}px)`);
      this.requestId = requestAnimationFrame(animation);
    };
    requestAnimationFrame(() => {
      this.requestId = requestAnimationFrame(animation);
    });
  }

  cancelAnimation() {
    cancelAnimationFrame(this.requestId);
  }
}
