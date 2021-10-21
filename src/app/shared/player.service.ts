import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor() {}

  private playTrackSource = new Subject<string>();
  private playTracksSource = new Subject<any>();

  private pauseTrackSource = new Subject();
  private trackEndedSource = new Subject();

  playTrack$ = this.playTrackSource.asObservable();
  pauseTrack$ = this.pauseTrackSource.asObservable();
  trackEnded$ = this.trackEndedSource.asObservable();
  showPlayer: boolean = false;
  playing:boolean = false;
  trackQueue: any;


  isPlaying(){
    return this.playing;
  }
  
  setPlaying(playing: boolean){
    this.playing = playing;
  }

  isShowing(){
    return this.showPlayer;
  }

  shouldShow(show: boolean){
    this.showPlayer = show;
  }

  playTrack(previewUrl: string) {
    this.playTrackSource.next(previewUrl);
  }

  queueTracks(tracks: any) {
    this.trackQueue = tracks;
  }

  getQueue(){
    return this.trackQueue;
  }

  pauseTrack() {
    this.pauseTrackSource.next();
  }

  trackEnded() {
    this.trackEndedSource.next();
  }
}
