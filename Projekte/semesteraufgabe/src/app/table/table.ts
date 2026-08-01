import { Component, inject, OnInit, signal } from '@angular/core';
import { TerminBackend } from '../../lib/shared/backendServices/termin-backend';
import { Termin } from '../../lib/shared/interfaces/terminInterface';
import { STANDARD_VORSORGE_TYPEN, VorsorgeTypStandard } from '../../lib/shared/standardVorsorgeTypen';
import { Auth } from '../../lib/shared/auth';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTable, DeleteTableData } from './delete-table/delete-table';

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
  private dialog = inject(MatDialog);

  termine = signal<Termin[]>([]); // Deklaration mit Signal

  // Feste Vorsorgearten kommen aus der gemeinsamen Konstante, nicht mehr aus der DB
  vorsorgeTypen: VorsorgeTypStandard[] = STANDARD_VORSORGE_TYPEN;

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

  // Öffnet den Bestätigungsdialog - löscht erst nach Bestätigung durch die Nutzerin
  delete(id: string | undefined): void {
    if (!id) return;

    const gefunden = this.termine().find((t) => t._id === id);
    if (!gefunden) return;

    const vorsorgeTyp = this.getVorsorgeTyp(gefunden.typId);

    const dialogRef = this.dialog.open(DeleteTable, {
      data: {
        headline: 'Termin löschen',
        info: `Wollen Sie den Termin "${vorsorgeTyp.name}" vom ${this.formatiereDatum(gefunden.datum)} wirklich löschen?`,
      } as DeleteTableData,
      panelClass: 'user-dialogfeld',
    });

    dialogRef.afterClosed().subscribe((bestaetigt) => {
      if (bestaetigt) {
        this.loescheTermin(id);
      }
    });
  }

  private async loescheTermin(id: string): Promise<void> {
    try {
      await this.bsTermin.loescheTermin(id);
      this.termine.update((liste) => liste.filter((t) => t._id !== id));
    } catch (fehler) {
      console.error('Löschen fehlgeschlagen:', fehler);
    }
  }
}