import { ICar } from './interfaces/ICar';
import { ISpeed } from './interfaces/ISpeed';
import { IWinner } from './interfaces/IWinner';
import {
  MAX_GARAGE_CARS_LIMIT,
  MAX_WINNERS_CARS_LIMIT,
  BASE_URL,
  NOT_FOUND_CODE_STATUS,
  BAD_REQUEST_CODE_STATUS,
  SERVER_ERROR_CODE_STATUS,
} from './constants/constants';
import { Status, Sort, Order } from './types/types';

const API = {
  engine: `${BASE_URL}engine`,
  garage: `${BASE_URL}garage`,
  winners: `${BASE_URL}winners`,
  async getCars(page: number): Promise<Promise<ICar>[]> {
    const response = await fetch(`${this.garage}?_page=${page}&_limit=${MAX_GARAGE_CARS_LIMIT}`);
    const carsData: Promise<Promise<ICar>[]> = await response.json();
    return carsData;
  },

  async getCountOfCars(page: number) {
    const response = await fetch(`${this.garage}?_page=${page}&_limit=${MAX_GARAGE_CARS_LIMIT}`);
    const count = await response.headers.get('X-Total-Count');
    return count;
  },

  async getCar(id: number): Promise<ICar> {
    const response = await fetch(`${this.garage}/${id}`);
    if (response.status === NOT_FOUND_CODE_STATUS) {
      throw new Error(`Car with ${id} id is not found`);
    }
    const carData: Promise<ICar> = await response.json();
    return carData;
  },

  async createCar(body: ICar): Promise<ICar> {
    const response = await fetch(`${this.garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result: Promise<ICar> = await response.json();
    return result;
  },

  async updateCar(body: ICar, id: number): Promise<ICar> {
    const response = await fetch(`${this.garage}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === NOT_FOUND_CODE_STATUS) {
      throw new Error(`Car with ${id} id is not found`);
    }
    const result: Promise<ICar> = await response.json();
    return result;
  },

  async deleteCar(id: number): Promise<ICar> {
    const response = await fetch(`${this.garage}/${id}`, {
      method: 'DELETE',
    });
    if (response.status === NOT_FOUND_CODE_STATUS) {
      throw new Error(`Car with ${id} id is not found`);
    }
    const result: Promise<ICar> = await response.json();
    return result;
  },

  async handleEngine(id: number, status: Status): Promise<ISpeed> {
    const response = await fetch(`${this.engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    if (response.status === NOT_FOUND_CODE_STATUS) {
      throw new Error(`Car with ${id} id is not found`);
    }
    if (response.status === BAD_REQUEST_CODE_STATUS) {
      throw new Error('Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"');
    }
    const result: Promise<ISpeed> = await response.json();
    return result;
  },

  async drive(id: number): Promise<Response> {
    const response = await fetch(`${this.engine}?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    return response;
  },

  async getWinners(page: number, sort: Sort, order: Order): Promise<Promise<IWinner>[]> {
    const response = await fetch(`${this.winners}?_page=${page}&_limit=${MAX_WINNERS_CARS_LIMIT}&_sort=${sort}&_order=${order}`);
    const winnersData: Promise<Promise<IWinner>[]> = await response.json();
    return winnersData;
  },

  async getCountOfWinners(page: number, sort: Sort, order: Order) {
    const response = await fetch(`${this.winners}?_page=${page}&_limit=${MAX_WINNERS_CARS_LIMIT}&_sort=${sort}&_order=${order}`);
    const count = await response.headers.get('X-Total-Count');
    return count;
  },

  async getWinner(id: number): Promise<Response> {
    const response = await fetch(`${this.winners}/${id}`);
    return response;
  },

  async createWinner(body: IWinner): Promise<IWinner> {
    const response = await fetch(`${this.winners}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === SERVER_ERROR_CODE_STATUS) {
      throw new Error('Error: Insert failed, duplicate id');
    }
    const result: Promise<IWinner> = await response.json();
    return result;
  },

  async deleteWinner(id: number): Promise<IWinner> {
    const response = await fetch(`${this.winners}/${id}`, {
      method: 'DELETE',
    });
    if (response.status === NOT_FOUND_CODE_STATUS) {
      throw new Error(`Car with ${id} id is not found`);
    }
    const result: Promise<IWinner> = await response.json();
    return result;
  },

  async updateWinner(body: IWinner, id: number): Promise<IWinner> {
    const response = await fetch(`${this.winners}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === NOT_FOUND_CODE_STATUS) {
      throw new Error(`Car with ${id} id is not found`);
    }
    const result: Promise<IWinner> = await response.json();
    return result;
  },
};

export default API;
