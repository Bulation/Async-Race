import WinnersModel from './winners/winnersModel';
import WinnersView from './winners/winnersView';
import WinnersController from './winners/winnersController';
import GarageModel from './garage/garageModel';
import GarageView from './garage/garageView';
import GarageController from './garage/garageController';
import Component from './common/component';

export default class AppController {
  node: HTMLElement;

  garageButton: Component;

  winnersButton: Component;

  garageController: GarageController;

  winnersController: WinnersController;

  constructor(node: HTMLElement) {
    this.node = node;
    this.garageButton = new Component(this.node, 'button', 'btn garage-btn', 'To garage').setListener('click', () => {
      this.onGarage();
    });
    this.winnersButton = new Component(this.node, 'button', 'btn winners-btn', 'To winners')
      .setListener('click', () => {
        this.onWinners();
      });
    this.garageController = new GarageController(
      new GarageView(this.node, this.winnersButton, this.garageButton),
      new GarageModel(),
    );
    this.winnersController = new WinnersController(new WinnersView(this.node), new WinnersModel());
  }

  onWinners() {
    this.garageController.removePage();
    this.winnersController.renderView();
  }

  onGarage() {
    this.winnersController.removePage();
    this.garageController.renderView();
  }
}
