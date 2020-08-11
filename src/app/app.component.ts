import { Component } from '@angular/core';
import { NightModeService } from './services/night-mode.service';
import { PlaylistService } from './services/playlist.service';
import { UrlObject } from 'url';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sndvslzr';
  private nightMode: NightModeService;  
  public currentSongId = 0;
  private songLoaded = false;  
  private progressBar = document.getElementById('timeSlider');
  public playlistLength: number = 0;
  private playlist: string[] = [];
  private playlistSrc: UrlObject[] = [];  
  private sound: HTMLAudioElement = <HTMLAudioElement><unknown>document.getElementById('sound');
  private paused = true;
  private movedOn = false;
  
  constructor() {    
    this.nightMode = new NightModeService();
  }
  

  addToPlaylist(file: File) {
    this.playlist.push(file.name);
  }

  getSound(): HTMLAudioElement {
    return this.sound;
  }
  addToPlaylistSrc(file) {
    this.playlistSrc.push(file);
  }

  getPlaylist(): string[] {
    return this.playlist;
  }

  getSongPercentage(): number {
    return this.sound.currentTime / this.sound.duration * 100;
  }

  getIsPaused(): boolean {
    if (!this.sound) {
      return true;
    } else {
      return this.paused
    }
  }

  loadSong(index: number) {
    this.currentSongId = index;
    this.sound = new Audio();
    this.sound = <HTMLAudioElement><unknown>document.getElementById('sound');
    this.sound.src = this.playlistSrc[index] as unknown as string;
    this.paused = false;
    console.log('load' + index)
    this.play();
  }

  delay(ms: number) {    
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  play(): boolean {
    if (this.playlist.length === 0) {
      document.getElementById('addfile').click();
    }
    else {
      if (!this.sound) {
        this.loadSong(this.currentSongId);        
      }
      if (this.sound) {
        this.sound.addEventListener('playing', () => {
          console.log('change');
          this.movedOn = false;
        })
        this.sound.addEventListener('ended',() => {
          if (!this.movedOn) {
          console.log('willmoveon')
          this.moveOn();
          this.movedOn=true;
          return;
          }
        });
      }
      if (this.paused) {
        this.sound.play()
        this.paused = false;
        return true;
      } else {
        this.sound.pause();
        this.paused = true;
        return true;
      }
    }
  }


  public onChange(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      this.addToPlaylistSrc(URL.createObjectURL(fileList[i]));
      let file = fileList[i];
      console.log(file);
      this.addToPlaylist(file);
      this.playlistLength++;
    }
  }

  refreshSlider() {
    console.log('refreshing');
  }

  moveOn() {
    
    if(this.currentSongId < this.playlistLength-1) {
    console.log(this.currentSongId);
    console.log(this.playlistLength);
    this.currentSongId++;
    this.loadSong(this.currentSongId);   
    }
    else {
      this.currentSongId = 0;
      this.loadSong(this.currentSongId);     
    }
    this.play();
  }

  getPlaylistService(): string[] {
    return this.getPlaylist();
  }

  getCurrentSong(): string {
    return this.getPlaylist()[this.currentSongId];
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

  isPaused(): boolean {
    return this.getIsPaused();
  }
  
  
  getNightMode(): number {
    return this.nightMode.getNightMode();

  }

  getCurrentSongId(): number {    
    return this.currentSongId;
  }
}