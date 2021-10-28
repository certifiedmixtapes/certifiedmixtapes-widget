import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

// @ts-ignore: Javascript
declare var WaveSurfer;

@Component({
  selector: 'custom-top-songs',
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.scss']
})
export class TopSongsComponent implements OnInit {
  singleArray: Array<any> = [];
  isPlaying = false;
  wave: Array<any> = [];
  shouldPlay = false;



  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log("ngOnInit")

    this.http.get<any>(environment.apiUrl + '/api/tracks/paged?accesskey=4a4897e2-2bae-411f-9c85-d59789afc758&trackSort=4&range=1&singleType=1&itemsPerPage=20&currentPage=1').subscribe(
      response => {
              this.singleArray = response.responseObject[0].items;
              
          }
    );
  }

  pause(){

  }

  play(){}

  generateWaveform(id: number): void {
    var idString = id.toString();
    var container ="#waveform" + idString
    console.log("generateWaveForm: " + container);
    Promise.resolve(null).then(() => {
      this.wave[id] = WaveSurfer.create({
        container: container,
        waveColor: 'black',
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

      this.wave[id].on('ready', () => {
        //this.unmuteService.unmute(this.wave.backend.getAudioContext())
        if(this.shouldPlay){
          this.wave[id].play();
          this.isPlaying = true;
        }
      });

      this.wave[id].on('finish', () => {
        //this.next();
        this.isPlaying = true;
      });
    });
  }

  loadTrack(previewUrl: any, id: number) {
    console.log("loadTrack")
    this.generateWaveform(id);
    this.cdr.detectChanges();

    Promise.resolve().then(() => this.wave[id].load(previewUrl));

  }

  loadAllTracks(){
    for(let s = 0; s < this.singleArray.length; s++){
      var trackUrl = this.singleArray[s].trackURL;
      this.loadTrack(trackUrl, s);
    }
  }

}
