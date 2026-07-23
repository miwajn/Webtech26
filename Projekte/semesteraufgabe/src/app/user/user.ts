import { Component, inject, OnInit } from '@angular/core';
import { TerminBackend } from '../../lib/shared/backendServices/termin-backend';
import { VorsorgeTypBackend } from '../../lib/shared/backendServices/vorsorge-typ-backend';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Ein "Typ" ist eine Art von Vorsorgetermin, z. B. Zahnarzt
type VorsorgeTyp = {
  id: string;
  name: string;
  monate: number; // empfohlenes Intervall in Monaten
  icon: string; // Bootstrap-Icons
};

// Ein "Termin" ist ein einzelner, eingetragener Arztbesuch
type Termin = {
  id: string;
  typId: string;
  datum: string; // Format: JJJJ-MM-TT
  notiz: string;
};

// So sieht ein Eintrag in der Übersicht aus (eine Karte pro Vorsorgeart)
type UebersichtEintrag = {
  typ: VorsorgeTyp;
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
  imports: [CommonModule, FormsModule], //ngFor, ngIf (Common) + ngModel (Forms)
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements OnInit{

  private bsTermin = inject(TerminBackend);
  private bsVorsorgetyp = inject(VorsorgeTypBackend);
    
  userName = 'Alex';

  // Fest eingebaute Vorsorgearten
  standardTypen: VorsorgeTyp[] = [
    { id: 'krebs', name: 'Krebsfrüherkennung', monate: 12, icon: 'bi-eye-fill' },
    { id: 'haut', name: 'Hautkrebs-Screening', monate: 24, icon: 'bi-sun-fill' },
    { id: 'brust', name: 'Mammographie-Screening', monate: 24, icon: 'bi-clipboard-plus-fill' },
    { id: 'checkup', name: 'Gesundheits-Check-up', monate: 36, icon: 'bi-heart-pulse-fill' },
    { id: 'zahn', name: 'Zahnvorsorge', monate: 6, icon: 'bi-emoji-smile-fill' }, 
    { id: 'impfung', name: 'Schutzimpfung', monate: 24, icon: 'bi-shield-fill-plus' },    // Zeit noch rausnehmen
    { id: 'schwanger', name: 'Schwangerschaft', monate: 12, icon: 'bi-gender-female' }, // Zeit noch rausnehmen
    { id: 'chlamydien', name: 'Chlamydien-Screening', monate: 12, icon: 'bi-search-heart-fill' }, // Bedingung ergänzen: Geschlecht + Alter (<=25)
    { id: 'urologie', name: 'Aneurysmen-Früherkennung', monate: 12, icon: 'bi-gender-male' }, // Bedingung ergänzen: Geschlecht + Alter (>=65)
    { id: 'u18', name: 'Kinder und Jugendliche', monate: 12, icon: 'bi-file-person-fill' },    
  ];

  // Über Backend/ Mongo-DB
  eigeneTypen: VorsorgeTyp[] = [];
  termine: Termin[] = [];

  // Zustand des Formulars
  ausgewaehlterTypId = this.standardTypen[0].id;
  zeigeNeueArt = false;
  neuerTypName = '';
  neuerTypMonate = 12;
  datum = this.heuteAlsText();
  notiz = '';
  justSaved = false;
  speicherFehler = false;
  ladeFehler = false;

  heute = this.heuteAlsText();

  ngOnInit(): void {
    this.ladeDaten();
  }

  // Gibt Standard- und eigene Typen zusammen zurück
  alleTypen(): VorsorgeTyp[] {
    return this.standardTypen.concat(this.eigeneTypen);
  }

  // ---------------------------------------------------------------------
  // Laden vom Backend (Express + MongoDB via Mongoose)
  // ---------------------------------------------------------------------

  private async ladeDaten(): Promise<void> {
    try {
      const [termineVomBackend, typenVomBackend] = await Promise.all([
        this.bsTermin.getAlleTermine(),
        this.bsVorsorgetyp.getAlleVorsorgeTypen(),
      ]);

      // MongoDB liefert "_id" - wir mappen das intern auf "id",
      // damit das Template unverändert bleiben kann.
      this.termine = termineVomBackend.map((t) => ({
        id: t._id!,
        typId: t.typId,
        datum: t.datum,
        notiz: t.notiz,
      }));

      this.eigeneTypen = typenVomBackend.map((typ) => ({
        id: typ._id!,
        name: typ.name,
        monate: typ.monate,
        icon: typ.icon,
      }));

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
      // Falls eine neue, eigene Vorsorgeart angelegt wird: zuerst den Typ speichern
      if (this.zeigeNeueArt) {
        const name = this.neuerTypName.trim();
        if (name === '') return;

        const neuerTypVomBackend = await this.bsVorsorgetyp.legeVorsorgeTypAn({
          name: name,
          monate: Math.max(1, Number(this.neuerTypMonate) || 12),
          icon: 'bi-calendar3',
        });

        const neuerTyp: VorsorgeTyp = {
          id: neuerTypVomBackend._id!,
          name: neuerTypVomBackend.name,
          monate: neuerTypVomBackend.monate,
          icon: neuerTypVomBackend.icon,
        };
        this.eigeneTypen.push(neuerTyp);
        typId = neuerTyp.id;

        // Formular für die neue Art wieder zurücksetzen
        this.neuerTypName = '';
        this.neuerTypMonate = 12;
        this.zeigeNeueArt = false;
        this.ausgewaehlterTypId = typId;
      }

      // Danach den eigentlichen Termin speichern
      const neuerTerminVomBackend = await this.bsTermin.legeTerminAn({
        typId: typId,
        datum: this.datum,
        notiz: this.notiz.trim(),
      });

      this.termine.push({
        id: neuerTerminVomBackend._id!,
        typId: neuerTerminVomBackend.typId,
        datum: neuerTerminVomBackend.datum,
        notiz: neuerTerminVomBackend.notiz,
      });

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

  async terminLoeschen(id: string): Promise<void> {
    try {
      await this.bsTermin.loescheTermin(id);
      this.termine = this.termine.filter((termin) => termin.id !== id);
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

  // Alle Termine, neuester zuerst, mit Name und Icon der Vorsorgeart
  verlauf() {
    return [...this.termine]
      .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
      .map((termin) => {
        const typ = this.alleTypen().find((t) => t.id === termin.typId);
        return {
          ...termin,
          typName: typ ? typ.name : 'Unbekannter Termin',
          typIcon: typ ? typ.icon : 'bi-calendar3',
        };
      }
    );
  }
}
