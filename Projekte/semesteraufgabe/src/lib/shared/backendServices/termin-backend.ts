import { Injectable } from '@angular/core';
import { Termin } from '../interfaces/terminInterface';

@Injectable({
  providedIn: 'root',
})

export class TerminBackend {
  apiURL = 'http://localhost:3000'

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
}
