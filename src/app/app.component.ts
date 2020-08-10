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
  private currentSongId = 0;
  private songLoaded = false;

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

  getPlaylistService(): string[] {
    return this.playlistService.getPlaylist();
  }

  getCurrentSong(): string {
    return this.playlistService.getPlaylist()[this.currentSongId];
  }

  changeNightMode() {
    if (this.nightMode.getNightMode() === 1) {
      console.log('sun lowering, moon rising');
      document.getElementById('sun').style.animationName = 'iconTransitionSunOff';
      document.getElementById('play').style.animationName = 'iconTransitionMusicOff';
      document.getElementById('moon').style.animationName = 'iconTransitionMoonOn';
      // document.getElementById('bar').style.animationName = 'backgroundTransitionOff';
      document.getElementById('body').style.animationName = 'backgroundTransitionOff';
      document.getElementById('music').style.animationName = 'iconTransitionMoonOff';
      document.getElementById('palm').style.animationName = 'pngTransitionOff';
    } else {
      console.log('sun rising, moon lowering');
      document.getElementById('sun').style.animationName = 'iconTransitionSunOn';
      document.getElementById('play').style.animationName = 'iconTransitionMusicOn';
      document.getElementById('moon').style.animationName = 'iconTransitionMoonOff';
      // document.getElementById('bar').style.animationName = 'backgroundTransitionOn';
      document.getElementById('body').style.animationName = 'backgroundTransitionOn';
      document.getElementById('music').style.animationName = 'iconTransitionMoonOn';
      document.getElementById('palm').style.animationName = 'pngTransitionOn';
    }
    this.nightMode.changeNightMode()
  }
  load(index: number) {
    this.currentSongId = index;
    this.playlistService.loadSong(this.currentSongId);
  }
  isPaused(): boolean {
    return this.playlistService.getIsPaused();
  }
  play() {
    if (!this.playlistService.play()) {
      document.getElementById('addfile').click();
    }
  }

  overflows(i): boolean {
    const element = document.getElementById(i + 'song');
    if (element) {
    if (element.scrollWidth > element.clientWidth) {
      console.log(element)
      return true;
    } else {
      return false;
    }
  }
  return false
  }
  getNightMode(): number {
    return this.nightMode.getNightMode();

  }

  getCurrentSongId(): number {
    return this.currentSongId;
  }
}