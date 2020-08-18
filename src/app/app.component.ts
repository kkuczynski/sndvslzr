import { Component } from '@angular/core';
import { NightModeService } from './services/night-mode.service';
import { UrlObject } from 'url';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { JsonPipe, DatePipe } from '@angular/common';
import { YoutubeService } from './services/youtube.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sndvslzr';
  private _nightMode: NightModeService;
  public currentSongId = 0;
  public playlistLength: number = 0;
  private _playlist: string[] = [];
  private _playlistSrc: UrlObject[] = [];
  private _sound: HTMLAudioElement = <HTMLAudioElement><unknown>document.getElementById('sound');
  private _paused = true;
  private _movedOn = false;
  public loop = false;
  public shuffle = false;
  public times: Times = new Times;
  public volume: number = 0.5;
  private _volumeSlider;
  public mouseOverSong = -1;
  public currentTitle = '';
  private _audioCtx;
  public analyser;
  public dataArray;
  private _visualizerIsSet = false;
  public canvas;
  public ctx;
  public width;
  public height;
  public barHeight;
  public barWidth;
  public x;
  public bufferLength;
  public link = null;

  constructor(
    private youtubeService: YoutubeService
    ) {
    this._nightMode = new NightModeService();
  }

  ngOnInit(): void {
    this.handleVolume();
  }

  linkChanged(event) {
    this.link = event.target.value;
    console.log(this.link);
  }

  submitYoutubeLink() {
    let src = this.youtubeService.addYoutubeToPlaylist(this.link);
    this.addToPlaylistSrc(src);
    this.addToPlaylist(src as unknown as File)
  }
  getLink() {
    return this.link;
  }

  setCanvas() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.barWidth = (this.width / this.bufferLength) * 2.5;
    this.barHeight;
    this.x = 0;
  }

  setVisualizer() {
    if (!this._visualizerIsSet) {
      this._audioCtx = new AudioContext();
      let src = this._audioCtx.createMediaElementSource(this._sound);
      this.analyser = this._audioCtx.createAnalyser();
      src.connect(this.analyser);
      this.analyser.connect(this._audioCtx.destination);
      this.analyser.fftSize = 256;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      this._visualizerIsSet = true;
    }
  }

  visualize() {
    var x = 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    if (!this._nightMode.getNightMode()) {
      this.ctx.fillStyle = "rgba(15, 21, 44, 1)"
    } else {
      this.ctx.fillStyle = "rgba(130, 220, 236,1)"
    }
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.bufferLength; i++) {
      this.barHeight = this.dataArray[i]/2.2;
      let r = 150 + (this.barHeight * 4);
      let g = 0 + (this.barHeight*0.7);
      let b = 200 - (this.barHeight * 4);
      this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",1)";
      this.ctx.fillRect(x, this.height - this.barHeight, this.barWidth, this.barHeight);
      x += this.barWidth + 1;
    }
  }
  mouseOnSong(i: number) {
    this.mouseOverSong = i;
  }

  playlistOnMouseEnter() {
    document.getElementById('playlist').style.width = '25%';
    document.getElementById('playlist').style.borderLeft = 'solid 2px';
    document.getElementById('playlist').style.transitionDuration = '0.5s';
    // document.getElementById('playlist').style.opacity = '0.9';
  }

  playlistOnMouseLeave() {
    document.getElementById('playlist').style.width = '30px';
    document.getElementById('playlist').style.borderLeft = 'solid 20px';
    // document.getElementById('playlist').style.opacity = '0.5';   
  }

  drop(event: CdkDragDrop<string[]>) {
    let tmpCurrentSong = this._playlist[this.currentSongId];
    moveItemInArray(this._playlistSrc, event.previousIndex, event.currentIndex);
    moveItemInArray(this._playlist, event.previousIndex, event.currentIndex);
    this.currentSongId = this._playlist.findIndex(song => song === tmpCurrentSong);
  }

  handleVolume() {
    this._volumeSlider = document.getElementById('volumeSlider');
    this._volumeSlider.addEventListener('input', (event) => {
      this.volume = event.target.value;
      if (this._sound) {
        this._sound.volume = this.volume;
      }
    });

  }
  addToPlaylist(file: File) {
    this._playlist.push(file.name);
  }

  getSound(): HTMLAudioElement {
    return this._sound;
  }

  addToPlaylistSrc(file) {
    this._playlistSrc.push(file);
  }

  getPlaylist(): string[] {
    return this._playlist;
  }

  getSongPercentage(): number {
    return this._sound.currentTime / this._sound.duration * 100;
  }

  getIsPaused(): boolean {
    if (!this._sound) {
      return true;
    } else {
      return this._paused
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
    this._sound = new Audio();
    this._sound = <HTMLAudioElement><unknown>document.getElementById('sound');
    this._sound.src = this._playlistSrc[index] as unknown as string;
    this._paused = true;
    //this.sound.load;
    document.getElementById('timeSlider').addEventListener('input', (event) => {
      this.setTime(event);
    })
    this._sound.volume = this.volume;
    this.currentTitle = this._playlist[this.currentSongId];
    this.setVisualizer();
    this.setCanvas()
  }

  delete(i: number) {
    if (this.playlistLength > 1) {
      this._playlist.splice(i, 1);
      this._playlistSrc.splice(i, 1);
      this.playlistLength--;
    }
  }

  mute() {
    this.volume = 0;
    if (this._sound) {
      this._sound.volume = this.volume;
    }
  }

  maxVolume() {
    this.volume = 1;
    if (this._sound) {
      this._sound.volume = this.volume;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  play(id?: number): boolean {
    if (this._playlist.length === 0) {
      document.getElementById('addfile').click();
    }
    else {
      if (!this._sound) {
        this.loadSong(id ? id : this.currentSongId);
      }

      if (this._sound) {
        this._sound.addEventListener('playing', () => {
          this.times.setDuration(this._sound.duration);
          this.times.updateCurrent(this._sound.currentTime);
          this._movedOn = false;
          document.getElementById('timeSlider').addEventListener('input', (event) => {
            this.setTime(event);
          })
        })
        this._sound.addEventListener('ended', () => {
          if (!this._movedOn) {
            this.moveOn();
            this._movedOn = true;
          }
        })
        this._sound.addEventListener('timeupdate', () => {
          document.getElementById('timeSlider').setAttribute('value', this._sound.currentTime.toString());
          this.times.updateCurrent(this._sound.currentTime);
          this.analyser.getByteFrequencyData(this.dataArray);

        })
        document.getElementById('timeSlider').addEventListener('input', (event) => {
          this.setTime(event);
        });

      }
      if (this._paused) {
        this._sound.play()
        setInterval(() => {

          this.visualize();

        }, 1000 / 60);
        this._paused = false;
        return true;
      } else {
        this._sound.pause();
        this._paused = true;
        return true;
      }
    }
  }

  setTime(event) {
    this._sound.currentTime = event.target.value;
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
    if (this._playlist.length > 0) {
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
    if (this._playlist.length > 0) {
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
 
    if (this.playlistLength>0) {
    document.getElementById('playlist').style.transitionDuration = '0s';
    }
    this._nightMode.changeNightMode()
  }

  isPaused(): boolean {
    return this.getIsPaused();
  }

  getNightMode(): number {
    return this._nightMode.getNightMode();
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