import WinnersModel from './winnersModel';
import WinnersView from './winnersView';

export default class WinnersController {
  private winnersModel: WinnersModel;

  private winnersView: WinnersView;

  constructor(winnersView: WinnersView, winnersModel: WinnersModel) {
    this.winnersModel = winnersModel;
    this.winnersView = winnersView;
    this.winnersView.paginationClick = (term: number) => {
      this.winnersModel.pageNumber += term;
      this.winnersModel.loadWinners();
    };
    this.winnersView.sort = this.winnersModel.sorting.bind(this.winnersModel);
    this.winnersModel.onUpdate = this.winnersView.renderPage.bind(this.winnersView);
  }

  renderView() {
    this.winnersModel.loadWinners();
  }

  removePage() {
    this.winnersView.removePage();
  }
}
