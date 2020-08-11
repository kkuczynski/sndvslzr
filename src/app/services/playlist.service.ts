import { Injectable } from '@angular/core';
import { UrlObject } from 'url';

@Injectable()
export class PlaylistService {

  private playlist: string[] = [];
  private playlistSrc: UrlObject[] = [];
  private currentSong: number;
  private sound: HTMLAudioElement = <HTMLAudioElement><unknown>document.getElementById('sound');
  private paused = true;

  constructor() { }

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
    this.currentSong = index;
    this.sound = new Audio();
    this.sound = <HTMLAudioElement><unknown>document.getElementById('sound');
    this.sound.src = this.playlistSrc[index] as unknown as string;
    this.paused = false;
    console.log('load' + index)
    this.play();
  }

  loadNextSong() {
    if (this.currentSong < this.playlist.length) {
      this.currentSong++;
      this.loadSong(this.currentSong);
    }
    else {
      this.currentSong = 0;
      this.loadSong(this.currentSong);
    }
  }



  play(): boolean {
    if (this.playlist.length === 0) {
      return false;
    }
    else {
      if (!this.sound) {
        this.loadSong(0);
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
}

class Times {
  current = 0;
  end: number;
}

