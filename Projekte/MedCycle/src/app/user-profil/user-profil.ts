import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { UserBackend } from '../../lib/shared/backendServices/user-backend';
import { User as UserModel } from '../../lib/shared/interfaces/userInterface';
import { Auth } from '../../lib/shared/auth';
import { ConfirmUser, ConfirmDialogData } from '../user/confirm-user/confirm-user';

@Component({
  selector: 'app-user-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-profil.html',
  styleUrl: './user-profil.css',
})
export class UserProfil implements OnInit {

  private bsUser = inject(UserBackend);
  private auth = inject(Auth);
  private dialog = inject(MatDialog);

  // FormGroup statt einzelner, loser FormControls - dadurch übernimmt
  // FormGroupDirective (aus ReactiveFormsModule) das Abfangen von (ngSubmit).
  profilForm = new FormGroup({
    vorname: new FormControl(''),
    nachname: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)  // Ohne diesen Zusatz war eine Registrierung z.B. mit a@b möglich
    ]),
    password: new FormControl(''),
  });

  ladeFehler = false;

  ngOnInit(): void {
    const user = this.auth.getUser();

    if (!user) {
      console.error('Kein eingeloggter User gefunden.');
      this.ladeFehler = true;
      return;
    }

    // Vorhandene Daten ins Formular vorbelegen
    this.profilForm.patchValue({
      vorname: user.firstname,
      nachname: user.lastname,
      email: user.email,
      // Passwort bleibt bewusst leer - wird nur geändert, wenn explizit ausgefüllt
    });
  }

  private zeigeBestaetigung(headline: string, info: string) {
    return this.dialog.open(ConfirmUser, {
      data: { headline, info } as ConfirmDialogData,
      panelClass: 'user-dialogfeld',
    });
  }

  async profilAktualisieren(): Promise<void> {
    console.log('profilAktualisieren() wurde aufgerufen.');

    const userId = this.auth.getUser()?._id;
    if (!userId) {
      console.error('Kein eingeloggter User gefunden.');
      return;
    }

    const werte = this.profilForm.value;

    const aenderungen: Partial<UserModel> = {};
    if (werte.vorname) aenderungen.firstname = werte.vorname;
    if (werte.nachname) aenderungen.lastname = werte.nachname;
    if (werte.email) aenderungen.email = werte.email;
    if (werte.password) aenderungen.password = werte.password;

    console.log('userId:', userId, 'aenderungen:', aenderungen);

    if (Object.keys(aenderungen).length === 0) {
      console.warn('Keine Änderungen erkannt - Abbruch vor dem Request.');
      return;
    }

    try {
      const aktualisierterUser = await this.bsUser.aktualisiereUser(userId, aenderungen);
      this.auth.setUser(aktualisierterUser);

      this.profilForm.patchValue({ password: '' });

      this.zeigeBestaetigung('Profil aktualisiert', 'Deine Daten wurden erfolgreich aktualisiert.');
    } catch (fehler) {
      console.error('Profil-Update fehlgeschlagen:', fehler);
      this.zeigeBestaetigung('Fehler', 'Deine Daten konnten nicht aktualisiert werden. Bitte erneut versuchen.');
    }
  }
}