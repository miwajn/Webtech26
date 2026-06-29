export class MembersService {
    private members: any [] = [];   //Array-Erzeugung
  
    getMembers(): Promise<any> {
      return fetch('members.json')
      .then(response => response.json())
      .then(jsonData => {
        this.members = jsonData;
        console.log('all members in my : ', this.members);
        return this.members;
      });
    }
  
    /* mit neuerer async await -Syntax:
  
    async getMembers(): Promise<any> {
      const response = await fetch('members.json');
      this.members = await response.json();
      console.log('all members in my : ', this.members);
      return this.members;
    }
    */
  }