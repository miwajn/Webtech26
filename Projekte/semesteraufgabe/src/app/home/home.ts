import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  toggle(event: MouseEvent): void {
    const card = (event.currentTarget as HTMLElement);
    card.classList.toggle('open');
    const text = card.querySelector('.vorsorge-card-text');
    text?.classList.toggle('hidden');
}

}
