import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserBackend } from '../../lib/shared/backendServices/user-backend';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})

export class Signup {
  private bs = inject(UserBackend);
  private router = inject(Router);

  vornameControl = new FormControl('');
  nachnameControl = new FormControl('');
  emailControl = new FormControl('');
  passwordControl = new FormControl('');

  gespeichert = signal(false);  //Als Signal, da zuvor Messages nicht eingeblendet wurden
  speicherFehler = signal(false);
  userExistiert = signal(false);

  async create(): Promise<void> {
    console.log('CREATE wurde aufgerufen');
    if (!this.isValid()) return;

    const newUser = {
      firstname: this.vornameControl.value || '',
      lastname: this.nachnameControl.value || '',
      email: this.emailControl.value || '',
      password: this.passwordControl.value || '',
    };

    try {
      const gespeicherterUser = await this.bs.legeUserAn(newUser);
      console.log('User angelegt:', gespeicherterUser);
      this.gespeichert.set(true);
      this.speicherFehler.set(false);
      //this.router.navigate(['/user']);  //Sobald Daten eingegeben, wird in User-Bereich geleitet
    } catch (fehler) {
      console.error('Registrierung fehlgeschlagen:', fehler);
      this.gespeichert.set(false);
      this.speicherFehler.set(false);
      this.userExistiert.set(false);

      if (fehler instanceof Error && fehler.message === 'Die Email verfügt bereits über ein Nutzerkonto') {
        this.userExistiert.set(true);
      } else {
        this.speicherFehler.set(true);
      }
    }
  }

  isValid(): boolean {
    return this.vornameControl.value != '' &&
      this.nachnameControl.value != '' &&
      this.emailControl.value != '' &&
      this.passwordControl.value != '';
  }

}