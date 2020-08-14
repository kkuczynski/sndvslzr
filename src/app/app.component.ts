import { Component } from '@angular/core';
import { NightModeService } from './services/night-mode.service';
import { UrlObject } from 'url';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { JsonPipe, DatePipe } from '@angular/common';

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
  public times: Times = new Times;
  public volume: number = 1;
  private volumeSlider;
  public mouseOverSong = -1;
  public currentTitle = '';

  constructor() {
    this.nightMode = new NightModeService();
  }
  ngOnInit(): void {
    this.volumeSlider = document.getElementById('volumeSlider');
    this.handleVolume();

  }

  mouseOnSong(i: number) {
    this.mouseOverSong = i;
  }

  playlistOnMouseEnter() {
    document.getElementById('playlist').style.width = '25%';
    document.getElementById('playlist').style.opacity = '1';
  }

  playlistOnMouseLeave() {
    document.getElementById('playlist').style.width = '40px';
    document.getElementById('playlist').style.opacity = '0.6';
  }

  drop(event: CdkDragDrop<string[]>) {
    let tmpCurrentSong = this.playlist[this.currentSongId];
    moveItemInArray(this.playlistSrc, event.previousIndex, event.currentIndex);
    moveItemInArray(this.playlist, event.previousIndex, event.currentIndex);
    this.currentSongId = this.playlist.findIndex(song => song === tmpCurrentSong);
  }

  handleVolume() {
    this.volumeSlider.addEventListener('input', (event) => {
      this.volume = event.target.value;
      if (this.sound) {
        this.sound.volume = this.volume;
      }
    });

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

  changeShuffle() {
    if (this.shuffle) {
      this.shuffle = false;
    } else {
      this.shuffle = true;
      this.loop = true;
    }
  }

  loadSongFromPlaylist(i: number) {
    this.loadSong(i);
    this.play();
  }

  loadSong(index: number) {
    this.currentSongId = index;
    this.sound = new Audio();
    this.sound = <HTMLAudioElement><unknown>document.getElementById('sound');
    this.sound.src = this.playlistSrc[index] as unknown as string;
    this.paused = true;
    //this.sound.load;
    document.getElementById('timeSlider').addEventListener('input', (event) => {
      this.setTime(event);
    })
    this.sound.volume = this.volume;
    this.currentTitle = this.playlist[this.currentSongId];
  }

  delete(i: number) {
    if (this.playlistLength > 1) {
      this.playlist.splice(i, 1);
      this.playlistSrc.splice(i, 1);
      this.playlistLength--;
    }
  }

  mute() {
    this.volume = 0;
    if (this.sound) {
      this.sound.volume = this.volume;
    }
  }

  maxVolume() {
    this.volume = 1;
    if (this.sound) {
      this.sound.volume = this.volume;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  play(id?: number): boolean {
    if (this.playlist.length === 0) {
      document.getElementById('addfile').click();
    }
    else {
      if (!this.sound) {
        this.loadSong(id ? id : this.currentSongId);
      }

      if (this.sound) {
        this.sound.addEventListener('playing', () => {
          this.times.setDuration(this.sound.duration);
          this.times.updateCurrent(this.sound.currentTime);
          this.movedOn = false;
          document.getElementById('timeSlider').addEventListener('input', (event) => {
            this.setTime(event);
          })
        })
        this.sound.addEventListener('ended', () => {
          if (!this.movedOn) {
            this.moveOn();
            this.movedOn = true;
          }
        })
        this.sound.addEventListener('timeupdate', () => {
          document.getElementById('timeSlider').setAttribute('value', this.sound.currentTime.toString());
          this.times.updateCurrent(this.sound.currentTime);
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
    this.sound.currentTime = event.target.value;
  }
  public addSongs(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      this.addToPlaylistSrc(URL.createObjectURL(fileList[i]));
      let file = fileList[i];      
      this.addToPlaylist(file);
      this.playlistLength++;
    }
  }

  // public addPlaylist(fileList: FileList) {  
  //   if(fileList.length === 1) {     
  //     let file = fileList[0];      
  //     let startIndex = 0;
  //     let endIndex = 0;
  //     let firstEof = 0;
  //     let songName = '';
  //     let songSrc = '';
  //     let currentChar = '';
  //     let gatherData = false;
  //     let lala = Promise.resolve(file.text()).then(fileContent => {
  //         console.log(fileContent)          
  //          firstEof =  fileContent.search(']');
  //          for (let index = 0; index < firstEof; index++) {
  //             currentChar = fileContent.charAt(index);
  //             if (currentChar === '"') {
  //               if (gatherData) {
  //                 gatherData = false;
  //               } else {
  //                 gatherData = true
  //               }
  //             }
  //             else if (gatherData) {
  //               songName+=currentChar;
  //             }
  //             if(!gatherData && songName.length > 0) {
  //               this.playlist.push(songName);
  //               console.log(songName);
  //               songName = '';
  //             }
  //          }
  //          for (let index = firstEof+1; index < fileContent.length; index++) {
  //           currentChar = fileContent.charAt(index);
  //           if (currentChar === '"') {
  //             if (gatherData) {
  //               gatherData = false;
  //             } else {
  //               gatherData = true
  //             }
  //           }
  //           else if (gatherData) {
  //             songSrc+=currentChar;
  //           }
  //           if(!gatherData && songSrc.length > 0) {
  //             this.playlistSrc.push(songSrc as unknown as UrlObject);
  //             console.log(songSrc);
  //             songSrc = '';
  //           }
  //          }
          
  //     });
  //     console.log(lala);
  //   }
  // }

  moveOn() {
    if (this.currentSongId < this.playlistLength - 1) {
      if (!this.shuffle) {
        this.currentSongId++;
      } else {
        let tmpCurrentSongId = this.currentSongId;
        this.currentSongId = Math.floor((Math.random() * (this.playlistLength)));
        if (tmpCurrentSongId === this.currentSongId) {
          if (this.currentSongId === this.playlistLength - 1) {
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
    {
      // if (this.nightMode.getNightMode() === 1) {
      //   console.log('sun lowering, moon rising');
      //   document.getElementById('sun').style.animationName = 'iconTransitionSunOff';
      //   document.getElementById('moon').style.animationName = 'iconTransitionMoonOn';
      //   // document.getElementById('bar').style.animationName = 'backgroundTransitionOff';
      //   document.getElementById('body').style.animationName = 'backgroundTransitionOff';
      //   document.getElementById('music').style.animationName = 'iconTransitionMusicOff';
      //   document.getElementById('palm').style.animationName = 'pngTransitionOff';
      //   document.getElementById('play').style.animationName = 'iconTransitionMusicOff';
      //   document.getElementById('forward').style.animationName = 'iconTransitionMusicOff';
      //   document.getElementById('backward').style.animationName = 'iconTransitionMusicOff';
      //   document.getElementById('shuffle').style.animationName = 'iconTransitionMusicOff';
      //   document.getElementById('loop').style.animationName = 'iconTransitionMusicOff';
      //   document.getElementById('timeSlider').style.animationName = 'sliderTransitionOff';
      //   document.getElementById('volumeSlider').style.animationName = 'sliderTransitionOff';
      //   document.getElementById('speaker').style.animationName = 'iconTransitionMusicOff';
      //   document.getElementById('mute').style.animationName = 'iconTransitionMusicOff';

      // } else {
      //   console.log('sun rising, moon lowering');
      //   document.getElementById('sun').style.animationName = 'iconTransitionSunOn';
      //   document.getElementById('moon').style.animationName = 'iconTransitionMoonOff';
      //   // document.getElementById('bar').style.animationName = 'backgroundTransitionOn';
      //   document.getElementById('body').style.animationName = 'backgroundTransitionOn';
      //   document.getElementById('music').style.animationName = 'iconTransitionMusicOn';
      //   document.getElementById('palm').style.animationName = 'pngTransitionOn';
      //   document.getElementById('play').style.animationName = 'iconTransitionMusicOn';
      //   document.getElementById('forward').style.animationName = 'iconTransitionMusicOn';
      //   document.getElementById('backward').style.animationName = 'iconTransitionMusicOn';
      //   document.getElementById('shuffle').style.animationName = 'iconTransitionMusicOn';
      //   document.getElementById('loop').style.animationName = 'iconTransitionMusicOn';
      //   document.getElementById('timeSlider').style.animationName = 'sliderTransitionOn';
      //   document.getElementById('volumeSlider').style.animationName = 'sliderTransitionOn';
      //   document.getElementById('speaker').style.animationName = 'iconTransitionMusicOn';
      //   document.getElementById('mute').style.animationName = 'iconTransitionMusicOn';

      // }
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

  // save() {
  //   const currentDate = new Date();
  //   const dateString = currentDate.getMonth() + '-' + currentDate.getDate() + '-' + currentDate.getFullYear();
  //   const json1 = JSON.stringify(this.playlist);
  //   const json2 = JSON.stringify(this.playlistSrc);
  //   var dataStr = "data:object/json;charset=utf-8," + encodeURIComponent(json1) + encodeURIComponent(json2);
  //   var downloadAnchorNode = document.createElement('a');
  //   downloadAnchorNode.setAttribute("href", dataStr);
  //   downloadAnchorNode.setAttribute("download", dateString + ".playlist");
  //   document.body.appendChild(downloadAnchorNode);
  //   downloadAnchorNode.click();
  //   downloadAnchorNode.remove();
  // }
}

class Times {
  currentMin: number;
  currentSec: string;
  durationMin: number;
  durationSec: string;

  setDuration(duration: number) {
    this.durationMin = Math.floor(duration / 60);
    let tmpDurationSec = Math.floor(duration - (this.durationMin * 60));
    if (tmpDurationSec < 10) {
      this.durationSec = '0' + tmpDurationSec;
    } else {
      this.durationSec = tmpDurationSec.toString();
    }
  }

  updateCurrent(current: number) {
    this.currentMin = Math.floor(current / 60);
    let tmpCurrentSec = Math.floor(current - (this.currentMin * 60));
    if (tmpCurrentSec < 10) {
      this.currentSec = '0' + tmpCurrentSec;
    } else {
      this.currentSec = tmpCurrentSec.toString();
    }
  }
}