declare var require: any;
import { Injectable } from '@angular/core';
//import * as YoutubeMp3Downloader from 'youtube-mp3-downloader';
@Injectable({
    providedIn: 'root'
})
export class YoutubeService {
    private vid = "";
    addYoutubeToPlaylist(link: string) {
        this.vid = link;
        return this.vid;
    }
}
