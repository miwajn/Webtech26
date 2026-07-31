import { Component, inject, OnInit, signal } from '@angular/core';
import { TerminBackend } from '../../lib/shared/backendServices/termin-backend';
import { Termin } from '../../lib/shared/interfaces/terminInterface';
import { STANDARD_VORSORGE_TYPEN, VorsorgeTypStandard } from '../../lib/shared/standardVorsorgeTypen';
import { Auth } from '../../lib/shared/auth';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'medCycle-table',
  standalone: true,
  imports: [CommonModule, RouterLink], //ngFor, ngIf (Common) + ngModel (Forms)
  templateUrl: './table.html',
  styleUrl: './table.css',
})


export class Table implements OnInit {

  private bsTermin = inject(TerminBackend);
  private auth = inject(Auth);

  termine = signal<Termin[]>([]); // Deklaration mit Signal

  // Feste Vorsorgearten kommen jetzt aus der gemeinsamen Konstante,
  // nicht mehr aus der (leeren) DB-Collection
  vorsorgeTypen: VorsorgeTypStandard[] = STANDARD_VORSORGE_TYPEN;

  termin: Termin | null = null;
  deleteStatus: boolean = false;

  async ngOnInit(): Promise<void> {
    const userId = this.auth.getUser()?._id;
    if (!userId) {
      console.error('Kein eingeloggter User gefunden.');
      return;
    }

    const termine = await this.bsTermin.getAlleTermine(userId);
    this.termine.set(termine);

    console.log('Termine:', this.termine());
  }

  // Hilfsfunktion - gibt einen Fallback zurück statt zu werfen,
  // damit ein einzelner unbekannter Typ nicht die ganze Zeile leer rendert
  getVorsorgeTyp(typId: string): VorsorgeTypStandard {
    const typ = this.vorsorgeTypen.find((typ) => typ.id === typId);
    if (!typ) {
      console.error(`Vorsorgetyp ${typId} wurde nicht gefunden.`);
      return { id: typId, name: 'Unbekannter Termin', monate: 0, icon: 'bi-question-circle' };
    }
    return typ;
  }

  naechsteVorsorge(termin: Termin): string {
    const typ = this.getVorsorgeTyp(termin.typId);

    if (!typ) {
      return '-';
    }

    const datum = new Date(termin.datum);
    datum.setMonth(datum.getMonth() + typ.monate);

    return datum.toLocaleDateString('de-DE');
  }

  // Wandelt das intern gespeicherte yyyy-mm-dd fürs Anzeigen in dd.mm.yyyy um
  formatiereDatum(datumText: string): string {
    return new Date(datumText).toLocaleDateString('de-DE');
  }

  delete(id: string | undefined): void {
    if (!id) return;

    const gefunden = this.termine().find((t) => t._id === id);
    if (!gefunden) return;

    this.termin = gefunden;      // merken, welcher Termin gelöscht werden soll
    this.deleteStatus = true;    // Bestätigungsdialog anzeigen
  }

  async confirm(): Promise<void> {
    if (!this.termin?._id) return;
    const id = this.termin._id;

    try {
      await this.bsTermin.loescheTermin(id);
      console.log('Termin erfolgreich gelöscht.');

      this.deleteStatus = false;
      this.termin = null;

      const userId = this.auth.getUser()?._id;
      if (userId) {
        const response = await this.bsTermin.getAlleTermine(userId);
        this.termine.set(response); //Signal aktualisieren
      }

    } catch (fehler) {
      console.error('Löschen fehlgeschlagen:', fehler);
    }
  }

  cancel() {
    this.termin = null;
    this.deleteStatus = false;
  }
}