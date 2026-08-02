import { Component, inject, OnInit } from '@angular/core';
import { TerminBackend } from '../../lib/shared/backendServices/termin-backend';
import { Termin } from "../../lib/shared/interfaces/terminInterface"
// import { VorsorgeTypBackend } from '../../lib/shared/backendServices/vorsorge-typ-backend';
import { STANDARD_VORSORGE_TYPEN, VorsorgeTypStandard } from '../../lib/shared/standardVorsorgeTypen';
import { Auth } from '../../lib/shared/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmUser, ConfirmDialogData } from './confirm-user/confirm-user';

// So sieht ein Eintrag in der Übersicht aus (eine Karte pro Vorsorgeart)
type UebersichtEintrag = {
  typ: VorsorgeTypStandard;
  letzterTermin: Termin | null;
  naechsterTerminText?: string;
  status?: string;
  farbe?: string;
  prozent?: number;
  tageText?: string;
};

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], //ngFor, ngIf (Common) + ngModel (Forms)
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements OnInit {

  private bsTermin = inject(TerminBackend);
  // private bsVorsorgetyp = inject(VorsorgeTypBackend);
  private auth = inject(Auth);
  private dialog = inject(MatDialog);

  // Fest eingebaute Vorsorgearten - kommen jetzt aus der gemeinsamen Konstante,
  // damit user.ts und table.ts dieselbe Liste verwenden (nicht mehr aus der DB)
  standardTypen: VorsorgeTypStandard[] = STANDARD_VORSORGE_TYPEN;

  termine: Termin[] = [];

  // Zustand des Formulars
  ausgewaehlterTypId = this.standardTypen[0].id;
  datum = this.heuteAlsText();
  notiz = '';
  ladeFehler = false;

  heute = this.heuteAlsText();
  minDatum = this.addiereMonate(this.heute, -36) //Datum bis max. 3 Jahre zurück
    .toISOString()
    .slice(0, 10);
  maxDatum = this.addiereMonate(this.heute, 36) //Datum bis max. 3 Jahre in Zukunft
    .toISOString()
    .slice(0, 10);

  ngOnInit(): void {
    this.ladeDaten();
  }

  // Gibt die (fest vorgegebenen) Vorsorgearten zurück
  alleTypen(): VorsorgeTypStandard[] {
    // return this.standardTypen.concat(this.eigeneTypen);
    return this.standardTypen;
  }

  // Laden vom Backend (Express + MongoDB via Mongoose)

  private async ladeDaten(): Promise<void> {
    const userId = this.auth.getUser()?._id;
    if (!userId) {
      console.error('Kein eingeloggter User gefunden.');
      this.ladeFehler = true;
      return;
    }

    try {
      const termineVomBackend = await this.bsTermin.getAlleTermine(userId);

      this.termine = termineVomBackend;
      this.ladeFehler = false;
    } catch (fehler) {
      console.error('Daten konnten nicht geladen werden:', fehler);
      this.ladeFehler = true;
    }
  }

  // Hilfsfunktionen für Datum

  private heuteAlsText(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private zeigeBestaetigung(headline: string, info: string) {
    return this.dialog.open(ConfirmUser, {
      data: { headline, info } as ConfirmDialogData,
    });
  }

  formatiereDatum(datumText: string): string {
    return new Date(datumText).toLocaleDateString('de-DE');
  }

  private addiereMonate(datumText: string, monate: number): Date {
    const datum = new Date(datumText);
    datum.setMonth(datum.getMonth() + monate);
    return datum;
  }

  private tageZwischen(a: Date, b: Date): number {
    const millisekundenProTag = 1000 * 60 * 60 * 24;
    return Math.round((a.getTime() - b.getTime()) / millisekundenProTag);
  }

  // Neuen Termin eintragen (POST ans Backend)

  async terminHinzufuegen(): Promise<void> {
    if (!this.datum) return;

    const userId = this.auth.getUser()?._id;
    if (!userId) {
      console.error('Kein eingeloggter User gefunden.');
      this.zeigeBestaetigung('Fehler', 'Du bist nicht eingeloggt. Bitte melde dich erneut an.');
      return;
    }

    let typId = this.ausgewaehlterTypId;

    try {
      const neuerTerminVomBackend = await this.bsTermin.legeTerminAn({
        userId: userId,
        typId: typId,
        datum: this.datum,
        notiz: this.notiz.trim(),
      });

      this.termine.push(neuerTerminVomBackend);

      this.notiz = '';
      this.zeigeBestaetigung('Termin gespeichert', 'Der Termin wurde erfolgreich eingetragen.');
    } catch (fehler) {
      console.error('Speichern fehlgeschlagen:', fehler);
      this.zeigeBestaetigung('Fehler', 'Der Termin konnte nicht gespeichert werden. Bitte erneut versuchen.');
    }
  }

  // Daten fürs Template aufbereiten 
  
  // Eine Karte pro Vorsorgeart, mit Status, Fortschritt und Text
  uebersicht(): UebersichtEintrag[] {
    const heute = new Date();

    return this.alleTypen().map((typ) => {
      const terminZuTyp = this.termine
        .filter((t) => t.typId === typ.id)
        .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());

      const letzterTermin = terminZuTyp[0] ?? null;

      if (letzterTermin === null) {
        return { typ, letzterTermin: null };
      }

      const letztesDatum = new Date(letzterTermin.datum);
      const naechsterTermin = this.addiereMonate(letzterTermin.datum, typ.monate);
      const tageUebrig = this.tageZwischen(naechsterTermin, heute);

      let status = 'Aktuell';
      let farbe = 'success';
      if (tageUebrig < 0) {
        status = 'Überfällig';
        farbe = 'danger';
      } else if (tageUebrig <= 30) {
        status = 'Bald fällig';
        farbe = 'warning';
      }

      const tageGesamt = Math.max(1, this.tageZwischen(naechsterTermin, letztesDatum));
      const tageVergangen = this.tageZwischen(heute, letztesDatum);
      const prozent = Math.min(100, Math.max(0, Math.round((tageVergangen / tageGesamt) * 100)));

      const tageText =
        tageUebrig >= 0 ? `${tageUebrig} Tage übrig` : `${Math.abs(tageUebrig)} Tage überfällig`;

      return {
        typ,
        letzterTermin,
        naechsterTerminText: naechsterTermin.toISOString(),
        status,
        farbe,
        prozent,
        tageText,
      };
    });
  }
}