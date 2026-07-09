
import { Component, inject, OnInit } from '@angular/core';
import { Backend } from '../../lib/shared/backend';
import { User as UserModel} from '../../lib/shared/user';
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

  private bs = inject(Backend);
  users: UserModel[] = [];
  
  userName = 'Alex';

  // Fest eingebaute Vorsorgearten
  standardTypen: VorsorgeTyp[] = [
    { id: 'krebs', name: 'Krebsfrüherkennung', monate: 12, icon: 'bi-eye' },
    { id: 'haut', name: 'Hautkrebs-Screening', monate: 24, icon: 'bi-sun' },
    { id: 'brust', name: 'Mammographie-Screening', monate: 24, icon: 'bi-sun' },
    { id: 'checkup', name: 'Gesundheits-Check-up', monate: 36, icon: 'bi-heart-pulse' },
    { id: 'zahn', name: 'Zahnvorsorge', monate: 6, icon: 'bi-emoji-smile' }, 
    { id: 'impfung', name: 'Schutzimpfung', monate: 24, icon: 'bi-eye' },    // Zeit noch rausnehmen
    { id: 'schwanger', name: 'Schwangerschaft', monate: 12, icon: 'bi-gender-female' }, // Zeit noch rausnehmen
    { id: 'chlamydien', name: 'Chlamydien-Screening', monate: 12, icon: 'bi-eye' }, // Bedingung ergänzen: Geschlecht + Alter (<=25)
    { id: 'urologie', name: 'Aneurysmen-Früherkennung', monate: 12, icon: 'bi-gender-male' }, // Bedingung ergänzen: Geschlecht + Alter (>=65)
    { id: 'u18', name: 'Kinder und Jugendliche', monate: 12, icon: 'bi-gender-male' },    
  ];

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

  heute = this.heuteAlsText();

  private speicherSchluessel = 'vorsorgepass-daten';

  // Nur EIN ngOnInit pro Klasse: beides zusammengeführt
  ngOnInit(): void {
    this.bs
      .getAll()
      .then((response) => (this.users = response))
      .then((users) => console.log('users in UserComponent: ', users));

    this.ladeDaten();
  }

  // Gibt Standard- und eigene Typen zusammen zurück
  alleTypen(): VorsorgeTyp[] {
    return this.standardTypen.concat(this.eigeneTypen);
  }

  // ---------------------------------------------------------------------
  // Speichern und Laden (localStorage)
  // ---------------------------------------------------------------------

  private ladeDaten(): void {
    const gespeichert = localStorage.getItem(this.speicherSchluessel);
    if (gespeichert === null) return;

    try {
      const daten = JSON.parse(gespeichert);
      this.termine = daten.termine || [];
      this.eigeneTypen = daten.eigeneTypen || [];
    } catch (fehler) {
      console.error('Gespeicherte Daten konnten nicht gelesen werden:', fehler);
    }
  }

  private speichereDaten(): boolean {
    try {
      const daten = { termine: this.termine, eigeneTypen: this.eigeneTypen };
      localStorage.setItem(this.speicherSchluessel, JSON.stringify(daten));
      return true;
    } catch (fehler) {
      console.error('Speichern fehlgeschlagen:', fehler);
      return false;
    }
  }

  // ---------------------------------------------------------------------
  // Hilfsfunktionen für Datum und ID
  // ---------------------------------------------------------------------

  private neueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

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
  // Neuen Termin eintragen
  // ---------------------------------------------------------------------

  terminHinzufuegen(): void {
    if (!this.datum) return;

    let typId = this.ausgewaehlterTypId;

    if (this.zeigeNeueArt) {
      const name = this.neuerTypName.trim();
      if (name === '') return;

      const neuerTyp: VorsorgeTyp = {
        id: this.neueId(),
        name: name,
        monate: Math.max(1, Number(this.neuerTypMonate) || 12),
        icon: 'bi-calendar3',
      };
      this.eigeneTypen.push(neuerTyp);
      typId = neuerTyp.id;

      // Formular für die neue Art wieder zurücksetzen
      this.neuerTypName = '';
      this.neuerTypMonate = 12;
      this.zeigeNeueArt = false;
      this.ausgewaehlterTypId = typId;
    }

    this.termine.push({
      id: this.neueId(),
      typId: typId,
      datum: this.datum,
      notiz: this.notiz.trim(),
    });

    this.speicherFehler = !this.speichereDaten();
    this.notiz = '';
    this.zeigeKurzeErfolgsmeldung();
  }

  private zeigeKurzeErfolgsmeldung(): void {
    this.justSaved = true;
    setTimeout(() => {
      this.justSaved = false;
    }, 1800);
  }

  // ---------------------------------------------------------------------
  // Termin löschen
  // ---------------------------------------------------------------------

  terminLoeschen(id: string): void {
    this.termine = this.termine.filter((termin) => termin.id !== id);
    this.speichereDaten();
  }

  // ---------------------------------------------------------------------
  // Daten fürs Template aufbereiten
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

  // Alle Termine, neuester zuerst, mit Name und Emoji der Vorsorgeart
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