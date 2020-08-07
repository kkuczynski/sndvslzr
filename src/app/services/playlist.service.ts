import { Injectable } from '@angular/core';
import { UrlObject } from 'url';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlist:string[] = [];
  private playlistSrc: UrlObject[] = [];
  private currentSong;
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

  play(index: number) {
    let sound = new Audio();
    sound = document.getElementById('sound') as unknown as HTMLAudioElement;     
    sound.src = this.playlistSrc[index] as unknown as string;    
    sound.play;
    
  }
}
