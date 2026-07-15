import { Injectable } from '@angular/core';
import { User } from './user';
import { Termin } from './termin';
import { VorsorgeTyp } from './vorsorge-typ';

@Injectable({
  providedIn: 'root',
})

export class Backend {
  apiURL = 'http://localhost:3000'

  constructor() { }

  // CRUD: User

  async getAll(): Promise<User[]> {
    let response = await fetch(this.apiURL + '/members');
    let users = await response.json();
    console.log('Users in service (getAll) : ', users)
    return users;
  }

  async getOne(id: string): Promise<User> {
    let response = await fetch(this.apiURL + '/members/' + id);
    let user = await response.json();
    console.log('User in service (getOne) : ', user)
    return user;
  }

  async legeUserAn(user: User): Promise<User> {
    let response = await fetch(this.apiURL + '/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    let neuerUser = await response.json();
    console.log('User in service (legeUserAn) : ', neuerUser)
    return neuerUser;
  }

  async aktualisiereUser(id: string, aenderungen: Partial<User>): Promise<User> {
    let response = await fetch(this.apiURL + '/members/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aenderungen),
    });
    let user = await response.json();
    console.log('User in service (aktualisiereUser) : ', user)
    return user;
  }

  async loescheUser(id: string): Promise<void> {
    await fetch(this.apiURL + '/members/' + id, { method: 'DELETE' });
  }

  async login(email: string, password: string): Promise<{ message: string; member?: User }> {
    let response = await fetch(this.apiURL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    let ergebnis = await response.json();
    console.log('Ergebnis in service (login) : ', ergebnis)
    return ergebnis;
  }

  // CRUD: Termine

  async getAlleTermine(): Promise<Termin[]> {
    const response = await fetch(this.apiURL + '/termine');
    return response.json();
  }

  async legeTerminAn(termin: Omit<Termin, '_id'>): Promise<Termin> {
    const response = await fetch(this.apiURL + '/termine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(termin),
    });
    return response.json();
  }

  async aktualisiereTermin(id: string, aenderungen: Partial<Termin>): Promise<Termin> {
    const response = await fetch(this.apiURL + '/termine/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aenderungen),
    });
    return response.json();
  }

  async loescheTermin(id: string): Promise<void> {
    await fetch(this.apiURL + '/termine/' + id, { method: 'DELETE' });
  }

  // CRUD: Vorsorgetyp

  async getAlleVorsorgeTypen(): Promise<VorsorgeTyp[]> {
    const response = await fetch(this.apiURL + '/vorsorgetypen');
    return response.json();
  }

  async legeVorsorgeTypAn(typ: Omit<VorsorgeTyp, '_id'>): Promise<VorsorgeTyp> {
    const response = await fetch(this.apiURL + '/vorsorgetypen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(typ),
    });
    return response.json();
  }

  async loescheVorsorgeTyp(id: string): Promise<void> {
    await fetch(this.apiURL + '/vorsorgetypen/' + id, { method: 'DELETE' });
  }
}