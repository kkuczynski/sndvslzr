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
      document.getElementById('sun').style.animationName = 'iconTransitionSunOff';
      document.getElementById('moon').style.animationName = 'iconTransitionMoonOn';
      // document.getElementById('bar').style.animationName = 'backgroundTransitionOff';
      document.getElementById('body').style.animationName = 'backgroundTransitionOff';
      document.getElementById('music').style.animationName = 'iconTransitionMoonOff';    
    } else {
      console.log('sun rising, moon lowering');
      document.getElementById('sun').style.animationName = 'iconTransitionSunOn';
      document.getElementById('moon').style.animationName = 'iconTransitionMoonOff';
      // document.getElementById('bar').style.animationName = 'backgroundTransitionOn';
      document.getElementById('body').style.animationName = 'backgroundTransitionOn';
      document.getElementById('music').style.animationName = 'iconTransitionMoonOn';
    }
    this.nightMode.changeNightMode()
  }

  getNightMode(): number {    
    return this.nightMode.getNightMode();
  
  }
}