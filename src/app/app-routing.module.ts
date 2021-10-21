import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

const routes: Routes = [
  { path: 'embed/:id', component: AudioPlayerComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes,{
    useHash: false,
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
