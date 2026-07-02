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
  password: string = '';

  constructor(private router: Router) {}  // Erzeugung privaten Zugang

  login(): void {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email, password: this.password })  //stringify wandelt JS-Objekt in JSON-String - HTML kann keine Objekte übertragen, nur Text
    })
    .then(res => {
      if (res.ok) {
        this.router.navigate(['/user']);
      } else {
        alert('E-Mail oder Passwort falsch.');
      }
    })
    .catch(() => alert('Server nicht erreichbar.'));  // Falls Backend nicht erreichbar
  }
}