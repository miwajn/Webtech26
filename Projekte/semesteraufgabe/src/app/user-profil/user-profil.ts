import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
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

  vornameControl = new FormControl('');
  nachnameControl = new FormControl('');
  emailControl = new FormControl('');
  passwordControl = new FormControl('');

  ladeFehler = false;

  ngOnInit(): void {
    const user = this.auth.getUser();

    if (!user) {
      console.error('Kein eingeloggter User gefunden.');
      this.ladeFehler = true;
      return;
    }

    // Vorhandene Daten ins Formular vorbelegen
    this.vornameControl.setValue(user.firstname);
    this.nachnameControl.setValue(user.lastname);
    this.emailControl.setValue(user.email);
    // Passwort bleibt bewusst leer - wird nur geändert, wenn explizit ausgefüllt
  }

  private zeigeBestaetigung(headline: string, info: string) {
    return this.dialog.open(ConfirmUser, {
      data: { headline, info } as ConfirmDialogData,
      panelClass: 'user-dialogfeld',
    });
  }

  async profilAktualisieren(): Promise<void> {
    const userId = this.auth.getUser()?._id;
    if (!userId) {
      console.error('Kein eingeloggter User gefunden.');
      return;
    }

    const aenderungen: Partial<UserModel> = {};
    if (this.vornameControl.value) aenderungen.firstname = this.vornameControl.value;
    if (this.nachnameControl.value) aenderungen.lastname = this.nachnameControl.value;
    if (this.emailControl.value) aenderungen.email = this.emailControl.value;
    if (this.passwordControl.value) aenderungen.password = this.passwordControl.value;

    if (Object.keys(aenderungen).length === 0) return;

    try {
      const aktualisierterUser = await this.bsUser.aktualisiereUser(userId, aenderungen);
      this.auth.setUser(aktualisierterUser);

      this.passwordControl.reset('');

      this.zeigeBestaetigung('Profil aktualisiert', 'Deine Daten wurden erfolgreich aktualisiert.');
    } catch (fehler) {
      console.error('Profil-Update fehlgeschlagen:', fehler);
      this.zeigeBestaetigung('Fehler', 'Deine Daten konnten nicht aktualisiert werden. Bitte erneut versuchen.');
    }
  }
}