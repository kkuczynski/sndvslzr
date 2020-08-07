import { Component } from '@angular/core';
import { NightModeService } from './services/night-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sndvslzr';
  private nightMode: NightModeService;
  constructor() {
    this.nightMode = new NightModeService;
  }


  changeNightMode() {
    if(this.nightMode.getNightMode()===1) {
      console.log('sun lowering, moon rising');
      document.getElementById('sun').style.animationName = 'iconTransitionOff';
      document.getElementById('moon').style.animationName = 'iconTransitionOn';
      document.getElementById('bar').style.animationName = 'backgroundTransitionOff';
      document.getElementById('body').style.animationName = 'backgroundTransitionOff';
    } else {
      console.log('sun rising, moon lowering');
      document.getElementById('sun').style.animationName = 'iconTransitionOn';
      document.getElementById('moon').style.animationName = 'iconTransitionOff';
      document.getElementById('bar').style.animationName = 'backgroundTransitionOn';
      document.getElementById('body').style.animationName = 'backgroundTransitionOn';
    }
    this.nightMode.changeNightMode()
  }

  getNightMode(): number {    
    return this.nightMode.getNightMode();
  
  }
}