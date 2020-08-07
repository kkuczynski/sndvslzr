import { Component } from '@angular/core';
import { NightModeService } from './services/night-mode.service';
import { PlaylistService } from './services/playlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sndvslzr';
  private nightMode: NightModeService;
  private playlistService: PlaylistService;
  constructor() {
    this.nightMode = new NightModeService;
    this.playlistService = new PlaylistService;
  }

  public onChange(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      this.playlistService.addToPlaylistSrc(URL.createObjectURL(fileList[i]));
      let file = fileList[i];
      console.log(file);
      this.playlistService.addToPlaylist(file);
      console.log(this.playlistService.getPlaylist());
    }    
  }

  getPlaylistService() : string[] {
    return this.playlistService.getPlaylist();
  }

  changeNightMode() {
    if (this.nightMode.getNightMode() === 1) {
      console.log('sun lowering, moon rising');
      document.getElementById('sun').style.animationName = 'iconTransitionSunOff';
      document.getElementById('moon').style.animationName = 'iconTransitionMoonOn';
      // document.getElementById('bar').style.animationName = 'backgroundTransitionOff';
      document.getElementById('body').style.animationName = 'backgroundTransitionOff';
      document.getElementById('music').style.animationName = 'iconTransitionMoonOff';
      document.getElementById('palm').style.animationName = 'pngTransitionOff';
    } else {
      console.log('sun rising, moon lowering');
      document.getElementById('sun').style.animationName = 'iconTransitionSunOn';
      document.getElementById('moon').style.animationName = 'iconTransitionMoonOff';
      // document.getElementById('bar').style.animationName = 'backgroundTransitionOn';
      document.getElementById('body').style.animationName = 'backgroundTransitionOn';
      document.getElementById('music').style.animationName = 'iconTransitionMoonOn';
      document.getElementById('palm').style.animationName = 'pngTransitionOn';
    }
    this.nightMode.changeNightMode()
  }

  play(i: number) {
    console.log('playing');
    this.playlistService.play(i);
  }

  getNightMode(): number {
    return this.nightMode.getNightMode();

  }
}