import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  openCardIndex: number | null = null;  // null = keine Karte geöffnet

  toggle(event: MouseEvent, index: number): void {
    const cards = document.querySelectorAll('.vorsorge-card');
    cards.forEach(card => card.classList.remove('open')); // geht alle Cards durch und entfernt Klasse "open"

    const text = document.querySelectorAll('.vorsorge-card-text');
    text.forEach(i => i.classList.add('hidden')); // versteckt die texte

    if (event.currentTarget instanceof HTMLElement) { //TS weiß so, dass card ein HTML-Element ist
      const card = event.currentTarget;

      if (this.openCardIndex !== index) {
        card.classList.add('open');
        card.querySelector('.vorsorge-card-text')?.classList.remove('hidden');
        this.openCardIndex = index;
      } else {
        this.openCardIndex = null;
      }
    }
  }
}