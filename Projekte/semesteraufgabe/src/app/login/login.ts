import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Backend } from '../../lib/shared/backend';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private bs = inject(Backend);
  private router = inject(Router);

  emailControl = new FormControl('', Validators.required);
  passwordControl = new FormControl('', Validators.required);

  loginFehler = false;

  async login(): Promise<void> {
    if (!this.isValid()) return;

    const email = this.emailControl.value || '';
    const password = this.passwordControl.value || '';

    try {
      const ergebnis = await this.bs.login(email, password);
      console.log('Login erfolgreich:', ergebnis);
      this.loginFehler = false;
      this.router.navigate(['/user']);
    } catch (fehler) {
      console.error('Login fehlgeschlagen:', fehler);
      this.loginFehler = true;
    }
  }

  isValid(): boolean {
    return this.emailControl.value != '' && this.passwordControl.value != '';
  }

}