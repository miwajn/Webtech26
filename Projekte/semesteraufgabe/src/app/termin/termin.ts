import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminBackend } from '../../lib/shared/backendServices/termin-backend';
import { Termin } from '../../lib/shared/interfaces/terminInterface';
import { STANDARD_VORSORGE_TYPEN, VorsorgeTypStandard } from '../../lib/shared/standardVorsorgeTypen';

@Component({
  selector: 'app-termin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './termin.html',
  styleUrl: './termin.css'
})
export class TerminComponent implements OnInit {

  private bsTermin = inject(TerminBackend);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  termin = signal<Termin | null>(null);

  datum = '';
  notiz = '';

  gespeichert = false;
  speicherFehler = false;

  vorsorgeTypen: VorsorgeTypStandard[] = STANDARD_VORSORGE_TYPEN;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('Keine Termin-ID vorhanden.');
      return;
    }

    this.ladeTermin(id);
  }

  async ladeTermin(id: string): Promise<void> {
    try {
      const termin = await this.bsTermin.getEinenTermin(id);

      this.termin.set(termin);
      this.datum = termin.datum;
      this.notiz = termin.notiz;

    } catch (fehler) {
      console.error('Termin konnte nicht geladen werden:', fehler);
    }
  }

  getVorsorgeTyp(typId: string): VorsorgeTypStandard {
    const typ = this.vorsorgeTypen.find((typ) => typ.id === typId);

    if (!typ) {
      throw new Error(`Vorsorgetyp ${typId} wurde nicht gefunden.`);
    }

    return typ;
  }

  async update(): Promise<void> {
    const aktuellerTermin = this.termin();

    if (!aktuellerTermin?._id || !this.datum) {
      return;
    }

    try {
      const aktualisierterTermin = await this.bsTermin.aktualisiereTermin(
        aktuellerTermin._id,
        {
          datum: this.datum,
          notiz: this.notiz.trim()
        }
      );

      this.termin.set(aktualisierterTermin);

      this.gespeichert = true;
      this.speicherFehler = false;

      console.log('Termin erfolgreich aktualisiert:', aktualisierterTermin);

    } catch (fehler) {
      console.error('Aktualisierung fehlgeschlagen:', fehler);
      this.speicherFehler = true;
      this.gespeichert = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/table']);
  }
}