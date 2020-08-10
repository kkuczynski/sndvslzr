import { Injectable } from '@angular/core';
import { UrlObject } from 'url';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlist: string[] = [];
  private playlistSrc: UrlObject[] = [];
  private currentSong;
  private sound: HTMLAudioElement = <HTMLAudioElement><unknown>document.getElementById('sound');
  private paused = true;
  constructor() { }

  addToPlaylist(file: File) {
    this.playlist.push(file.name);
    console.log(this.playlist);
  }

  addToPlaylistSrc(file) {
    this.playlistSrc.push(file);
    console.log(this.playlist);
  }

  getPlaylist(): string[] {
    return this.playlist;
  }

  getIsPaused(): boolean {
    if(!this.sound) {
      console.log('no sound')
      return true;
    } else {
    return this.paused
    }
  }

  loadSong(index: number) {
    this.sound = new Audio();
    this.sound = <HTMLAudioElement><unknown>document.getElementById('sound');
    this.sound.src = this.playlistSrc[index] as unknown as string; 
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

