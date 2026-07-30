import { Component, inject, OnInit } from '@angular/core';
import { TerminBackend } from '../../lib/shared/backendServices/termin-backend';
import { Termin } from "../../lib/shared/interfaces/terminInterface"
import { STANDARD_VORSORGE_TYPEN, VorsorgeTypStandard } from '../../lib/shared/standardVorsorgeTypen';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

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
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule], //ngFor, ngIf (Common) + ngModel (Forms)
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements OnInit{

  private bsTermin = inject(TerminBackend);
  // private bsVorsorgetyp = inject(VorsorgeTypBackend);

  emailControl = new FormControl('');
  passwordControl = new FormControl('');

  // Fest eingebaute Vorsorgearten - kommen jetzt aus der gemeinsamen Konstante,
  // damit user.ts und table.ts dieselbe Liste verwenden (nicht mehr aus der DB)
  standardTypen: VorsorgeTypStandard[] = STANDARD_VORSORGE_TYPEN;

  // eigeneTypen: VorsorgeTypStandard[] = [];
  termine: Termin[] = [];

  // Zustand des Formulars
  ausgewaehlterTypId = this.standardTypen[0].id;
  // zeigeNeueArt = false;
  // neuerTypName = '';
  // neuerTypMonate = 12;
  datum = this.heuteAlsText();
  notiz = '';
  justSaved = false;
  speicherFehler = false;
  ladeFehler = false;

  heute = this.heuteAlsText();

  ngOnInit(): void {
    this.ladeDaten();
  }

  // Gibt die (fest vorgegebenen) Vorsorgearten zurück
  alleTypen(): VorsorgeTypStandard[] {
    // return this.standardTypen.concat(this.eigeneTypen);
    return this.standardTypen;
  }

  // ---------------------------------------------------------------------
  // Laden vom Backend (Express + MongoDB via Mongoose)
  // ---------------------------------------------------------------------

  private async ladeDaten(): Promise<void> {
    try {
      // const [termineVomBackend, typenVomBackend] = await Promise.all([
      //   this.bsTermin.getAlleTermine(),
      //   this.bsVorsorgetyp.getAlleVorsorgeTypen(),
      // ]);
      const termineVomBackend = await this.bsTermin.getAlleTermine();

      this.termine = termineVomBackend;

      // this.eigeneTypen = typenVomBackend.map((typ) => ({
      //   id: typ.id,
      //   name: typ.name,
      //   monate: typ.monate,
      //   icon: typ.icon,
      // }));

      this.ladeFehler = false;
    } catch (fehler) {
      console.error('Daten konnten nicht geladen werden:', fehler);
      this.ladeFehler = true;
    }
  }

  // ---------------------------------------------------------------------
  // Hilfsfunktionen für Datum
  // ---------------------------------------------------------------------

  private heuteAlsText(): string {
    return new Date().toISOString().slice(0, 10);
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

  // ---------------------------------------------------------------------
  // Neuen Termin eintragen (POST ans Backend)
  // ---------------------------------------------------------------------

  async terminHinzufuegen(): Promise<void> {
    if (!this.datum) return;

    let typId = this.ausgewaehlterTypId;

    try {
      // Eigene Vorsorgeart anlegen - deaktiviert, es gibt nur noch die vorgegebenen Typen
      // if (this.zeigeNeueArt) {
      //   const name = this.neuerTypName.trim();
      //   if (name === '') return;
      //
      //   const neuerTypVomBackend = await this.bsVorsorgetyp.legeVorsorgeTypAn({
      //     id: name,
      //     name: name,
      //     monate: Math.max(1, Number(this.neuerTypMonate) || 12),
      //     icon: 'bi-calendar3',
      //   });
      //
      //   const neuerTyp: VorsorgeTypStandard = {
      //     id: neuerTypVomBackend.id,
      //     name: neuerTypVomBackend.name,
      //     monate: neuerTypVomBackend.monate,
      //     icon: neuerTypVomBackend.icon,
      //   };
      //   this.eigeneTypen.push(neuerTyp);
      //   typId = neuerTyp.id;
      //
      //   // Formular für die neue Art wieder zurücksetzen
      //   this.neuerTypName = '';
      //   this.neuerTypMonate = 12;
      //   this.zeigeNeueArt = false;
      //   this.ausgewaehlterTypId = typId;
      // }

      // Danach den eigentlichen Termin speichern
      const neuerTerminVomBackend = await this.bsTermin.legeTerminAn({
        typId: typId,
        datum: this.datum,
        notiz: this.notiz.trim(),
      });

      this.termine.push(neuerTerminVomBackend);

      this.speicherFehler = false;
      this.notiz = '';
      this.zeigeKurzeErfolgsmeldung();
    } catch (fehler) {
      console.error('Speichern fehlgeschlagen:', fehler);
      this.speicherFehler = true;
    }
  }

  private zeigeKurzeErfolgsmeldung(): void {
    this.justSaved = true;
    setTimeout(() => {
      this.justSaved = false;
    }, 1800);
  }

  // ---------------------------------------------------------------------
  // Termin löschen (DELETE ans Backend)
  // ---------------------------------------------------------------------

  async terminLoeschen(_id: string): Promise<void> {
    try {
      await this.bsTermin.loescheTermin(_id);
      this.termine = this.termine.filter((termin) => termin._id !== _id);
    } catch (fehler) {
      console.error('Löschen fehlgeschlagen:', fehler);
      this.speicherFehler = true;
    }
  }

  // ---------------------------------------------------------------------
  // Daten fürs Template aufbereiten (unverändert)
  // ---------------------------------------------------------------------

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