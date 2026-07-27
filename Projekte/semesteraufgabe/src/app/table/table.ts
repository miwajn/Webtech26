import { Component, inject, OnInit } from '@angular/core';
import { TerminBackend } from '../../lib/shared/backendServices/termin-backend';
import { Termin } from '../../lib/shared/interfaces/terminInterface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'medCycle-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table.html',
  styleUrl: './table.css',
})

export class Table implements OnInit {

  private bs = inject(TerminBackend);
  termine: Termin[] = [];
 
  ngOnInit(): void {
    this.bs.getAlleTermine()
      .then(response => this.termine = response)
      .then(termine => console.log('Termine in TableComponent : ', termine));
  }

  delete(id: number): void {
   console.log('Termin mit id=${id} löschen')
  }
}