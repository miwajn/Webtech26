import { Injectable } from '@angular/core';
import { Member } from './member';

@Injectable({
  providedIn: 'root',
})
export class Dataservice {

  async getAllMembers(): Promise<Member[]> {  //Interface-Nutzung Typisierung

    const response = await fetch('assets/members.json') //async-Anfrage durch await
    console.log('response in service : ', response )
    const members = await response.json();
    console.log('members in service : ', members )
    return members; 
 
  }
  
}
