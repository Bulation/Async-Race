import API from '../api';
import { ICar } from '../interfaces/ICar';
import { IWinner } from '../interfaces/IWinner';
import { Order, Sort } from '../types/types';

export default class WinnersModel {
  public winnersData: (IWinner & ICar)[];

  private _pageNumber = 1;

  private _sort: Sort = 'wins';

  private _order: Order = 'ASC';

  set pageNumber(pageNumber: number) {
    this._pageNumber = pageNumber;
  }

  get pageNumber() {
    return this._pageNumber;
  }

  set sort(sort: Sort) {
    this._sort = sort;
  }

  get sort() {
    return this._sort;
  }

  set order(order: Order) {
    this._order = order;
  }

  get order() {
    return this._order;
  }

  constructor() {
  }

  onUpdate: (winners: (IWinner & ICar)[], countOfWinners: number, pageNumber: number) => void;

  sorting(sort: Sort, order: Order) {
    this.sort = sort;
    this.order = order;
    this.loadWinners();
  }

  async loadWinners() {
    const winners = await API.getWinners(this.pageNumber, this.sort, this.order);
    const winnersData = await Promise.all(winners);
    this.winnersData = await Promise.all(winnersData.map(async (winner) => {
      let car: ICar;
      if (typeof winner.id === 'number') {
        try {
          car = await API.getCar(winner.id);
        } catch (e) {
          console.error(e);
        }
      }
      return {
        wins: winner.wins,
        time: winner.time,
        name: car.name,
        color: car.color,
      };
    }));
    this.onUpdate(this.winnersData, await this.getCountOfWinners(), this.pageNumber);
  }

  async getCountOfWinners() {
    const count = Number(await API.getCountOfWinners(this.pageNumber, this.sort, this.order));
    return count;
  }

  async createWinner(idValue: number, winsValue: number, timeValue: number) {
    try {
      await API.createWinner({
        id: idValue,
        wins: winsValue,
        time: timeValue,
      });
    } catch (e) {
      console.error(e);
    }
    this.loadWinners();
  }

  async updateWinner(winsValue: number, timeValue: number, id: number) {
    try {
      await API.updateWinner({
        wins: winsValue,
        time: timeValue,
      }, id);
    } catch (e) {
      console.error(e);
    }
    this.loadWinners();
  }

  async deleteWinner(id: number) {
    try {
      await API.deleteWinner(id);
    } catch (e) {
      console.error(e);
    }
    if (this.winnersData.length === 1 && this.pageNumber !== 1) {
      this.pageNumber -= 1;
    }
    this.loadWinners();
  }
}
