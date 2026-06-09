import { Component, inject } from '@angular/core';
import { Eins } from './eins/eins';
import { Zwei } from './zwei/zwei';
import { Memberservice } from '../shared/memberservice';

@Component({
  selector: 'app-main',
  imports: [Eins, Zwei],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {

  title: string = "Hallo FIW";
  isDisabled = false;
  bildQuelle1 = "https://www.htw-berlin.de/files/Presse/_tmp_/e/e/csm_WH-Turm-DSC219610-HTW_Berlin-Alexander_Rentsch_dbfb72b7e5.jpg";
  bildQuelle2 = "https://www.htw-berlin.de/files/Presse/_tmp_/6/4/csm_MBAE-DSC218310-HTW_Berlin-Alexander_Rentsch_60f1a6ca0a.jpg";
  bildQuelle = this.bildQuelle1;
  wh = true;
  bildGroesse = 100;
  buttonname = "Wilhelminenhof";
  private myService = inject(Memberservice);

  changeImg(): void {
    if(this.wh) {
      this.bildQuelle = this.bildQuelle2;
      this.wh = false;
      this.buttonname = "Studierende";

    }
    else {
      this.bildQuelle = this.bildQuelle1;
      this.wh = true;
      this.buttonname = "Wilhelminenhof";
    }
  }

  smaller() {
    if(this.bildGroesse > 1000){
      this this.bildGroesse /=2;
    }
  }

  bigger() {
    if(this.bildGroesse < 1000){
      this.bildGroesse *=2;
    } 
  }

}
