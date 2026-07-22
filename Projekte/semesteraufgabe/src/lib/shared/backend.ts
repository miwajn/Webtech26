import { Injectable } from '@angular/core';
import { User } from './user';
import { Termin } from './termin';
import { VorsorgeTyp } from './vorsorge-typ';

@Injectable({
  providedIn: 'root',
})

export class Backend {
  apiURL = 'http://localhost:3000'

  constructor() { } // Überflüssig 

  // User (CRUD)

  async getAll(): Promise<User[]> { // Alle Einträge werden angefragt
    let response = await fetch(this.apiURL + '/user'); 
    let users = await response.json();
    console.log('Users in service (getAll) : ', users)
    return users;
  }

  async getOne(id: string): Promise<User> {
    let response = await fetch(this.apiURL + '/user/' + id);
    let user = await response.json();
    console.log('User in service (getOne) : ', user)
    return user;
  }

  async legeUserAn(user: User): Promise<User> {
    let response = await fetch(this.apiURL + '/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // Für Funktion nicht erforderlich
      body: JSON.stringify(user),
    });
    let neuerUser = await response.json();
    console.log('User in service (legeUserAn) : ', neuerUser)
    return neuerUser;
  }

  async aktualisiereUser(id: string, aenderungen: Partial<User>): Promise<User> {
    let response = await fetch(this.apiURL + '/user/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aenderungen),
    });
    let user = await response.json();
    console.log('User in service (aktualisiereUser) : ', user)
    return user;
  }

  async loescheUser(id: string): Promise<void> {
    await fetch(this.apiURL + '/user/' + id, { method: 'DELETE' });
  }

  async login(email: string, password: string): Promise<{ message: string; user?: User }> {
    let response = await fetch(this.apiURL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    let ergebnis = await response.json();
    console.log('Ergebnis in service (login) : ', ergebnis)
    if (!response.ok) {
      throw new Error(ergebnis.error || 'Login fehlgeschlagen.');
    }
    return ergebnis;
  }

  // Termine (CRUD)
  

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

  // Eigene Vorsorgearten (CRUD)

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