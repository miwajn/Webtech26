import { Injectable } from '@angular/core';
import { Termin } from '../interfaces/terminInterface';

@Injectable({
  providedIn: 'root',
})

export class TerminBackend {
  apiURL = 'http://localhost:3000'

  // Termine (CRUD)

  // Lädt nur die Termine eines bestimmten Users
  async getAlleTermine(userId: string): Promise<Termin[]> {
    let response = await fetch(this.apiURL + '/termine?userId=' + encodeURIComponent(userId));
    let termine = await response.json();
    console.log('Termine (getAlleTermine) : ', termine)
    return termine;
  }

  async getEinenTermin(id: string): Promise<Termin> {
    let response = await fetch(this.apiURL + '/termine/' + id);
    let termin = await response.json();
    console.log('Termin (getEinenTermine) : ', termin)
    return termin;
  }

  async legeTerminAn(neuerTermin: Termin): Promise<Termin> {
    let response = await fetch(this.apiURL + '/termine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(neuerTermin),
    });

    if (!response.ok) {
      let fehler = await response.json();
      console.error('Fehler vom Backend:', fehler);
      throw new Error(fehler.error || 'Termin konnte nicht gespeichert werden.');
    }
    let termin = await response.json();
    console.log('Termin (legeTerminAn) : ', termin)
    return termin;
  }

  async aktualisiereTermin(id: string, aenderungen: Partial<Termin>): Promise<Termin> {
    let response = await fetch(this.apiURL + '/termine/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aenderungen),
    });
    let termin = await response.json();
    console.log('Termin (aktualisiereTermin) : ', termin)
    return termin;
  }

  async loescheTermin(id: string): Promise<{ message: string }> {
    let response = await fetch(this.apiURL + '/termine/' + id, { method: 'DELETE' });
    let message = await response.json();
    console.log('Termin (loescheTermin) : ', message)
    return message;
  }
}