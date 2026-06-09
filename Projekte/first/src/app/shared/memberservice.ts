import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Memberservice {

  private members = [];

  getMembers(): any {
    return fetch('members.json')
    .then( response => response.json())
    .then( jsonData => {
        this.members = jsonData
        console.log(' im service : ', this.members)
        return.members
      })
  }

}
