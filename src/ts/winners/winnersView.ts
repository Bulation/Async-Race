import Component from '../common/component';
import { TABLE_HEADER, MAX_WINNERS_CARS_LIMIT } from '../constants/constants';
import { ICar } from '../interfaces/ICar';
import { IWinner } from '../interfaces/IWinner';
import { Order, Sort } from '../types/types';

export default class WinnersView extends Component {
  prevButton: Component;

  nextButton: Component;

  node: HTMLElement;

  title: Component;

  pageTitle: Component;

  table: Component;

  thead: Component;

  tbody: Component;

  paginationClick: (term: number) => void;

  sort: (sort: Sort, order: Order) => void;

  winsOrder: Order;

  timeOrder: Order;

  constructor(node: HTMLElement) {
    super(node, 'div', 'winners-page');
  }

  renderPage(winners: (IWinner & ICar)[], countOfWinners: number, pageNumber: number) {
    this.removePage();
    this.title = new Component(this.node, 'h1', 'title', `Winners (${countOfWinners})`);
    this.pageTitle = new Component(this.node, 'h2', 'page-title', `Page (${pageNumber})`);
    this.table = new Component(this.node, 'table', 'table', '');
    if (!winners.length) {
      this.table.node.textContent = 'There is no winners';
      return;
    }
    this.thead = new Component(this.node, 'thead', 'table__head', '');
    TABLE_HEADER.forEach((name) => {
      const tableHead = new Component(this.thead.node, 'th', '', name);
      if (name === 'Wins') {
        tableHead.setListener('click', () => {
          if (this.winsOrder === 'ASC') {
            this.winsOrder = 'DESC';
          } else {
            this.winsOrder = 'ASC';
          }
          this.sort('wins', this.winsOrder);
        });
      }
      if (name === 'Best time') {
        tableHead.setListener('click', () => {
          if (this.timeOrder === 'ASC') {
            this.timeOrder = 'DESC';
          } else {
            this.timeOrder = 'ASC';
          }
          this.sort('time', this.timeOrder);
        });
      }
    });
    this.tbody = new Component(this.node, 'tbody', 'table__body', '');
    winners.forEach((winner, index: number) => {
      const row = new Component(this.tbody.node, 'tr', 'table__row', '');
      new Component(row.node, 'td', 'table__col', String(index + 1 + (pageNumber - 1) * MAX_WINNERS_CARS_LIMIT));
      new Component(row.node, 'td', 'table__col winner-image', '').setStyle('background-color', winner.color);
      new Component(row.node, 'td', 'table__col', `${winner.name}`);
      new Component(row.node, 'td', 'table__col', `${winner.wins}`);
      new Component(row.node, 'td', 'table__col', `${winner.time}`);
    });
    this.prevButton = new Component(this.node, 'button', 'btn prev-btn', 'Prev')
      .setListener('click', () => this.paginationClick(-1));
    this.nextButton = new Component(this.node, 'button', 'btn next-btn', 'Next')
      .setListener('click', () => this.paginationClick(1));
    if (pageNumber === 1) {
      this.prevButton.setAttribute('disabled', 'true');
    } else {
      this.prevButton.removeAttribute('disabled');
    }
    if (pageNumber * MAX_WINNERS_CARS_LIMIT >= countOfWinners) {
      this.nextButton.setAttribute('disabled', 'true');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
  }

  removePage() {
    while (this.node.children.length) {
      this.node.firstChild.remove();
    }
  }
}
