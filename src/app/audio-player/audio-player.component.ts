import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../shared/player.service';

// @ts-ignore: Javascript
declare var WaveSurfer;


@Component({
  selector: 'custom-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  selectedAlbum: any;
  tracks: Array<any> = [];
  id: string;
  trackTitle: string = "";
  isPlaying = false;
  wave: any = null;
  displayedColumns: string[] = ['Number', 'Name'];
  trackIndex: number = 0;
  shouldPlay = false;
  currentTrack: any = "";
  coverImage: string = "";




  constructor(private http: HttpClient,private route: ActivatedRoute, private playerSer: PlayerService, private cdr: ChangeDetectorRef) { 
    this.id = this.route.snapshot.params['id'];
    
    playerSer.playTrack$.subscribe(order => {
       this.trackIndex = Number(order);
       this.currentTrack = this.playerSer.getQueue()[this.trackIndex];

      
       if(this.currentTrack.trackTitle.includes("-")){
        var artists = this.currentTrack.album.artists;
        this.trackTitle = this.currentTrack.trackTitle.replace(artists, "");
        this.trackTitle = this.trackTitle.replace("-","").trim();
      }
      else {
        this.trackTitle = this.currentTrack.trackTitle;
      }

      this.coverImage = this.currentTrack.album.thumbImg;
      var trackUrl = this.currentTrack.trackURL

      if (environment.production) {
        trackUrl = this.currentTrack.trackURL.replace("http:","https:");
      }

     /* gtag('event', 'play', {
        'event_category': 'audio-media',
        'event_label': 'play-track',
        'value': this.trackTitle   
      })*/
      console.log("trackUrl: "+ trackUrl);
        
      this.loadTrack(trackUrl);
    });
  }

  ngOnInit(): void {
    this.getTracks(this.id);
  }


  getTracks(id: string){
    this.http.get<any>(environment.apiUrl +'/api/tracks?accessKey=4a4897e2-2bae-411f-9c85-d59789afc758&albumId='+ id).subscribe(
      response => {  
        this.selectedAlbum = response.responseObject[0].album;
        this.selectedAlbum.trackCount = response.responseObject.length;
        this.tracks = response.responseObject;
        this.trackTitle = this.tracks[0].trackTitle;
        this.playerSer.queueTracks(this.tracks);
        var order = Number(0);
        this.playerSer.playTrack(order.toString());    
      });
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'white',
        progressColor: "#3b97f9",
        barWidth: 1.8,
        barHeight: 0.5,
        minPxPerSec: 25,
        maxCanvasWidth: 2000,
        height: 70,
        backend: 'MediaElement',
        fillParent: true,
        barGap: 2.5,
      });

      this.wave.on('ready', () => {
        //this.unmuteService.unmute(this.wave.backend.getAudioContext())
        if(this.shouldPlay){
          this.wave.play();
          this.isPlaying = true;
        }
      });

      this.wave.on('finish', () => {
        this.next();
        this.isPlaying = true;
      });
    });
  }

  loadTrack(previewUrl: any) {

    if (!this.wave) {
    this.generateWaveform();
    }

    if ('mediaSession' in navigator) {
      // @ts-ignore: Javascript code
      window.navigator["mediaSession"].metadata = new MediaMetadata({
          title: this.trackTitle,
          artist: this.currentTrack.album.artists,
          album: this.currentTrack.album.title,
          artwork: [
            {src: this.coverImage,   sizes: '96x96',   type: 'image/png'},
            {src: this.coverImage, sizes: '128x128', type: 'image/png'},
            {src: this.coverImage, sizes: '192x192', type: 'image/png'},
            {src: this.coverImage, sizes: '256x256', type: 'image/png'},
            {src: this.coverImage, sizes: '384x384', type: 'image/png'},
            {src: this.coverImage, sizes: '512x512', type: 'image/png'},
          ]
        });

        // @ts-ignore
        window.navigator["mediaSession"].setActionHandler('play', function() {
          window.dispatchEvent(new Event('play-event'));
       });

       // @ts-ignore
       window.navigator["mediaSession"].setActionHandler('pause', function() {
        window.dispatchEvent(new Event('pause-event'));
     });

        // @ts-ignore
        window.navigator["mediaSession"].setActionHandler('previoustrack', function() {
             window.dispatchEvent(new Event('prev-event'));
          });
        
        // @ts-ignore
        window.navigator["mediaSession"].setActionHandler('nexttrack', function() {
            window.dispatchEvent(new Event('next-event'));
          });
      } 

    this.cdr.detectChanges();

    Promise.resolve().then(() => this.wave.load(previewUrl));
    //}

  }

  playTrack(track: any) {
    this.playerSer.queueTracks(this.tracks);
    console.log(track);
    var order = Number(track.order) -1;
    this.playerSer.playTrack(order.toString());
    this.shouldPlay = true;
  }
  
  @HostListener('window:play-event', ['$event']) 
  play(){
      this.wave.play();
      this.isPlaying = true;
  }

  @HostListener('window:pause-event', ['$event']) 
  pause() {
    this.wave.pause();
    this.isPlaying = false;
  }

  @HostListener('window:next-event', ['$event']) 
  next(){
    this.trackIndex = this.trackIndex + 1;

    if(this.trackIndex >= this.playerSer.getQueue().length){
      this.trackIndex = 0;
    }

    this.playerSer.playTrack(this.trackIndex.toString())
  }

  @HostListener('window:prev-event', ['$event']) 
  prev() {
    if(this.trackIndex != 0){
      this.trackIndex = this.trackIndex - 1;
      this.playerSer.playTrack(this.trackIndex.toString())
    }
  }

}
