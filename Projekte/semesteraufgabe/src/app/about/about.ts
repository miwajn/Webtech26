import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

  openCardIndex: number | null = null;  // null = keine Karte geöffnet

  toggle(event: MouseEvent, index: number): void {
    const cards = document.querySelectorAll('.kontakt-card');
    cards.forEach(card => card.classList.remove('open')); // geht alle Cards durch und entfernt Klasse "open"

    const text = document.querySelectorAll('.kontakt-card-text');
    text.forEach(i => i.classList.add('hidden')); // versteckt die texte

    if (event.currentTarget instanceof HTMLElement) { //TS weiß so, dass card ein HTML-Element ist
      const card = event.currentTarget;

      if (this.openCardIndex !== index) {
        card.classList.add('open');
        card.querySelector('.kontakt-card-text')?.classList.remove('hidden');
        this.openCardIndex = index;
      } else {
        this.openCardIndex = null;
      }
    }
  }
}
