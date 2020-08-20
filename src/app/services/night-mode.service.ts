import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NightModeService {

  private nightModeOn = 0;
  constructor() { }

  getNightMode(): number {
    return this.nightModeOn;
  }

  changeNightMode() {
    if(this.nightModeOn === 0) {
    this.nightModeOn = 1
    document.body.style.backgroundColor = "rgb(130, 220, 236)";
    } else {
      this.nightModeOn = 0;
      document.body.style.backgroundColor = "rgb(15, 21, 44)";
 
    }
  }
}
