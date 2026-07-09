import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})

export class Backend {
  apiURL = 'http://localhost:3000/api'

  constructor() { }

  async getAll(): Promise<User[]> {
    let response = await fetch(this.apiURL + '/user');
    let users = await response.json();
    console.log('Users in service (getAll) : ', users)
    return users;
  }
}
