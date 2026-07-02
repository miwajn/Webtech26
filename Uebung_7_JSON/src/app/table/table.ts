import { Component, inject, OnInit, signal } from '@angular/core';
import { Dataservice } from '../shared/dataservice';
import { Member } from '../shared/member';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnInit{
  
  memberservice = inject(Dataservice)
  members = signal<Member[]>([]) //Typisierung von signal 

  async ngOnInit(): Promise<void> {
    const data = await this.memberservice.getAllMembers() // Rückgabe Promise
    this.members.set(data)
    console.log('members in table : ', this.members())
  } 

}
