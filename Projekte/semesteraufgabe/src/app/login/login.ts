import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Backend } from '../../lib/shared/backend';

@Component({
  selector: 'app-login',
  standalone: true,   //standalone: true + imports: gehören zusammen. Eins ohne das andere funktioniert nicht richtig.
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private bs = inject(Backend);
  private router = inject(Router);

  emailControl = new FormControl('', Validators.required);
  passwordControl = new FormControl('', Validators.required);

  loginFehler = signal(false);  //Zuvor hat bei falschem Login nicht die Fehlermeldung eingeblendte, erst nach zweitem Klick

  async login(): Promise<void> {
    if (!this.isValid()) return;

    const email = this.emailControl.value || '';
    const password = this.passwordControl.value || '';

    try {
      const ergebnis = await this.bs.login(email, password);
      console.log('Login erfolgreich:', ergebnis);
      this.loginFehler.set(false);
      this.router.navigate(['/user']);
    } catch (fehler) {
      console.error('Login fehlgeschlagen:', fehler);
      this.loginFehler.set(true);
    }
  }

  isValid(): boolean {
    return this.emailControl.value != '' && this.passwordControl.value != '';
  }

}