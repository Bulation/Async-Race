import GarageModel from './garageModel';
import GarageView from './garageView';

export default class GarageController {
  private garageModel: GarageModel;

  private garageView: GarageView;

  constructor(garageView: GarageView, garageModel: GarageModel) {
    this.garageModel = garageModel;
    this.garageView = garageView;
    this.renderView();
    this.garageView.create = this.garageModel.createCar.bind(this.garageModel);
    this.garageView.update = this.garageModel.updateCar.bind(this.garageModel);
    this.garageView.delete = this.garageModel.deleteCar.bind(this.garageModel);
    this.garageView.generate = this.garageModel.generateCars.bind(this.garageModel);
    this.garageView.paginationClick = (term: number) => {
      this.garageModel.pageNumber += term;
      this.garageModel.loadCars();
    };
    this.garageView.handleMove = this.garageModel.handleEngine.bind(this.garageModel);
    this.garageView.drive = this.garageModel.drive.bind(this.garageModel);
    this.garageView.addWinner = this.garageModel.saveWinner.bind(this.garageModel);
    this.garageModel.onUpdate = this.garageView.renderGarage.bind(this.garageView);
  }

  renderView() {
    this.garageView.renderButtons();
    this.garageModel.loadCars();
  }

  removePage() {
    this.garageView.removePage();
  }
}
