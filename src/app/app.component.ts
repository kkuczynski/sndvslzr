import { Component } from '@angular/core';
import { NightModeService } from './services/night-mode.service';
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
  public loop = false;
  public shuffle = false;

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
  changeLoop() {
    if (this.loop && !this.shuffle) {
      this.loop = false;
    } else {
      this.loop = true;
    }
  }
  changeShuffle(){
    if (this.shuffle) {
      this.shuffle = false;
    } else {
      this.shuffle = true;
      this.loop = true;
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
    return new Promise(resolve => setTimeout(resolve, ms));
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
        this.sound.addEventListener('ended', () => {
          if (!this.movedOn) {
            console.log('willmoveon')
            this.moveOn();
            this.movedOn = true;
            return;
          }
        })
        document.getElementById('timeSlider').addEventListener('input', (event) => {
          this.setTime(event);
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

  setTime(event) {
    console.log('set');
    this.sound.currentTime = event.target.value;
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

    if (this.currentSongId < this.playlistLength - 1) {
      console.log(this.currentSongId);
      console.log(this.playlistLength);
      if(!this.shuffle){
      this.currentSongId++;
      } else {
        let tmpCurrentSongId=this.currentSongId;
        this.currentSongId = Math.floor((Math.random() * (this.playlistLength)));
        if(tmpCurrentSongId === this.currentSongId) {
          if(this.currentSongId === this.playlistLength-1) {
            this.currentSongId = 0;
          } else {
            this.currentSongId++;
          }         
        }
      }
      this.loadSong(this.currentSongId);
      this.play();
    }
    else {
      this.currentSongId = 0;
      this.loadSong(this.currentSongId);
      if (this.loop) {
        this.play();
      }
    }

  }
  stepForward() {
    if (this.playlist.length > 0) {
      if (this.currentSongId < this.playlistLength - 1) {
        this.currentSongId++;
      }
      else {
        this.currentSongId = 0;
      }
      this.loadSong(this.currentSongId);

      this.play();

    }
  }
  stepBackward() {
    if (this.playlist.length > 0) {
      if (this.currentSongId > 0) {
        this.currentSongId--;
      }
      else {
        this.currentSongId = this.playlistLength - 1;
      }
      this.loadSong(this.currentSongId);
      console.log(this.paused);

      this.play();

    }
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
      document.getElementById('moon').style.animationName = 'iconTransitionMoonOn';
      // document.getElementById('bar').style.animationName = 'backgroundTransitionOff';
      document.getElementById('body').style.animationName = 'backgroundTransitionOff';
      document.getElementById('music').style.animationName = 'iconTransitionMusicOff';
      document.getElementById('palm').style.animationName = 'pngTransitionOff';

      document.getElementById('play').style.animationName = 'iconTransitionMusicOff';
      document.getElementById('forward').style.animationName = 'iconTransitionMusicOff';
      document.getElementById('backward').style.animationName = 'iconTransitionMusicOff';
      document.getElementById('shuffle').style.animationName = 'iconTransitionMusicOff';
      document.getElementById('loop').style.animationName = 'iconTransitionMusicOff';
      document.getElementById('timeSlider').style.animationName = 'sliderTransitionOff';
      
    } else {
      console.log('sun rising, moon lowering');
      document.getElementById('sun').style.animationName = 'iconTransitionSunOn';    
      document.getElementById('moon').style.animationName = 'iconTransitionMoonOff';
      // document.getElementById('bar').style.animationName = 'backgroundTransitionOn';
      document.getElementById('body').style.animationName = 'backgroundTransitionOn';
      document.getElementById('music').style.animationName = 'iconTransitionMusicOn';
      document.getElementById('palm').style.animationName = 'pngTransitionOn';

        document.getElementById('play').style.animationName = 'iconTransitionMusicOn';
        document.getElementById('forward').style.animationName = 'iconTransitionMusicOn';
        document.getElementById('backward').style.animationName = 'iconTransitionMusicOn';
        document.getElementById('shuffle').style.animationName = 'iconTransitionMusicOn';
        document.getElementById('loop').style.animationName = 'iconTransitionMusicOn';
        document.getElementById('timeSlider').style.animationName = 'sliderTransitionOn';

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