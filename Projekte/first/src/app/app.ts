import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Nav } from './nav/nav';
import { Main } from './main/main';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Nav, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('first');
}
