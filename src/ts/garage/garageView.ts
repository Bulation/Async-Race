import Component from '../common/component';
import { ICar } from '../interfaces/ICar';
import Popup from '../common/popup';
import CarView from './carView';
import { Status, WinnerInfo } from '../types/types';
import { ISpeed } from '../interfaces/ISpeed';
import { MAX_GARAGE_CARS_LIMIT } from '../constants/constants';

export default class GarageView extends Component {
  node: HTMLElement;

  createContainer: Component;

  createNameInput: Component;

  createColorInput: Component;

  createButton: Component;

  updateContainer: Component;

  updateNameInput: Component;

  updateColorInput: Component;

  updateButton: Component;

  raceButton: Component;

  resetButton: Component;

  generateButton: Component;

  garageContainer: Component;

  title: Component;

  pageTitle: Component;

  carsView: CarView[];

  activeIdForUpdate: number | null;

  prevButton: Component;

  nextButton: Component;

  createNameValue = '';

  createColorValue = '';

  updateNameValue = '';

  updateColorValue = '';

  create: (name: string, color: string) => void;

  update: (name: string, color: string, id: number) => void;

  delete: (id: number) => void;

  generate: () => void;

  paginationClick: (term: number) => void;

  handleMove: (id: number, status: Status) => Promise<ISpeed>;

  drive: (id: number) => Promise<Response>;

  addWinner: (id: number, time: number) => void;

  garage: Component;

  toWinnersBtn: Component;

  pageNumber: number;

  countOfCars: number;

  toGarageBtn: Component;

  constructor(node: HTMLElement, toWinnersBtn: Component, toGarageBtn: Component) {
    super(node, 'div');
    this.carsView = [];
    this.toWinnersBtn = toWinnersBtn;
    this.toGarageBtn = toGarageBtn;
  }

