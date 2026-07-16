import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Backend } from '../../lib/shared/backend';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})

export class Signup {
  private bs = inject(Backend);
  private router = inject(Router);

  vornameControl = new FormControl('', Validators.required);
  nachnameControl = new FormControl('');
  emailControl = new FormControl('');
  passwordControl = new FormControl('');

  speicherFehler = false;
  gespeichert = false;

  async create(): Promise<void> {
    if (!this.isValid()) return;

    // Feldnamen an dein Mongoose-Schema (firstname, lastname, ...) angepasst
    const newUser = {
      firstname: this.vornameControl.value || '',
      lastname: this.nachnameControl.value || '',
      email: this.emailControl.value || '',
      password: this.passwordControl.value || '',
    };

    try {
      const gespeicherterUser = await this.bs.legeUserAn(newUser);
      console.log('User angelegt:', gespeicherterUser);
      this.gespeichert = true;
      this.speicherFehler = false;
      this.router.navigate(['/user']);  //Sobald Daten eingegeben, wird in User-Bereich geleitet
    } catch (fehler) {
      console.error('Registrierung fehlgeschlagen:', fehler);
      this.speicherFehler = true;
    }
  }

  isValid(): boolean {
    return this.vornameControl.value != '' &&
      this.nachnameControl.value != '' &&
      this.emailControl.value != '' &&
      this.passwordControl.value != '';
  }

}