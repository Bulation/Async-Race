import API from '../api';
import { ICar } from '../interfaces/ICar';
import { carBrand, carModal } from '../common/carData';
import {
  MAX_HEX_NUMBER,
  HEX,
  COLOR_LENGTH,
  BAD_REQUEST_CODE_STATUS,
  NOT_FOUND_CODE_STATUS,
  MANY_REQUESTS_CODE_STATUS,
} from '../constants/constants';
import { Status } from '../types/types';
import { IWinner } from '../interfaces/IWinner';
import { ISpeed } from '../interfaces/ISpeed';

export default class GarageModel {
  public carsData: ICar[];

  private _pageNumber = 1;

  set pageNumber(pageNumber: number) {
    this._pageNumber = pageNumber;
  }

  get pageNumber() {
    return this._pageNumber;
  }

  constructor() {
  }

  onUpdate: (cars: ICar[], countOfCars: number, pageNumber: number) => void;

  async loadCars() {
    const cars = await API.getCars(this.pageNumber);
    this.carsData = await Promise.all(cars);
    this.onUpdate(this.carsData, await this.getCountOfCars(), this.pageNumber);
  }

  async getCountOfCars() {
    const count = Number(await API.getCountOfCars(this.pageNumber));
    return count;
  }

  private generateNum(value: number) {
    return Math.floor(Math.random() * value);
  }

  private generateCarName() {
    return `${carBrand[this.generateNum(carBrand.length)]} ${carModal[this.generateNum(carModal.length)]}`;
  }

  private generateColor() {
    let color = this.generateNum(MAX_HEX_NUMBER).toString(HEX);
    while (color.length !== COLOR_LENGTH) {
      color = `0${color}`;
    }
    return `#${color}`;
  }

  async generateCars() {
    const promises: Promise<ICar>[] = [];
    for (let i = 0; i < 100; i += 1) {
      promises.push(API.createCar({
        name: this.generateCarName(),
        color: this.generateColor(),
      }));
    }
    await Promise.all(promises);
    this.loadCars();
  }

  async createCar(nameValue: string, colorValue: string) {
    await API.createCar({
      name: nameValue,
      color: colorValue,
    });
    this.loadCars();
  }

  async updateCar(nameValue: string, colorValue: string, id: number) {
    try {
      await API.updateCar({
        name: nameValue,
        color: colorValue,
      }, id);
    } catch (e) {
      console.error(e);
    }
    this.loadCars();
  }

  async deleteCar(id: number) {
    try {
      await API.deleteCar(id);
      await API.deleteWinner(id);
    } catch (e) {
      console.error(e);
    }
    if (this.carsData.length === 1 && this.pageNumber !== 1) {
      this.pageNumber -= 1;
    }
    this.loadCars();
  }

  async handleEngine(id: number, status: Status) {
    let speed: ISpeed;
    try {
      speed = await API.handleEngine(id, status);
    } catch (e) {
      console.error(e);
    }
    return speed;
  }

  async drive(id: number) {
    const driveResult = await API.drive(id);
    if (driveResult.status === BAD_REQUEST_CODE_STATUS) {
      throw new Error('Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"');
    }
    if (driveResult.status === NOT_FOUND_CODE_STATUS) {
      throw new Error('Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?');
    }
    if (driveResult.status === MANY_REQUESTS_CODE_STATUS) {
      throw new Error('Drive already in progress. You can\'t run drive for the same car twice while it\'s not stopped.');
    }
    return driveResult;
  }

  async saveWinner(id: number, time: number) {
    const winnerStatus = await API.getWinner(id);
    if (winnerStatus.status === 404) {
      await API.createWinner({
        id,
        wins: 1,
        time,
      });
    } else {
      const winner: IWinner = await winnerStatus.json();
      let bestTime: number;
      if (winner.time > time) {
        bestTime = time;
      } else {
        bestTime = winner.time;
      }
      await API.updateWinner({
        wins: winner.wins + 1,
        time: bestTime,
      }, id);
    }
  }
}
