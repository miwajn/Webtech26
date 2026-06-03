import { Component } from '@angular/core';
import { Eins } from './eins/eins';
import { Zwei } from './zwei/zwei';

@Component({
  selector: 'app-main',
  imports: [Eins, Zwei],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
