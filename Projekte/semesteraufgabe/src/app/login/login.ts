import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; //Für Login
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  passwort: string = '';

  constructor(private router: Router) {}  // Erzeugung privaten Zugang

  login(): void {
    if (this.email === 'test@medcycle.de' && this.passwort === '1234') {
      this.router.navigate(['/user']);
    } else {
      alert('E-Mail oder Passwort falsch.');
    }
  }
}