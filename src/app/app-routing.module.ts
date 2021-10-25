import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'embed/:id', component: AudioPlayerComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes,{
    useHash: false,
     scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled',
       relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
