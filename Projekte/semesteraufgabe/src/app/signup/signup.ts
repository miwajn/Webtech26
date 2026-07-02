import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})

export class Signup {
  vornameControl = new FormControl('', Validators.required);
  nachnameControl = new FormControl('');
  emailControl = new FormControl('');
  passwordControl = new FormControl('');


  create(): void {
    const vorname = this.vornameControl.value || '';
    const nachname = this.nachnameControl.value;
    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    const newUser = { vorname, nachname, email, password, name: () => { vorname + nachname } };

    console.log('Creating entry:', newUser);
  }

  isValid(): boolean {
    return this.vornameControl.value != '' &&
      this.nachnameControl.value != '' &&
      this.emailControl.value != '' &&
      this.passwordControl.value != '';
  }

}