  renderGarage(cars: ICar[], countOfCars: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.countOfCars = countOfCars;
    this.garageContainer.node.innerHTML = '';
    this.raceButton.removeAttribute('disabled');
    this.resetButton.setAttribute('disabled', 'true');
    if (pageNumber === 1) {
      this.prevButton.setAttribute('disabled', 'true');
    } else {
      this.prevButton.removeAttribute('disabled');
    }
    if (pageNumber * MAX_GARAGE_CARS_LIMIT >= countOfCars) {
      this.nextButton.setAttribute('disabled', 'true');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
    this.title = new Component(this.garageContainer.node, 'h1', 'title', `Garage (${countOfCars})`);
    this.pageTitle = new Component(this.garageContainer.node, 'h2', 'page-title', `Page (${pageNumber})`);
    this.garage = new Component(this.garageContainer.node, 'div', 'cars', '');
    if (!cars.length) {
      this.garage.node.textContent = 'There is no machines';
      return;
    }
    this.carsView = [];
    cars.forEach((car) => {
      const carView = new CarView(this.garage.node, 'div', 'car-container', '', car);
      carView.selectButton.setListener('click', () => this.onSelect(carView).catch((e) => console.error(e)));
      carView.removeButton.setListener('click', () => this.delete(carView.id));
      carView.startButton.setListener('click', () => this.onStart(carView).catch((e) => console.error(e)));
      carView.stopButton.setListener('click', () => this.onStop(carView).catch((e) => console.error(e)));
      this.carsView.push(carView);
    });
  }

  renderButtons() {
    this.removePage();
    this.createContainer = new Component(this.node, 'div', 'create-container', '');
    this.createNameInput = new Component(this.createContainer.node, 'input', 'create-input', '')
      .setAttribute('type', 'text')
      .setAttribute('placeholder', 'Write machine model')
      .setAttribute('value', this.createNameValue)
      .setListener('input', () => { this.createNameValue = (this.createNameInput.node as HTMLInputElement).value; });
    this.createColorInput = new Component(this.createContainer.node, 'input', 'create-color', '')
      .setAttribute('type', 'color')
      .setAttribute('value', this.createColorValue)
      .setListener('input', () => { this.createColorValue = (this.createColorInput.node as HTMLInputElement).value; });
    this.createButton = new Component(this.createContainer.node, 'button', 'btn create-btn', 'Create')
      .setAttribute('type', 'button')
      .setListener('click', () => {
        this.create(
          (this.createNameInput.node as HTMLInputElement).value,
          (this.createColorInput.node as HTMLInputElement).value,
        );
        (this.createNameInput.node as HTMLInputElement).value = '';
        (this.createColorInput.node as HTMLInputElement).value = '';
        this.createNameValue = '';
        this.createColorValue = '';
      });
    this.updateContainer = new Component(this.node, 'div', 'update-container', '');
    this.updateNameInput = new Component(this.updateContainer.node, 'input', 'update-input', '')
      .setAttribute('type', 'text')
      .setAttribute('placeholder', 'Write machine model')
      .setAttribute('value', this.updateNameValue)
      .setListener('input', () => { this.updateNameValue = (this.updateNameInput.node as HTMLInputElement).value; });
    this.updateColorInput = new Component(this.updateContainer.node, 'input', 'update-color', '')
      .setAttribute('type', 'color')
      .setAttribute('value', this.updateColorValue)
      .setListener('input', () => { this.updateColorValue = (this.updateColorInput.node as HTMLInputElement).value; });
    this.updateButton = new Component(this.updateContainer.node, 'button', 'btn update-btn', 'Update')
      .setAttribute('type', 'button')
      .setListener('click', () => {
        this.update(
          (this.updateNameInput.node as HTMLInputElement).value,
          (this.updateColorInput.node as HTMLInputElement).value,
          this.activeIdForUpdate,
        );
        this.activeIdForUpdate = null;
        this.disablingUpdateButtons();
      });
    this.disablingUpdateButtons();
    this.raceButton = new Component(this.node, 'button', 'btn race-btn', 'Race')
      .setAttribute('type', 'button')
      .setListener('click', () => {
        this.onRace();
      });
    this.resetButton = new Component(this.node, 'button', 'btn reset-btn', 'Reset')
      .setAttribute('type', 'button')
      .setAttribute('disabled', 'true')
      .setListener('click', () => {
        this.raceButton.removeAttribute('disabled');
        this.carsView.forEach((car) => this.onStop(car));
        this.resetButton.setAttribute('disabled', 'true');
      });
    this.generateButton = new Component(this.node, 'button', 'btn generate-btn', 'Generate Cars')
      .setAttribute('type', 'button')
      .setListener('click', () => this.generate());
    this.garageContainer = new Component(this.node, 'div', 'garage-container', '');
    this.prevButton = new Component(this.node, 'button', 'btn prev-btn', 'Prev')
      .setAttribute('disabled', 'true')
      .setListener('click', () => this.paginationClick(-1));
    this.nextButton = new Component(this.node, 'button', 'btn next-btn', 'Next')
      .setAttribute('disabled', 'true')
      .setListener('click', () => this.paginationClick(1));
  }

  disablingUpdateButtons() {
    if (!this.activeIdForUpdate) {
      this.updateNameInput.setAttribute('disabled', 'true');
      this.updateColorInput.setAttribute('disabled', 'true');
      this.updateButton.setAttribute('disabled', 'true');
      (this.updateNameInput.node as HTMLInputElement).value = '';
      (this.updateColorInput.node as HTMLInputElement).value = '';
      this.updateNameValue = '';
      this.updateColorValue = '';
    }
  }

  disableButtonsDuringRace() {
    this.prevButton.setAttribute('disabled', 'true');
    this.nextButton.setAttribute('disabled', 'true');
    this.raceButton.setAttribute('disabled', 'true');
    this.toGarageBtn.setAttribute('disabled', 'true');
    this.toWinnersBtn.setAttribute('disabled', 'true');
    this.createButton.setAttribute('disabled', 'true');
    this.updateButton.setAttribute('disabled', 'true');
    this.toWinnersBtn.setAttribute('disabled', 'true');
    this.generateButton.setAttribute('disabled', 'true');
    this.carsView.forEach((car) => {
      car.startButton.setAttribute('disabled', 'true');
      car.selectButton.setAttribute('disabled', 'true');
      car.removeButton.setAttribute('disabled', 'true');
    });
  }

  enableButtonsAfterRace() {
    if (this.pageNumber !== 1) {
      this.prevButton.removeAttribute('disabled');
    }
    if (this.pageNumber * MAX_GARAGE_CARS_LIMIT <= this.countOfCars) {
      this.nextButton.removeAttribute('disabled');
    }
    this.raceButton.removeAttribute('disabled');
    this.createButton.removeAttribute('disabled');
    this.updateButton.removeAttribute('disabled');
    this.toGarageBtn.removeAttribute('disabled');
    this.toWinnersBtn.removeAttribute('disabled');
    this.generateButton.removeAttribute('disabled');
    this.carsView.forEach((car) => {
      car.startButton.removeAttribute('disabled');
      car.selectButton.removeAttribute('disabled');
      car.removeButton.removeAttribute('disabled');
    });
  }

  removePage() {
    while (this.node.children.length) {
      this.node.firstChild.remove();
    }
  }

  async onRace() {
    let countOfBrokenCars = 0;
    const carsInfo: Promise<WinnerInfo>[] = [];
    this.carsView.forEach((car) => {
      const carDriveResult: Promise<WinnerInfo> = new Promise((res) => {
        this.onStart(car).then((val: number) => {
          res({
            id: car.id,
            name: car.name,
            time: val / 1000,
          });
        }).catch(() => {
          countOfBrokenCars += 1;
          if (countOfBrokenCars === this.carsView.length) {
            new Popup(this.node, 'div', 'popup', '', 'There is no winners');
            this.resetButton.removeAttribute('disabled');
            this.toWinnersBtn.removeAttribute('disabled');
          }
        });
      });
      carsInfo.push(carDriveResult);
      car.stopButton.setAttribute('disabled', 'true');
    });
    const winner = await Promise.race(carsInfo);
    new Popup(this.node, 'div', 'popup', '', `${winner.name} went first in ${winner.time} seconds!`);
    this.addWinner(winner.id, winner.time);
    this.resetButton.removeAttribute('disabled');
    this.carsView.forEach((car) => {
      car.stopButton.removeAttribute('disabled');
    });
  }

  async onStart(carView: CarView): Promise<number> {
    this.disableButtonsDuringRace();
    carView.stopButton.removeAttribute('disabled');
    const engineInfo = await this.handleMove(carView.id, 'started');
    carView.animate(engineInfo.velocity, engineInfo.distance);
    let driveResponse: Response;
    try {
      driveResponse = await this.drive(carView.id);
    } catch (e) {
      console.error(e);
    }
    return new Promise((res, rej) => {
      if (driveResponse.status === 500) {
        carView.cancelAnimation();
        rej(driveResponse.text());
      }
      res(engineInfo.distance / engineInfo.velocity);
    });
  }

  async onStop(carView: CarView) {
    await this.handleMove(carView.id, 'stopped');
    carView.cancelAnimation();
    carView.carImage.setStyle('transform', 'translateX(0)');
    carView.stopButton.setAttribute('disabled', 'true');
    if (!this.carsView
      .filter((car) => (car.stopButton.node as HTMLButtonElement).disabled === false).length) {
      this.raceButton.removeAttribute('disabled');
      this.resetButton.setAttribute('disabled', 'true');
      this.enableButtonsAfterRace();
    }
  }

  async onSelect(carView: CarView) {
    this.activeIdForUpdate = carView.id;
    this.updateNameInput.removeAttribute('disabled');
    (this.updateNameInput.node as HTMLInputElement).value = carView.name;
    this.updateNameValue = carView.name;
    this.updateColorInput.removeAttribute('disabled');
    (this.updateColorInput.node as HTMLInputElement).value = carView.color;
    this.updateColorValue = carView.color;
    this.updateButton.removeAttribute('disabled');
  }
}
