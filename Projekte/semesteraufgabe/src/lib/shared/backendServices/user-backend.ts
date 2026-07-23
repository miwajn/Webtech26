import { Injectable } from '@angular/core';
import { User } from '../interfaces/userInterface';

@Injectable({
  providedIn: 'root',
})
export class UserBackend {
  apiURL = 'http://localhost:3000'

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

}
