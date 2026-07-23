import { Injectable } from '@angular/core';
import { VorsorgeTyp } from '../interfaces/vorsorgeTypInterface';

@Injectable({
  providedIn: 'root',
})

export class VorsorgeTypBackend {
  apiURL = 'http://localhost:3000'

  // Eigene Vorsorgetypen (CRUD)

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