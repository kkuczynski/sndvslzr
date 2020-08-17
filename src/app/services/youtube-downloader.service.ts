import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class YoutubeDownloaderService {
  private YoutubeMp3Downloader = require("youtube-mp3-downloader");
  private youtubeDownloader;
  constructor() {
    this.youtubeDownloader = new this.YoutubeMp3Downloader({
      "ffmpegPath": "/path/to/ffmpeg",        // FFmpeg binary location
      "outputPath": "/path/to/mp3/folder",    // Output file location (default: the home directory)
      "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
      "queueParallelism": 2,                  // Download parallelism (default: 1)
      "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
      "allowWebm": false                      // Enable download from WebM sources (default: false)
  });
   }


   download(link: string) {
    let songId = '';
    let gatherData = false;
    let counter = 0;
    for (let i = 0; i < link.length; i++) {
      if (gatherData && counter < 11) {
        songId+=link.charAt(i);
        counter++;
      }
      if (link.charAt(i) === 'y') {
        if(link.charAt(i+5)==='.'){ // youtu.be
          i+=9;
          gatherData = true;
        } else if(link.charAt(i+5)==='b') { // youtube
          i+=15; // get to song id
          gatherData = true;
        }
      }
    }
    this.youtubeDownloader.download(songId);
   }
   
}
